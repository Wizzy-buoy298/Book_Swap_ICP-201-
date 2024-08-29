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
  return window.canister.farmWorkChain.getUserProfile();
}

// getUserProfileByOwner
export async function getUserProfileByOwner(owner) {
  return window.canister.farmWorkChain.getUserProfileByOwner();
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
  return window.canister.farmWorkChain.getBook(id);
}

// getAllBooks
export async function getAllBooks() {
  return window.canister.farmWorkChain.getAllBooks();
}

// searchBooks
export async function searchBooks(search) {
  return window.canister.farmWorkChain.searchBooks(search);
}

// getNumberOfBooks
export async function getNumberOfBooks(userId) {
  return window.canister.farmWorkChain.getNumberOfBooks(userId);
}

// getBooksByUser
export async function getBooksByUser(owner) {
  return window.canister.farmWorkChain.getBooksByUser(owner);
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
  return window.canister.farmWorkChain.getSwapRequest(id);
}

// getSwapRequestsByUser
export async function getSwapRequestsByUser(owner) {
  return window.canister.farmWorkChain.getSwapRequestsByUser(owner);
}

// getNumberOfCompletedSwapRequests
export async function getNumberOfCompletedSwapRequests(userId) {
  return window.canister.farmWorkChain.getNumberOfCompletedSwapRequests(userId);
}

// getNumberOfPendingSwapRequests
export async function getNumberOfPendingSwapRequests(userId) {
  return window.canister.farmWorkChain.getNumberOfPendingSwapRequests(userId);
}

// getAllSwapRequests
export async function getAllSwapRequests() {
  return window.canister.farmWorkChain.getAllSwapRequests();
}

// getSwapRequestsForUser
export async function getSwapRequestsForUser(userId) {
  return window.canister.farmWorkChain.getSwapRequestsForUser(userId);
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
  return window.canister.farmWorkChain.getFeedback(id);
}

// getFeedbacksByUser
export async function getFeedbacksByUser(owner) {
  return window.canister.farmWorkChain.getFeedbacksByUser(owner);
}

// getAllFeedbacks
export async function getAllFeedbacks() {
  return window.canister.farmWorkChain.getAllFeedbacks();
}

// getFeedbacksBySwapRequest
export async function getFeedbacksBySwapRequest(requestId) {
  return window.canister.farmWorkChain.getFeedbacksBySwapRequest(requestId);
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
  return window.canister.farmWorkChain.getTotalBooks();
}

// getTotalCompletedSwapRequests
export async function getTotalCompletedSwapRequests() {
  return window.canister.farmWorkChain.getTotalCompletedSwapRequests();
}

// getTotalUsers
export async function getTotalUsers() {
  return window.canister.farmWorkChain.getTotalUsers();
}

// getFeaturedSwappers
export async function getFeaturedSwappers() {
  return window.canister.farmWorkChain.getFeaturedSwappers();
}