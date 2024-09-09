import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

// createUserProfile
export async function createUserProfile(profile) {
  return window.canister.farmWorkChain.createUserProfile(profile);
}

// updateUserProfile
export async function updateUserProfile(userId, profile) {
  return window.canister.farmWorkChain.updateUserProfile(userId, profile);
}

// getUserProfile
export async function getUserProfile() {
  try {
    return await window.canister.farmWorkChain.getUserProfile();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getUserProfileByOwner
export async function getUserProfileByOwner(owner) {
  try {
    return await window.canister.farmWorkChain.getUserProfileByOwner();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// listBook
export async function listBook(book) {
  return window.canister.farmWorkChain.listBook(book);
}

// updateBook
export async function updateBook(book) {
  return window.canister.farmWorkChain.updateBook(book);
}

// getBook
export async function getBook(id) {
  try {
    return await window.canister.farmWorkChain.getBook(id);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getAllBooks
export async function getAllBooks() {
  try {
    return await window.canister.farmWorkChain.getAllBooks();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// searchBooks
export async function searchBooks(search) {
  return window.canister.farmWorkChain.searchBooks(search);
}

// getNumberOfBooks
export async function getNumberOfBooks(userId) {
  try {
    return await window.canister.farmWorkChain.getNumberOfBooks(userId);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getBooksByUser
export async function getBooksByUser(owner) {
  try {
    return await window.canister.farmWorkChain.getBooksByUser(owner);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getBooksByGenre
export async function getBooksByGenre(genre) {
  return window.canister.farmWorkChain.getBooksByGenre(genre);
}

// createSwapRequest
export async function createSwapRequest(request) {
  return window.canister.farmWorkChain.createSwapRequest(request);
}

// updateSwapRequest
export async function updateSwapRequest(request) {
  return window.canister.farmWorkChain.updateSwapRequest(request);
}

// getSwapRequest
export async function getSwapRequest(id) {
  try {
    return await window.canister.farmWorkChain.getSwapRequest(id);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getSwapRequestsByUser
export async function getSwapRequestsByUser(owner) {
  try {
    return await window.canister.farmWorkChain.getSwapRequestsByUser(owner);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getNumberOfCompletedSwapRequests
export async function getNumberOfCompletedSwapRequests(userId) {
  try {
    return await window.canister.farmWorkChain.getNumberOfCompletedSwapRequests(userId);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }


}

// getNumberOfPendingSwapRequests
export async function getNumberOfPendingSwapRequests(userId) {
  try {
    return await window.canister.farmWorkChain.getNumberOfPendingSwapRequests(userId);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }


}

// getAllSwapRequests
export async function getAllSwapRequests() {
  try {
    return await window.canister.farmWorkChain.getAllSwapRequests();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getSwapRequestsForUser
export async function getSwapRequestsForUser(userId) {
  try {
    return await window.canister.farmWorkChain.getSwapRequestsForUser(userId);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// acceptSwapRequest
export async function acceptSwapRequest(swapRequestId) {
  return window.canister.farmWorkChain.acceptSwapRequest(swapRequestId);
}

// rejectSwapRequest
export async function rejectSwapRequest(swapRequestId) {
  return window.canister.farmWorkChain.rejectSwapRequest(swapRequestId);
}

// createFeedback
export async function createFeedback(feedback) {
  return window.canister.farmWorkChain.createFeedback(feedback);
}

// updateFeedback
export async function updateFeedback(feedback) {
  return window.canister.farmWorkChain.updateFeedback(feedback);
}

// getFeedback
export async function getFeedback(id) {
  try {
    return await window.canister.farmWorkChain.getFeedback(id);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getFeedbacksByUser
export async function getFeedbacksByUser(owner) {
  try {
    return await window.canister.farmWorkChain.getFeedbacksByUser(owner);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getAllFeedbacks
export async function getAllFeedbacks() {
  try {
    return await window.canister.farmWorkChain.getAllFeedbacks();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getFeedbacksBySwapRequest
export async function getFeedbacksBySwapRequest(requestId) {
  try {
    return await window.canister.farmWorkChain.getFeedbacksBySwapRequest(requestId);
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// deleteFeedback
export async function deleteFeedback(id) {
  return window.canister.farmWorkChain.deleteFeedback(id);
}

// deleteBook
export async function deleteBook(id) {
  return window.canister.farmWorkChain.deleteBook(id);
}

// deleteSwapRequest
export async function deleteSwapRequest(id) {
  return window.canister.farmWorkChain.deleteSwapRequest(id);
}

// getTotalBooks
export async function getTotalBooks() {
  try {
    return await window.canister.farmWorkChain.getTotalBooks();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getTotalCompletedSwapRequests
export async function getTotalCompletedSwapRequests() {
  try {
    return await window.canister.farmWorkChain.getTotalCompletedSwapRequests();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getTotalUsers
export async function getTotalUsers() {
  try {
    return await window.canister.farmWorkChain.getTotalUsers();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

// getFeaturedSwappers
export async function getFeaturedSwappers() {
  try {
    return await window.canister.farmWorkChain.getFeaturedSwappers();
  } catch (error) {
    if (error.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}