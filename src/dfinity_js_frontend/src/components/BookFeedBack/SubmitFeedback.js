import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Form, FloatingLabel, Spinner } from "react-bootstrap";
import { createFeedback } from "../../utils/BookSwap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFeedback = ({ show, handleClose, book, user, swapRequestId }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true); // Track component mount status

  useEffect(() => {
    // Set isMounted to true on mount, and false on unmount
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const isFormValid = () => {
    return rating && comment;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please provide a rating and comment.");
      return;
    }

    setLoading(true);
    try {
      const response = await createFeedback({
        userId: user.userId,
        swapRequestId,
        rating: parseInt(rating, 10),
        comment,
      });

      if (response.Ok) {
        toast.success("Feedback submitted successfully");
        if (isMounted.current) {
          handleClose();
        }
      } else if (response.Err) {
        toast.error(
          response.Err.NotFound ||
            "An error occurred while submitting feedback."
        );
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error(
          error.message || "An error occurred while submitting feedback."
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Feedback for {book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="floatingRating"
              label="Rating"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
                required
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingComment"
              label="Comment"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ height: "100px" }}
                required
              />
            </FloatingLabel>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
};

export default AddFeedback;
