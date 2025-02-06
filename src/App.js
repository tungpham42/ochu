import React from "react";
import { Container } from "react-bootstrap";
import WordPuzzle from "./components/WordPuzzle";
import KambriaWordPuzzle from "./components/KambriaWordPuzzle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Container className="mt-3">
        <Routes>
          <Route path="/" element={<KambriaWordPuzzle />} />
          <Route path="/lucky" element={<WordPuzzle />} />
          <Route path="/mayman" element={<WordPuzzle />} />
          <Route path="/chude" element={<WordPuzzle />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
