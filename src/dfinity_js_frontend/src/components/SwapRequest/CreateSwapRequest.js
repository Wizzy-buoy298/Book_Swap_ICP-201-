import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { createSwapRequest } from "../../utils/BookSwap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateSwapRequest = ({ book, user, show, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true); // Track component mount status

  // Set isMounted to true on mount, and false on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Check if the swap request data is valid
  const isFormValid = () => {
    return book && user;
  };

  const handleCreateSwapRequest = async () => {
    if (!isFormValid()) {
      toast.error("Invalid swap request data. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await createSwapRequest({
        bookId: book.bookId,
        ownerId: book.userId,
        requesterId: user.userId,
      });

      console.log("Swap Request Response", response);

      if (isMounted.current) {
        if (response && response.Err) {
          toast.error(response.Err.InvalidPayload || "An error occurred.");
        } else {
          toast.success("Swap request created successfully");
          handleClose();
        }
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error(
          error.message || "An error occurred while creating the swap request."
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
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Create Swap Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to create a swap request for the book titled "{book?.title}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateSwapRequest} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Create Swap Request"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Toast Container for displaying toast notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </>
  );
};

export default CreateSwapRequest;
