import React from "react";
import { Container } from "react-bootstrap";
import WordPuzzle from "./components/WordPuzzle";
import KambriaWordPuzzle from "./components/KambriaWordPuzzle";
import AdminPanel from "./components/AdminPanel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Container className="my-5">
        <Routes>
          <Route path="/" element={<WordPuzzle />} />
          <Route path="/kambria" element={<KambriaWordPuzzle />} />
          <Route path="/quantri" element={<AdminPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
