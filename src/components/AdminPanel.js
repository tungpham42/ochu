import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { db } from "./firebaseConfig"; // Import Firebase
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ word: "", clue: "" });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [currentId, setCurrentId] = useState("");

  const validateLetter = (letter) => {
    return letter
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/\s+/g, "") // Remove spaces
      .toUpperCase();
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    const querySnapshot = await getDocs(collection(db, "words"));
    const wordsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(wordsList);
  };

  const handleShow = () => {
    setEditing(false);
    setFormData({ word: "", clue: "" });
    setError("");
    setShow(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.word.trim() || !formData.clue.trim()) {
      setError("Both fields are required.");
      return;
    }

    try {
      const modifiedWord =
        formData.word.slice(0, -1) + formData.word.slice(-1).toUpperCase();

      if (editing) {
        const docRef = doc(db, "words", currentId);
        await updateDoc(docRef, { word: modifiedWord, clue: formData.clue });
      } else {
        await addDoc(collection(db, "words"), {
          word: modifiedWord,
          clue: formData.clue,
        });
      }
      fetchWords();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Failed to save data. Try again.");
    }
  };

  const handleEdit = (item) => {
    setEditing(true);
    setCurrentId(item.id);
    setFormData({ word: item.word, clue: item.clue });
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "words", id));
      fetchWords();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleClose = () => setShow(false);

  return (
    <Container className="mt-4">
      <h2>Admin Panel - Firebase CRUD</h2>
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
      {error && <p className="text-danger">{error}</p>}
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
                value={validateLetter(formData.word)}
                onChange={handleChange}
                required
                autoFocus
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editing ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanel;
