import React from "react";
import { Container } from "react-bootstrap";
import WordPuzzle from "./components/WordPuzzle";

const App = () => {
  return (
    <Container className="my-5">
      <WordPuzzle />
    </Container>
  );
};

export default App;
