import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";

const API_URL = "https://ochudb.netlify.app/api/words";

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ word: "", clue: "", id: "" });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(""); // To display the error message

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setEditing(false);
    setFormData({ word: "", clue: "", id: "" });
    setError(""); // Reset error message
    setShow(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when editing the word
  };

  const handleSubmit = async () => {
    const validatedWord = validateWord(formData.word);

    // Check if the word already exists in the database, ignoring the current ID during edit
    const wordExists = data.some(
      (item) =>
        validateWord(item.word) === validatedWord && item.id !== formData.id
    );

    if (wordExists) {
      setError("This word already exists. Please enter a different word.");
      return;
    }

    try {
      if (editing) {
        await axios.put(`${API_URL}/${formData.id}`, {
          ...formData,
          word: validatedWord,
        });
        setData((prevData) =>
          prevData.map((item) =>
            item.id === formData.id
              ? { ...formData, word: validatedWord }
              : item
          )
        );
      } else {
        const response = await axios.post(API_URL, {
          ...formData,
          word: validatedWord,
        });
        setData((prevData) => [...prevData, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleEdit = (item) => {
    setEditing(true);
    setFormData(item);
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const validateWord = (word) => {
    return word
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/\s+/g, "") // Remove spaces
      .toUpperCase();
  };

  return (
    <Container className="mt-4">
      <h2>Admin Panel - Ô Chữ Game Show</h2>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add New
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Word</th>
            <th>Clue</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.word}</td>
              <td>{item.clue}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Entry" : "Add Entry"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Word</Form.Label>
              <Form.Control
                type="text"
                name="word"
                value={validateWord(formData.word)}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Clue</Form.Label>
              <Form.Control
                type="text"
                name="clue"
                value={formData.clue}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={error !== ""}
          >
            {editing ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanel;
