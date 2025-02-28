import React from "react";
import { Container } from "react-bootstrap";
import WordPuzzle from "./components/WordPuzzle";
import KambriaWordPuzzle from "./components/KambriaWordPuzzle";
import AdminPanel from "./components/AdminPanel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Container className="my-3">
        <Routes>
          <Route path="/" element={<KambriaWordPuzzle />} />
          <Route path="/lucky" element={<WordPuzzle />} />
          <Route path="/mayman" element={<WordPuzzle />} />
          <Route path="/chude" element={<WordPuzzle />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/quantri" element={<AdminPanel />} />
          <Route path="/quantro" element={<AdminPanel />} />
        </Routes>
        <Footer />
      </Container>
    </Router>
  );
};

export default App;
