import { verify } from "@dfinity/agent";
import { auto } from "@popperjs/core";
import {
  query,
  update,
  text,
  Null,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  None,
  Some,
  Ok,
  Err,
  ic,
  Principal,
  Opt,
  nat64,
  Result,
  bool,
  Canister,
} from "azle";
import { v4 as uuidv4 } from "uuid";

// Define the User struct to represent users of the platform
const User = Record({
  userId: text,
  owner: Principal,
  name: text,
  email: text,
  phoneNumber: text,
  createdAt: text,
});

// Define the Book struct to represent books available for swap
const Book = Record({
  bookId: text,
  userId: text,
  title: text,
  author: text,
  genre: text,
  description: text,
  imageUrl: text,
  createdAt: text,
});

// Define the SwapRequest struct to represent swap requests between users
const SwapRequest = Record({
  swapRequestId: text,
  ownerId: text,
  requesterId: text,
  bookId: text,
  status: text,
  createdAt: text,
});

// Define the Feedback struct to represent feedback on swaps
const Feedback = Record({
  feedbackId: text,
  userId: text,
  swapRequestId: text,
  rating: nat64,
  comment: text,
  createdAt: text,
});

// Message variant for success and error messages
const Message = Variant({
  Success: text,
  Error: text,
  NotFound: text,
  InvalidPayload: text,
});

// Define all Payload Records for structured input
const UserPayload = Record({
  name: text,
  email: text,
  phoneNumber: text,
});

const BookPayload = Record({
  userId: text,
  title: text,
  author: text,
  genre: text,
  description: text,
  imageUrl: text,
});

const SwapRequestPayload = Record({
  ownerId: text,
  requesterId: text,
  bookId: text,
});

const FeedbackPayload = Record({
  userId: text,
  swapRequestId: text,
  rating: nat64,
  comment: text,
});

// Initialize storage maps
const usersStorage = StableBTreeMap(0, text, User);
const booksStorage = StableBTreeMap(1, text, Book);
const swapRequestsStorage = StableBTreeMap(2, text, SwapRequest);
const feedbackStorage = StableBTreeMap(3, text, Feedback);


// Helper function for validating emails
function isValidEmail(email: string): bool {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function for validating phone numbers
function isValidPhoneNumber(phoneNumber: string): bool {
  const phoneNumberRegex = /^\d{10}$/;
  return phoneNumberRegex.test(phoneNumber);
}

// Improved Canister definition with additional validation and error handling
export default Canister({
  // Create a new user profile with enhanced validation
  createUserProfile: update([UserPayload], Result(User, Message), (payload) => {
    // Validate payload fields
    if (!payload.name || !payload.email || !payload.phoneNumber) {
      return Err({ InvalidPayload: "All fields (name, email, phone number) are required." });
    }

    if (!isValidEmail(payload.email)) {
      return Err({ InvalidPayload: "Invalid email format." });
    }

    if (!isValidPhoneNumber(payload.phoneNumber)) {
      return Err({ InvalidPayload: "Phone number must be a 10-digit number." });
    }

    // Ensure email is unique
    const users = usersStorage.values();
    for (const user of users) {
      if (user.email === payload.email) {
        return Err({ InvalidPayload: "Email already exists." });
      }
    }

    // Create and store the new user
    const userId = uuidv4();
    const newUser = {
      ...payload,
      userId,
      owner: ic.caller(),
      createdAt: new Date().toISOString(),
    };

    usersStorage.insert(userId, newUser);
    return Ok(newUser);
  }),

  // Function to update a specific UserProfile
  updateUserProfile: update(
    [text, UserPayload],
    Result(User, Message),
    (userId, payload) => {
      // Validate the payload
      if (!payload.name || !payload.email || !payload.phoneNumber) {
        return Err({
          InvalidPayload:
            "Ensure 'name', 'email', and 'phoneNumber' are provided.",
        });
      }

      // Check for valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        return Err({
          InvalidPayload:
            "Invalid email format: Ensure the email is in the correct format.",
        });
      }

      // Ensure the email is unique but if it's same for the user being updated, it should be allowed
      const users = usersStorage.values();
      for (const user of users) {
        if (user.email === payload.email && user.userId !== userId) {
          return Err({
            InvalidPayload: "Email already exists: Ensure the email is unique.",
          });
        }
      }

      // Validate the phoneNumber
      const phoneNumberRegex = /^\d{10}$/;
      if (!phoneNumberRegex.test(payload.phoneNumber)) {
        return Err({
          InvalidPayload:
            "Invalid phone number: Ensure the phone number is in the correct format.",
        });
      }

      // Validate the userId
      const userOpt = usersStorage.get(userId);
      if ("None" in userOpt) {
        return Err({ NotFound: "User not found" });
      }

      // Update the user after validation
      const user = userOpt["Some"];
      const updatedUser = {
        ...user,
        ...payload,
      };

      usersStorage.insert(userId, updatedUser);
      return Ok(updatedUser);
    }
  ),

  // Get user by userId
  getUserProfile: query([text], Result(User, Message), (userId) => {
    const userOpt = usersStorage.get(userId);
    if ("None" in userOpt) {
      return Err({ NotFound: "User not found" });
    }

    return Ok(userOpt["Some"]);
  }),

  // Get User Profile by owner principal
  getUserProfileByOwner: query([], Result(User, Message), () => {
    const userProfile = usersStorage.values().filter((user) => {
      return user.owner.toText() === ic.caller().toText();
    });
    if (userProfile.length === 0) {
      return Err({ NotFound: "User not found" });
    }

    return Ok(userProfile[0]);
  }),

  // Get the number of users
  getTotalUsers: query([], Result(nat64, Message), () => {
    const users = usersStorage.values();

    return Ok(BigInt(users.length) as nat64);
  }),

  // Create a new book
  listBook: update([BookPayload], Result(Book, Message), (payload) => {
    // Validate the payload
    if (
      !payload.title ||
      !payload.author ||
      !payload.description ||
      !payload.imageUrl
    ) {
      return Err({
        InvalidPayload:
          "Ensure 'title', 'author', 'description', and 'imageUrl' are provided.",
      });
    }

    // Validate the userId
    const userOpt = usersStorage.get(payload.userId);
    if ("None" in userOpt) {
      return Err({ NotFound: "User not found" });
    }

    // Create the book after validation
    const bookId = uuidv4();
    const book = {
      ...payload,
      bookId,
      createdAt: new Date().toISOString(),
    };

    booksStorage.insert(bookId, book);
    return Ok(book);
  }),

  // Update a book
  updateBook: update(
    [text, BookPayload],
    Result(Book, Message),
    (bookId, payload) => {
      // Validate the payload
      if (!bookId) {
        return Err({
          InvalidPayload: "Ensure 'bookId' is provided.",
        });
      }

      // Validate the bookId
      const bookOpt = booksStorage.get(bookId);
      if ("None" in bookOpt) {
        return Err({ NotFound: "Book not found" });
      }

      // Update the book after validation
      const book = bookOpt["Some"];
      const updatedBook = {
        ...book,
        ...payload,
      };

      booksStorage.insert(bookId, updatedBook);
      return Ok(updatedBook);
    }
  ),

  // Get book by bookId
  getBook: query([text], Result(Book, Message), (bookId) => {
    const bookOpt = booksStorage.get(bookId);
    if ("None" in bookOpt) {
      return Err({ NotFound: "Book not found" });
    }

    return Ok(bookOpt["Some"]);
  }),

  // Get books by userId
  getBooksByUser: query([text], Result(Vec(Book), Message), (userId) => {
    const books = booksStorage.values().filter((book) => {
      return book.userId === userId;
    });

    return Ok(books);
  }),

  // Get books by genre
  getBooksByGenre: query([text], Result(Vec(Book), Message), (genre) => {
    const books = booksStorage.values().filter((book) => {
      return book.genre === genre;
    });

    return Ok(books);
  }),

  // Get all books
  getAllBooks: query([], Result(Vec(Book), Message), () => {
    const books = booksStorage.values();

    // Return an error if no books are found
    if (books.length === 0) {
      return Err({ NotFound: "No books found" });
    }

    return Ok(books);
  }),

  // Get the total number of books listed
  getTotalBooks: query([], Result(nat64, Message), () => {
    const books = booksStorage.values();

    return Ok(BigInt(books.length) as nat64);
  }),

  // Function to search for books from a search bar
  searchBooks: query([text], Result(Vec(Book), Message), (searchTerm) => {
    // Perform the search by filtering books that match the search term
    const books = booksStorage.values().filter((book) => {
      return (
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Check if any books match the search term
    if (books.length === 0) {
      return Err({ NotFound: "No books found matching the search term." });
    }

    // Return the list of matching books
    return Ok(books);
  }),

  // Function to calculate the number of books listed by a user
  getNumberOfBooks: query([text], Result(nat64, Message), (userId) => {
    // Get the books listed by the user
    const books = booksStorage.values().filter((book) => {
      return book.userId === userId;
    });

    // Convert the length of the array to bigint and return as nat64
    return Ok(BigInt(books.length) as nat64);
  }),

  // Create a new swap request
  createSwapRequest: update(
    [SwapRequestPayload],
    Result(SwapRequest, Message),
    (payload) => {
      // Validate the payload
      if (!payload.ownerId || !payload.requesterId || !payload.bookId) {
        return Err({
          InvalidPayload:
            "Ensure 'ownerId', 'requesterId', and 'bookId' are provided.",
        });
      }

      // Validate the userId
      const userOpt = usersStorage.get(payload.ownerId);
      if ("None" in userOpt) {
        return Err({ NotFound: "User not found" });
      }

      // Validate the requesterId
      const requesterOpt = usersStorage.get(payload.requesterId);
      if ("None" in requesterOpt) {
        return Err({ NotFound: "Requester not found" });
      }

      // Validate the bookId
      const bookOpt = booksStorage.get(payload.bookId);
      if ("None" in bookOpt) {
        return Err({ NotFound: "Book not found" });
      }

      // Avoid a same creating more than one swap request for the same book
      const swapRequests = swapRequestsStorage.values();
      for (const swapRequest of swapRequests) {
        if (
          swapRequest.ownerId === payload.ownerId &&
          swapRequest.requesterId === payload.requesterId &&
          swapRequest.bookId === payload.bookId
        ) {
          return Err({
            InvalidPayload:
              "Swap request already exists: Ensure the swap request is unique.",
          });
        }
      }

      // Ensure the status is not accepted: since you cant create a swap request for an already accepted swap
      const acceptedSwapRequests = swapRequests.filter((swapRequest) => {
        return swapRequest.status === "Completed";
      });

      for (const swapRequest of acceptedSwapRequests) {
        if (
          swapRequest.ownerId === payload.ownerId &&
          swapRequest.requesterId === payload.requesterId &&
          swapRequest.bookId === payload.bookId
        ) {
          return Err({
            InvalidPayload:
              "Swap request already exists: Ensure the swap request is unique.",
          });
        }
      }

      // Create the swap request after validation
      const swapRequestId = uuidv4();
      const swapRequest = {
        ...payload,
        swapRequestId,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      swapRequestsStorage.insert(swapRequestId, swapRequest);
      return Ok(swapRequest);
    }
  ),

  // Update a swap request
  updateSwapRequest: update([text, SwapRequestPayload], Result(SwapRequest, Message), (swapRequestId, payload) => {
    const swapRequestOpt = swapRequestsStorage.get(swapRequestId);
    if ("None" in swapRequestOpt) {
      return Err({ NotFound: "Swap request not found." });
    }

    const updatedSwapRequest = {
      ...swapRequestOpt["Some"],
      ...payload,
    };

    swapRequestsStorage.insert(swapRequestId, updatedSwapRequest);
    return Ok(updatedSwapRequest);
  }),

  // Get swap request by swapRequestId
  getSwapRequest: query([text], Result(SwapRequest, Message), (swapRequestId) => {
    const swapRequestOpt = swapRequestsStorage.get(swapRequestId);
    if ("None" in swapRequestOpt) {
      return Err({ NotFound: "Swap request not found." });
    }

    return Ok(swapRequestOpt["Some"]);
  }),

  // New Feature: Get number of swaps per user
  getSwapsByUser: query([text], Result(nat64, Message), (userId) => {
    const swapCount = swapRequestsStorage.values().filter(swap => {
      return swap.ownerId === userId || swap.requesterId === userId;
    }).length;

    return Ok(BigInt(swapCount));
  }),


  // Get swap request by swapRequestId
  getSwapRequest: query([text], Result(SwapRequest, Message), (swapRequestId) => {
    const swapRequestOpt = swapRequestsStorage.get(swapRequestId);
    if ("None" in swapRequestOpt) {
      return Err({ NotFound: "Swap request not found." });
    }

    return Ok(swapRequestOpt["Some"]);
  }),

  // Get swap requests by userId
  getSwapRequestsByUser: query(
    [text],
    Result(Vec(SwapRequest), Message),
    (userId) => {
      const swapRequests = swapRequestsStorage
        .values()
        .filter((swapRequest) => {
          return (
            swapRequest.ownerId === userId || swapRequest.requesterId === userId
          );
        });

      return Ok(swapRequests);
    }
  ),

  // Function to get the nummber of Pending Swap Requests for a specific user
  getNumberOfPendingSwapRequests: query(
    [text],
    Result(nat64, Message),
    (userId) => {
      // Get the pending swap requests for the user
      const swapRequests = swapRequestsStorage
        .values()
        .filter((swapRequest) => {
          return (
            (swapRequest.ownerId === userId ||
              swapRequest.requesterId === userId) &&
            swapRequest.status === "Pending"
          );
        });

      // Convert the length of the array to bigint and return as nat64
      return Ok(BigInt(swapRequests.length) as nat64);
    }
  ),

  // Function to get the nummber of Completed Swap Requests for a specific user
  getNumberOfCompletedSwapRequests: query(
    [text],
    Result(nat64, Message),
    (userId) => {
      // Get the completed swap requests for the user
      const swapRequests = swapRequestsStorage
        .values()
        .filter((swapRequest) => {
          return (
            (swapRequest.ownerId === userId ||
              swapRequest.requesterId === userId) &&
            swapRequest.status === "Completed"
          );
        });

      // Convert the length of the array to bigint and return as nat64
      return Ok(BigInt(swapRequests.length) as nat64);
    }
  ),

  // Get swap requests for a specific user
  getSwapRequestsForUser: query(
    [text],
    Result(Vec(SwapRequest), Message),
    (userId) => {
      // Check if the userId exists
      const userOpt = usersStorage.get(userId);
      if ("None" in userOpt) {
        return Err({ NotFound: "User not found" });
      }

      // Retrieve swap requests for the user
      const swapRequests = swapRequestsStorage
        .values()
        .filter((swapRequest) => {
          return swapRequest.ownerId === userId;
        });

      // If no swap requests are found, return an appropriate error message
      if (swapRequests.length === 0) {
        return Err({ NotFound: "No swap requests found for this user." });
      }

      // Return the swap requests
      return Ok(swapRequests);
    }
  ),

  // Get all swap requests
  getAllSwapRequests: query([], Result(Vec(SwapRequest), Message), () => {
    const swapRequests = swapRequestsStorage.values();

    // Return an error if no swap requests are found
    if (swapRequests.length === 0) {
      return Err({ NotFound: "No swap requests found" });
    }

    return Ok(swapRequests);
  }),

  // New Feature: Retrieve recently listed books
  getRecentBooks: query([], Result(Vec(Book), Message), () => {
    const recentBooks = booksStorage.values()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10); // Get the 10 most recently listed books

    if (recentBooks.length === 0) {
      return Err({ NotFound: "No recent books found." });
    }

    return Ok(recentBooks);
  }),

  // New Feature: Get number of swaps per user
  getSwapsByUser: query([text], Result(nat64, Message), (userId) => {
    const swapCount = swapRequestsStorage.values().filter(swap => {
      return swap.ownerId === userId || swap.requesterId === userId;
    }).length;

    return Ok(BigInt(swapCount));
  }),

  // New Feature: Retrieve feedbacks by userId
  getFeedbacksByUser: query([text], Result(Vec(Feedback), Message), (userId) => {
    const feedbacks = feedbackStorage.values().filter((feedback) => feedback.userId === userId);

    if (feedbacks.length === 0) {
      return Err({ NotFound: "No feedbacks found for the user." });
    }

    return Ok(feedbacks);
  }),

  // Function to get top 5 swappers of the month
  getTopSwappers: query([], Result(Vec(Record({
    userId: text,
    name: text,
    swapsCompleted: nat64,
    lastBookDetails: Opt(Book)
  })), Message), () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const completedSwaps = swapRequestsStorage.values().filter((swap) => {
      const swapDate = new Date(swap.createdAt);
      return swap.status === 'Completed' && swapDate.getMonth() === currentMonth && swapDate.getFullYear() === currentYear;
    });
    
    const swapCountMap = new Map<string, { count: number, lastBook: Opt(Book) }>();
    
    completedSwaps.forEach((swap) => {
      const userId = swap.ownerId;
      const userBooks = booksStorage.values().filter(book => book.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const lastBook = userBooks.length ? Some(userBooks[0]) : None;
      
      const currentCount = swapCountMap.get(userId)?.count || 0;
      swapCountMap.set(userId, { count: currentCount + 1, lastBook });
    });
    
    const topSwappers = Array.from(swapCountMap.entries()).sort((a, b) => b[1].count - a[1].count).slice(0, 5).map(([userId, data]) => {
      const userOpt = usersStorage.get(userId);
      if ("Some" in userOpt) {
        const user = userOpt.Some;
        return {
          userId,
          name: user.name,
          swapsCompleted: BigInt(data.count),
          lastBookDetails: data.lastBook
        };
      }
    }).filter(user => user !== undefined);

    if (topSwappers.length === 0) {
      return Err({ NotFound: "No top swappers found this month." });
    }

    return Ok(topSwappers);
  }),

  /// Accept a swap request
  acceptSwapRequest: update([text], Result(SwapRequest, Message), (swapRequestId) => {
    const swapRequestOpt = swapRequestsStorage.get(swapRequestId);
    if ("None" in swapRequestOpt) {
      return Err({ NotFound: "Swap request not found." });
    }

    const swapRequest = swapRequestOpt["Some"];
    const updatedSwapRequest = {
      ...swapRequest,
      status: "Completed",
    };

    swapRequestsStorage.insert(swapRequestId, updatedSwapRequest);
    return Ok(updatedSwapRequest);
  }),


  // Function for a user to reject a swap request
  rejectSwapRequest: update(
    [text],
    Result(SwapRequest, Message),
    (swapRequestId) => {
      // Validate the swapRequestId
      const swapRequestOpt = swapRequestsStorage.get(swapRequestId);
      if ("None" in swapRequestOpt) {
        return Err({ NotFound: "Swap request not found" });
      }

      // Update the swap request after validation
      const swapRequest = swapRequestOpt["Some"];
      const updatedSwapRequest = {
        ...swapRequest,
        status: "Rejected",
      };

      swapRequestsStorage.insert(swapRequestId, updatedSwapRequest);
      return Ok(updatedSwapRequest);
    }
  ),

  // Get the total number of completed swap requests
  getTotalCompletedSwapRequests: query([], Result(nat64, Message), () => {
    const swapRequests = swapRequestsStorage.values().filter((swapRequest) => {
      return swapRequest.status === "Completed";
    });

    return Ok(BigInt(swapRequests.length) as nat64);
  }),

  // Create feedback
  createFeedback: update([FeedbackPayload], Result(Feedback, Message), (payload) => {
    if (!payload.rating || !payload.comment) {
      return Err({ InvalidPayload: "Ensure 'rating' and 'comment' are provided." });
    }

    const userOpt = usersStorage.get(payload.userId);
    if ("None" in userOpt) {
      return Err({ NotFound: "User not found." });
    }

    const swapRequestOpt = swapRequestsStorage.get(payload.swapRequestId);
    if ("None" in swapRequestOpt) {
      return Err({ NotFound: "Swap request not found." });
    }

    const feedbackId = uuidv4();
    const feedback = {
      ...payload,
      feedbackId,
      createdAt: new Date().toISOString(),
    };

    feedbackStorage.insert(feedbackId, feedback);
    return Ok(feedback);
  }),

  // Update a feedback
  updateFeedback: update(
    [FeedbackPayload],
    Result(Feedback, Message),
    (payload) => {
      // Validate the payload
      if (!payload.rating || !payload.comment) {
        return Err({
          InvalidPayload: "Ensure 'rating' and 'comment' are provided.",
        });
      }

      // Update the feedback after validation
      const feedbackId = ic.caller().toText();
      const feedbackOpt = feedbackStorage.get(feedbackId);
      if ("None" in feedbackOpt) {
        return Err({ NotFound: "Feedback not found" });
      }

      const feedback = feedbackOpt["Some"];
      const updatedFeedback = {
        ...feedback,
        ...payload,
      };

      feedbackStorage.insert(feedbackId, updatedFeedback);
      return Ok(updatedFeedback);
    }
  ),

  // Get feedback by feedbackId
  getFeedback: query([text], Result(Feedback, Message), (feedbackId) => {
    const feedbackOpt = feedbackStorage.get(feedbackId);
    if ("None" in feedbackOpt) {
      return Err({ NotFound: "Feedback not found" });
    }

    return Ok(feedbackOpt["Some"]);
  }),

  // Get feedbacks by userId
  getFeedbacksByUser: query(
    [text],
    Result(Vec(Feedback), Message),
    (userId) => {
      const feedbacks = feedbackStorage.values().filter((feedback) => {
        return feedback.userId === userId;
      });

      return Ok(feedbacks);
    }
  ),

  // Get all feedbacks
  getAllFeedbacks: query([], Result(Vec(Feedback), Message), () => {
    const feedbacks = feedbackStorage.values();

    // Return an error if no feedbacks are found
    if (feedbacks.length === 0) {
      return Err({ NotFound: "No feedbacks found" });
    }

    return Ok(feedbacks);
  }),

  // Get all feedbacks by swapRequestId
  getFeedbacksBySwapRequest: query(
    [text],
    Result(Vec(Feedback), Message),
    (swapRequestId) => {
      const feedbacks = feedbackStorage.values().filter((feedback) => {
        return feedback.swapRequestId === swapRequestId;
      });

      return Ok(feedbacks);
    }
  ),

  // Delete a feedback
  deleteFeedback: update([text], Result(Null, Message), (feedbackId) => {
    const feedbackOpt = feedbackStorage.get(feedbackId);
    if ("None" in feedbackOpt) {
      return Err({ NotFound: "Feedback not found" });
    }

    feedbackStorage.remove(feedbackId);
    return Ok(null);
  }),

  // Delete a book by bookId
  deleteBook: update([text], Result(Null, Message), (bookId) => {
    const bookOpt = booksStorage.get(bookId);
    if ("None" in bookOpt) {
      return Err({ NotFound: "Book not found." });
    }

    booksStorage.remove(bookId);
    return Ok(null);
  }),

  // Delete a swap request
  deleteSwapRequest: update([text], Result(Null, Message), (swapRequestId) => {
    const swapRequestOpt = swapRequestsStorage.get(swapRequestId);
    if ("None" in swapRequestOpt) {
      return Err({ NotFound: "Swap request not found" });
    }

    swapRequestsStorage.remove(swapRequestId);
    return Ok(null);
  }),

  // Function to get the top featured swappers of the current month with additional details
  getFeaturedSwappers: query(
    [],
    Result(
      Vec(
        Record({
          username: text,
          booksSwapped: nat64,
          userId: text,
          bookDetails: Opt(Book), // Adding book details to the returned object
        })
      ),
      Message
    ),
    () => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Filter swap requests completed in the current month
      const completedSwapRequests = swapRequestsStorage
        .values()
        .filter((swapRequest) => {
          const swapDate = new Date(swapRequest.createdAt);
          return (
            swapRequest.status === "Completed" &&
            swapDate.getMonth() === currentMonth &&
            swapDate.getFullYear() === currentYear
          );
        });

      // Count the number of completed swaps per user
      const swapCountPerUser = new Map<string, number>();
      completedSwapRequests.forEach((swapRequest) => {
        const requesterCount =
          swapCountPerUser.get(swapRequest.requesterId) || 0;
        const ownerCount = swapCountPerUser.get(swapRequest.ownerId) || 0;

        // Ensure the retrieved counts are numbers before adding 1
        swapCountPerUser.set(
          swapRequest.requesterId,
          Number(requesterCount) + 1
        );
        swapCountPerUser.set(swapRequest.ownerId, Number(ownerCount) + 1);
      });

      // Get the users with the highest number of completed swaps and their details
      const featuredSwappers = Array.from(swapCountPerUser.entries())
        .sort((a, b) => b[1] - a[1]) // Sort by the number of swaps in descending order
        .map(([userId, booksSwapped]) => {
          const userOpt = usersStorage.get(userId);
          if ("Some" in userOpt) {
            const user = userOpt.Some;

            // Retrieve the most recent book listed by this user
            const userBooks = booksStorage
              .values()
              .filter((book) => book.userId === userId)
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );

            const bookDetails =
              userBooks.length > 0 ? Some(userBooks[0]) : None;

            return {
              username: user.name,
              booksSwapped: BigInt(booksSwapped), // Convert to BigInt for nat64
              userId: user.userId,
              bookDetails, // Include the most recent book details
            };
          }
        })
        .filter((user) => user !== undefined) // Ensure no undefined values are returned
        .slice(0, 5); // Limit the number of featured swappers to the top 5

      // If no users found, return NotFound
      if (featuredSwappers.length === 0) {
        return Err({ NotFound: "No featured swappers found for this month." });
      }

      return Ok(featuredSwappers);
    }
  ),
});
