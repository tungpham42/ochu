import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import WordPuzzle from "./components/WordPuzzle";
import WordPuzzleKambria from "./components/WordPuzzleKambria";

const App = () => {
  return (
    <Router>
      <Container className="my-5">
        <Routes>
          <Route path="/" element={<WordPuzzle />} />
          <Route path="/kambria" element={<WordPuzzleKambria />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
