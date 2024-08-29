import React, { useState } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddBook = ({ save, userId, show, handleClose }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // Check if all form fields are filled
  const isFormFilled = () => {
    return title && author && genre && description && imageUrl;
  };

  // Handle form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormFilled()) {
      // Create the book Payload
      const BookPayload = {
        userId,
        title,
        author,
        genre,
        description,
        imageUrl,
      };

      // Save the book
      save(BookPayload);
      handleClose(); // Close the modal after saving

      // Clear the form fields
      setTitle("");
      setAuthor("");
      setGenre("");
      setDescription("");
      setImageUrl("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>List a New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="floatingTitle"
              label="Title"
              className="mb-4"
            >
              <Form.Control
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-3 shadow-sm"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingAuthor"
              label="Author"
              className="mb-4"
            >
              <Form.Control
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="rounded-3 shadow-sm"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingGenre"
              label="Genre"
              className="mb-4"
            >
              <Form.Select
                aria-label="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="rounded-3 shadow-sm"
              >
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Romance">Romance</option>
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingImageUrl"
              label="Image URL"
              className="mb-4"
            >
              <Form.Control
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-3 shadow-sm"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingDescription"
              label="Description"
              className="mb-4"
            >
              <Form.Control
                as="textarea"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-3 shadow-sm"
                style={{ height: "100px" }}
              />
            </FloatingLabel>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmit}
                className="shadow-sm"
              >
                Add Book
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddBook;
