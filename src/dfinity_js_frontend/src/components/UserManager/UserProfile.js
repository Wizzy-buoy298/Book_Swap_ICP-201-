import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Container,
  Image,
} from "react-bootstrap";
import {
  listBook,
  getNumberOfBooks,
  getNumberOfCompletedSwapRequests,
  getNumberOfPendingSwapRequests,
} from "../../utils/BookSwap";
import UpdateUserProfileModal from "../UserManager/UpdateProfile";
import AddBook from "../../components/BookManagement/ListBook";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = ({ user }) => {
  const { userId, name, email, phoneNumber, createdAt } = user;

  const [books, setBooks] = useState(0); // Initialize the books state as a number
  const [pendingSwaps, setPendingSwaps] = useState(0); // Initialize the pending swaps state as a number
  const [completedSwaps, setCompletedSwaps] = useState(0); // Initialize the completed swaps state as a number
  const [activeModal, setActiveModal] = useState(null); // Unified state for modals
  const [userProfile, setUserProfile] = useState({
    userId,
    name,
    email,
    phoneNumber,
  });

  // Unified function for opening modals
  const handleModalVisibility = (modalName) => {
    setActiveModal(modalName);
  };

  // Unified function for closing modals
  const closeModal = () => {
    setActiveModal(null);
  };

  const handleProfileModalSave = (updatedUser) => {
    setUserProfile(updatedUser);
    closeModal();
  };

  // Function to format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  // Function to save the book
  const saveBook = async (book) => {
    try {
      const response = await listBook(book);

      // Check if the response has an `ok` property or if it's structured differently
      if (response.Ok) {
        toast.success("Book listed successfully.");
      } else if (response.Err) {
        console.error("Error listing book:", response.Err);
        toast.error(`Error listing book: ${response.Err}`);
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Error listing book.");
      }
    } catch (error) {
      console.error("Error listing book:", error);
      toast.error("Error listing book.");
    }
  };

  // Helper function to format numbers with commas
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  // Function to fetch the number of books
  const fetchNumberOfBooks = async () => {
    try {
      const response = await getNumberOfBooks(userId);
      console.log("Number of books:", response);

      if (response.Ok) {
        setBooks(formatNumber(response.Ok)); // Convert BigInt to regular number
      }
    } catch (error) {
      console.error("Error fetching number of books:", error);
      toast.error("Error fetching number of books.");
    }
  };

  // Function to fetch the number of pending swap requests
  const fetchNumberOfPendingSwapRequests = async () => {
    try {
      const response = await getNumberOfPendingSwapRequests(userId);
      console.log("Number of pending swap requests:", response);

      if (response.Ok) {
        setPendingSwaps(formatNumber(response.Ok)); // Convert BigInt to regular number
      }
    } catch (error) {
      console.error("Error fetching number of pending swap requests:", error);
      toast.error("Error fetching number of pending swap requests.");
    }
  };

  // Function to fetch the number of completed swap requests
  const fetchNumberOfCompletedSwapRequests = async () => {
    try {
      const response = await getNumberOfCompletedSwapRequests(userId);
      console.log("Number of completed swap requests:", response);

      if (response.Ok) {
        setCompletedSwaps(formatNumber(response.Ok)); // Convert BigInt to regular number
      }
    } catch (error) {
      console.error("Error fetching number of completed swap requests:", error);
      toast.error("Error fetching number of completed swap requests.");
    }
  };

  useEffect(() => {
    fetchNumberOfBooks();
    fetchNumberOfPendingSwapRequests();
    fetchNumberOfCompletedSwapRequests();
  }, []);

  return (
    <Container>
      <Card
        className="my-3 p-3"
        style={{
          backgroundColor: "#5cacee",
          color: "#fff",
          borderRadius: "20px",
        }}
      >
        <Row className="align-items-center">
          <Col md={8}>
            <Card.Body>
              <Card.Title
                style={{
                  fontWeight: "bold",
                  fontSize: "2rem",
                  color: "#fff",
                  textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                BookChainSwap
              </Card.Title>
              <Card.Text
                style={{
                  minWidth: "300px",
                  maxWidth: "100%",
                  fontSize: "1.2rem",
                  lineHeight: "1.5",
                  color: "#f8f9fa",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                Your Personal Book Exchange Hub
                <Badge
                  bg="info"
                  style={{
                    fontSize: "0.8rem",
                    marginLeft: "10px",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    textTransform: "uppercase",
                    backgroundColor: "#17a2b8",
                    color: "#fff",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  New
                </Badge>
                <br />
                <strong style={{ color: "#ffd700" }}>Books Listed:</strong>{" "}
                {books} Books
                <br />
                <strong style={{ color: "#ffd700" }}>
                  Swap Requests:
                </strong>{" "}
                {pendingSwaps} Pending
                <br />
                <strong style={{ color: "#ffd700" }}>
                  Successful Swaps:
                </strong>{" "}
                {completedSwaps} Completed
              </Card.Text>
              <Button
                variant="light"
                style={{
                  fontWeight: "bold",
                  marginTop: "20px",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
                onClick={() => handleModalVisibility("book")}
              >
                List Book
              </Button>
              <AddBook
                save={saveBook}
                userId={userId}
                show={activeModal === "book"}
                handleClose={closeModal}
              />
            </Card.Body>
          </Col>
          <Col md={4} className="d-flex flex-column align-items-center">
            <Image
              src="https://randomuser.me/api/portraits/men/90.jpg"
              alt="User Avatar"
              className="img-fluid rounded-circle"
              style={{
                maxHeight: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div
              className="mt-3"
              style={{ width: "100%", textAlign: "center" }}
            >
              <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {name}
              </div>
              <div style={{ fontSize: "1rem", marginTop: "10px" }}>
                <div>
                  <strong>Email:</strong> {email}
                </div>
                <div>
                  <strong>Phone:</strong> {phoneNumber}
                </div>
                <div>
                  <strong>Member Since:</strong> {formatDateTime(createdAt)}
                </div>
              </div>
              <Button
                variant="outline-light"
                size="sm"
                style={{ marginTop: "10px" }}
                onClick={() => handleModalVisibility("profile")}
              >
                Edit Profile
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* User Profile Modal */}
      <UpdateUserProfileModal
        show={activeModal === "profile"}
        handleClose={closeModal}
        handleSave={handleProfileModalSave}
        user={userProfile}
      />
    </Container>
  );
};

export default Dashboard;
