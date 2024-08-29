import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Image,
  Container,
  Modal,
  Nav,
  Form,
  Spinner,
  FormControl,
} from "react-bootstrap";
import Isotope from "isotope-layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllBooks,
  getAllSwapRequests,
  getAllFeedbacks,
  searchBooks,
  acceptSwapRequest,
  rejectSwapRequest,
  getSwapRequestsForUser,
} from "../../utils/BookSwap";
import CreateSwapRequest from "../../components/SwapRequest/CreateSwapRequest";
import AddFeedback from "../../components/BookFeedBack/SubmitFeedback";

const BookList = ({ user }) => {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [userSwapRequests, setUserSwapRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isViewingFeedbacks, setIsViewingFeedbacks] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [activeTab, setActiveTab] = useState("books"); // New state to manage active tab
  const isotope = useRef(null);

  // State for managing swap request modal
  const [selectedSwapRequest, setSelectedSwapRequest] = useState(null);
  const [showManageSwapModal, setShowManageSwapModal] = useState(false);

  // Fetch books from the backend
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await getAllBooks();
        console.log("Response:", response);
        if (response.Ok) {
          setBooks(response.Ok);
          setSearchMessage(""); // Clear any previous search message
        } else {
          console.error("Error fetching books:", response.Error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchBooks();
  }, []);

  // Fetch swap requests from the backend
  useEffect(() => {
    async function fetchSwapRequests() {
      try {
        const response = await getAllSwapRequests();
        console.log("Swap Requests Response:", response);
        if (response.Ok) {
          setSwapRequests(response.Ok);
        } else {
          console.error("Error fetching swap requests:", response.Error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchSwapRequests();
  }, []);

  // Fetch swap requests for a specific user
  useEffect(() => {
    async function fetchUserSwapRequests() {
      try {
        const response = await getSwapRequestsForUser(user.userId);
        console.log("User Swap Requests Response:", response);
        if (response.Ok) {
          setUserSwapRequests(response.Ok);
        } else {
          console.error("Error fetching user swap requests:", response.Error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchUserSwapRequests();
  }, [user]);

  // Fetch feedbacks from the backend
  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await getAllFeedbacks();
        console.log("Feedbacks Response:", response);
        if (response.Ok) {
          setFeedbacks(response.Ok);
        } else {
          console.error("Error fetching feedbacks:", response.Error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchFeedbacks();
  }, []);

  // Initialize Isotope and filter items
  useEffect(() => {
    isotope.current = new Isotope(".books-grid", {
      itemSelector: ".book-item",
      layoutMode: "fitRows",
    });

    return () => isotope.current.destroy(); // Cleanup on unmount
  }, [books]);

  const handleFilter = (genre) => {
    isotope.current.arrange({
      filter: genre === "*" ? "*" : `.${genre.toLowerCase()}`,
    });
  };

  const handleSwapRequest = (book) => {
    setSelectedBook(book);
    setShowSwapModal(true);
  };

  const handleAddFeedback = (book) => {
    setSelectedBook(book);
    setShowFeedbackModal(true);
    setIsViewingFeedbacks(false);
  };

  const handleViewFeedbacks = (book) => {
    setSelectedBook(book);
    setShowFeedbackModal(true);
    setIsViewingFeedbacks(true);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setShowSwapModal(false);
    setShowFeedbackModal(false);
    setIsViewingFeedbacks(false);
  };

  // Function to find the swapRequestId for the selected book
  const getSwapRequestId = (bookId) => {
    const request = swapRequests.find((request) => request.bookId === bookId);
    return request ? request.swapRequestId : null;
  };

  // Helper function to format numbers with commas
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  // Handle search functionality
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await searchBooks(searchTerm);
      console.log("Search Response:", response);
      if (response.Ok) {
        setBooks(response.Ok);
        setSearchMessage(""); // Clear any previous search message
      } else if (response.Err) {
        console.error("Error searching books:", response.Err);
        setBooks([]); // Clear the books list if no results were found
        setSearchMessage(response.Err.NotFound || "No results found.");
      }
    } catch (error) {
      console.error("Error:", error.message || "An unexpected error occurred.");
      setSearchMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const handleManageSwap = (request) => {
    setSelectedSwapRequest(request);
    setShowManageSwapModal(true);
  };
  const handleAcceptSwap = async () => {
    setAcceptLoading(true);
    if (selectedSwapRequest) {
      try {
        const response = await acceptSwapRequest(
          selectedSwapRequest.swapRequestId
        );
        if (response.Ok) {
          setSwapRequests((prevRequests) =>
            prevRequests.map((req) =>
              req.id === selectedSwapRequest.id
                ? { ...req, status: "Accepted" }
                : req
            )
          );
          setShowManageSwapModal(false);
          toast.success("Swap request accepted successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          console.error("Error accepting swap request:", response.Error);
          toast.error("Failed to accept swap request. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        console.error(
          "Error:",
          error.message || "An unexpected error occurred."
        );
        toast.error("An unexpected error occurred. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setAcceptLoading(false);
      }
    }
  };

  const handleRejectSwap = async () => {
    setRejectLoading(true);
    if (selectedSwapRequest) {
      try {
        const response = await rejectSwapRequest(
          selectedSwapRequest.swapRequestId
        );
        if (response.Ok) {
          setSwapRequests((prevRequests) =>
            prevRequests.map((req) =>
              req.id === selectedSwapRequest.id
                ? { ...req, status: "Rejected" }
                : req
            )
          );
          setShowManageSwapModal(false);
          toast.success("Swap request rejected successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          console.error("Error rejecting swap request:", response.Error);
          toast.error("Failed to reject swap request. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        console.error(
          "Error:",
          error.message || "An unexpected error occurred."
        );
        toast.error("An unexpected error occurred. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setRejectLoading(false);
      }
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === "books") {
      return (
        <Row className="books-grid">
          {books.map((book) => (
            <Col
              md={4}
              key={book.id}
              className={`mb-4 book-item ${book.genre.toLowerCase()}`}
            >
              <Card className="h-100">
                <Image
                  variant="top"
                  src={book.imageUrl}
                  alt={book.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  fluid
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-2">{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {book.author}
                  </Card.Subtitle>
                  <Card.Text className="mb-2">
                    <strong>Genre:</strong> {book.genre}
                  </Card.Text>
                  <Card.Text
                    className="text-muted"
                    style={{ flex: "1 0 auto" }}
                  >
                    <strong>Description:</strong> {book.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSwapRequest(book)}
                    >
                      Request Swap
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddFeedback(book)}
                    >
                      Add Feedback
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewFeedbacks(book)}
                    >
                      View Feedbacks
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      );
    } else if (activeTab === "swapRequests") {
      return (
        <Row>
          {userSwapRequests.map((request) => (
            <Col md={4} key={request.id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{request.bookTitle}</Card.Title>
                  <Card.Text>
                    <strong>Requested By:</strong> {request.requesterId}
                  </Card.Text>
                  <Card.Text>
                    <strong>Book ID:</strong> {request.bookId}
                  </Card.Text>
                  <Card.Text>
                    <strong>Requested Date:</strong>{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Status:</strong> {request.status}
                  </Card.Text>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleManageSwap(request)}
                  >
                    Manage Swap
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      );
    }
  };

  return (
    <Container>
      {/* First Level Navigation: Switch between Books and Swap Requests */}
      <Nav variant="tabs" defaultActiveKey="books" className="mb-3">
        <Nav.Item>
          <Nav.Link
            eventKey="books"
            active={activeTab === "books"}
            onClick={() => setActiveTab("books")}
          >
            Books
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="swapRequests"
            active={activeTab === "swapRequests"}
            onClick={() => setActiveTab("swapRequests")}
          >
            Swap Requests
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Second Level Navigation: Filter Books by Genre */}
      {activeTab === "books" && (
        <Nav variant="tabs" defaultActiveKey="all" className="mb-3">
          <Nav.Item>
            <Nav.Link onClick={() => handleFilter("*")}>All</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={() => handleFilter("fiction")}>Fiction</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={() => handleFilter("non-fiction")}>
              Non-Fiction
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={() => handleFilter("science-fiction")}>
              Science Fiction
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={() => handleFilter("fantasy")}>Fantasy</Nav.Link>
          </Nav.Item>

          <Form className="ms-auto d-flex" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-primary" type="submit">
              Search
            </Button>
          </Form>
        </Nav>
      )}

      {/* Display search message if there is any */}
      {searchMessage && (
        <p className="text-center text-muted">{searchMessage}</p>
      )}

      {/* Render content based on the active tab */}
      <div className="mt-4">{renderContent()}</div>

      {/* Modal to view feedbacks */}
      {selectedBook && showFeedbackModal && isViewingFeedbacks && (
        <Modal show={showFeedbackModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-primary">
              Feedbacks for "{selectedBook.title}"
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {swapRequests.filter(
              (request) => request.bookId === selectedBook.bookId
            ).length > 0 ? (
              <div className="feedback-list">
                {feedbacks
                  .filter((feedback) =>
                    swapRequests.some(
                      (request) =>
                        request.bookId === selectedBook.bookId &&
                        request.swapRequestId === feedback.swapRequestId
                    )
                  )
                  .map((feedback) => (
                    <Card key={feedback.feedbackId} className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-3">
                            <i className="bi bi-person-circle text-secondary"></i>
                          </div>
                          <div>
                            <strong>User:</strong> {feedback.userId}
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-3">
                            <i className="bi bi-star-fill text-warning"></i>
                          </div>
                          <div>
                            <strong>Rating:</strong>{" "}
                            {formatNumber(feedback.rating)}
                          </div>
                        </div>
                        <Card.Text>
                          <strong>Comment:</strong> {feedback.comment}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center text-muted">
                <i className="bi bi-chat-left-dots fs-1 mb-3"></i>
                <p>No feedbacks available for this book.</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Add Feedback Modal */}
      {selectedBook && showFeedbackModal && !isViewingFeedbacks && (
        <AddFeedback
          book={selectedBook}
          user={user}
          swapRequestId={getSwapRequestId(selectedBook.bookId)}
          show={showFeedbackModal}
          handleClose={handleCloseModal}
        />
      )}

      {/* Create Swap Request Modal */}
      {selectedBook && (
        <CreateSwapRequest
          book={selectedBook}
          user={user}
          show={showSwapModal}
          handleClose={handleCloseModal}
        />
      )}

      {/* Manage Swap Request Modal */}
      <Modal
        show={showManageSwapModal}
        onHide={() => setShowManageSwapModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Manage Swap Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSwapRequest && (
            <>
              <p>
                <strong>Book Title:</strong> {selectedSwapRequest.bookTitle}
              </p>
              <p>
                <strong>Requested By:</strong> {selectedSwapRequest.requesterId}
              </p>
              <p>
                <strong>Book ID:</strong> {selectedSwapRequest.bookId}
              </p>
              <p>
                <strong>Requested Date:</strong>{" "}
                {new Date(selectedSwapRequest.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedSwapRequest.status}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleRejectSwap}
            disabled={rejectLoading || acceptLoading} // disable both buttons while any action is loading
          >
            {rejectLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Reject"
            )}
          </Button>
          <Button
            variant="success"
            onClick={handleAcceptSwap}
            disabled={acceptLoading || rejectLoading} // disable both buttons while any action is loading
          >
            {acceptLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Accept"
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowManageSwapModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookList;
