import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig"; // Import Firebase config
import { collection, getDocs } from "firebase/firestore";
import { Button, Row, Col, Form, ListGroup } from "react-bootstrap";
import GuessLetterModal from "./GuessLetterModal";
import EditPlayerNameModal from "./EditPlayerNameModal";
import RulesModal from "./RulesModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faRedo,
  faPlay,
  faAdd,
  faInfoCircle,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import useSound from "use-sound";
import correctSound from "../sounds/correct.mp3";
import wrongSound from "../sounds/wrong.mp3";
import startSound from "../sounds/start.mp3";
import winSound from "../sounds/win.mp3";
import buzzSound from "../sounds/buzz.mp3";
import zeroSound from "../sounds/zero.mp3";

const prizes = [
  { label: "100", value: 100, color: "#FF5733" },
  { label: "200", value: 200, color: "#FFBD33" },
  { label: "300", value: 300, color: "#FFDA33" },
  { label: "400", value: 400, color: "#33FF57" },
  { label: "500", value: 500, color: "#33FFBD" },
  { label: "600", value: 600, color: "#33DAFF" },
  { label: "700", value: 700, color: "#5733FF" },
  { label: "800", value: 800, color: "#BD33FF" },
  { label: "900", value: 900, color: "#FF33A1" },
  { label: "1000", value: 1000, color: "#FF3333" },
  { label: "Mất điểm", value: 0, color: "#808080" },
  { label: "Mất lượt", value: 0, color: "#C0C0C0" },
];

const KambriaWordPuzzle = () => {
  const [wordData, setWordData] = useState([]);
  const [word, setWord] = useState("");
  const [clue, setClue] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [letterToGuess, setLetterToGuess] = useState("");
  const [error, setError] = useState("");
  const [hasScore, setHasScore] = useState(false);

  // Player management
  const [players, setPlayers] = useState([
    {
      name: "Đội 1",
      score: 0,
    },
    {
      name: "Đội 2",
      score: 0,
    },
  ]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [playCorrect] = useSound(correctSound);
  const [playWrong] = useSound(wrongSound);
  const [playStart] = useSound(startSound);
  const [playWin] = useSound(winSound);
  const [playBuzz] = useSound(buzzSound);
  const [playZero] = useSound(zeroSound);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const wordsCollection = await getDocs(collection(db, "words"));
      const words = wordsCollection.docs.map((doc) => doc.data());
      const wordIndex = Math.floor(Math.random() * words.length);
      setWord(words[wordIndex].word);
      setClue(words[wordIndex].clue);
      setWordData(words); // Set the wordData state
      setGameOver(false);
      setMessage("");
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  };

  const getMaskedWord = () => {
    return word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  useEffect(() => {
    if (!getMaskedWord().includes("_")) {
      setGameOver(true);
      setMessage("Chúc mừng! Từ đã được đoán xong!");
      playWin();
    } // eslint-disable-next-line
  }, [guessedLetters]);

  const startGame = () => {
    if (players.length === 0) {
      setError("Vui lòng thêm ít nhất một người chơi trước khi bắt đầu!");
      return;
    }
    const result = prizes[Math.floor(Math.random() * prizes.length)];
    const currentPlayer = players[currentPlayerIndex];
    if (result.label === "Mất điểm") {
      setPlayers((prev) =>
        prev.map((player, index) =>
          index === currentPlayerIndex ? { ...player, score: 0 } : player
        )
      );
      setMessage(`${currentPlayer.name} mất điểm!`);
      setHasScore(false);
      setShowModal(true);
      playZero();
    } else if (result.label === "Mất lượt") {
      setMessage(`${currentPlayer.name} mất lượt!`);
      nextPlayer();
      setHasScore(false);
      setShowModal(false);
      playBuzz();
    } else {
      setLetterToGuess(result.value);
      setMessage(`${currentPlayer.name} được ${result.label} điểm!`);
      setHasScore(true);
      setShowModal(true);
      playStart();
    }
  };

  const handleGuessLetter = (letter) => {
    if (players.length === 0) {
      setError("Vui lòng thêm ít nhất một người chơi trước khi đoán từ!");
      return;
    }

    const currentPlayer = players[currentPlayerIndex];

    if (letter && !guessedLetters.includes(letter)) {
      setGuessedLetters((prev) => [...prev, letter]);

      const isCorrectGuess = word.includes(letter);
      const letterCount = word.split("").filter((l) => l === letter).length;
      const scoreIncrement =
        isCorrectGuess && hasScore ? letterCount * letterToGuess : 0;

      setPlayers((prev) =>
        prev.map((player, index) =>
          index === currentPlayerIndex
            ? { ...player, score: player.score + scoreIncrement }
            : player
        )
      );

      setMessage(
        isCorrectGuess
          ? `Chúc mừng! ${currentPlayer.name} đã đoán đúng chữ ${letter}, có ${letterCount} chữ ${letter}.`
          : `${currentPlayer.name} đoán sai. Đổi lượt!`
      );

      if (isCorrectGuess) {
        playCorrect();
      } else {
        playWrong();
        nextPlayer();
      }
    } else {
      setMessage(
        `${currentPlayer.name}, chữ này đã đoán rồi hoặc bạn chưa nhập chữ!`
      );
    }
  };

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const restartGame = () => {
    if (players.length === 0) {
      setError(
        "Vui lòng thêm ít nhất một người chơi trước khi khởi động lại trò chơi!"
      );
      return;
    }
    if (wordData.length === 0) {
      setError("Không có ô chữ!");
      return;
    }
    if (wordData.length === 1) {
      setGuessedLetters([]);
      setGameOver(false);
      setMessage("");
      setPlayers([
        {
          name: "Đội 1",
          score: 0,
        },
        {
          name: "Đội 2",
          score: 0,
        },
      ]);
      return;
    }
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * wordData.length);
    } while (wordData[newIndex].word === word); // Avoid duplicate word

    setWord(wordData[newIndex].word);
    setClue(wordData[newIndex].clue);
    setGuessedLetters([]);
    setGameOver(false);
    setMessage("");
    setPlayers((prev) => prev.map((player) => ({ ...player, score: 0 })));
    setCurrentPlayerIndex(0);
    setError("");
    setHasScore(true);
  };

  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (!trimmedName) {
      setError("Tên người chơi không thể để trống!");
      return;
    }
    if (trimmedName.length > 15) {
      setError("Tên người chơi không được vượt quá 15 ký tự!");
      return;
    }
    if (
      players.some(
        (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setError("Tên người chơi đã tồn tại!");
      return;
    }
    setPlayers((prev) => [...prev, { name: trimmedName, score: 0 }]);
    setNewPlayerName("");
    setMessage("");
    setError("");
  };

  const removePlayer = (index) => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.filter((_, i) => i !== index);

      if (newPlayers.length === 0) {
        setCurrentPlayerIndex(0); // Reset if no players remain
      } else {
        setCurrentPlayerIndex((prevIndex) => {
          if (index === prevIndex) {
            // Move to the next available player or wrap around
            return prevIndex >= newPlayers.length ? 0 : prevIndex;
          } else if (index < prevIndex) {
            // Shift index back if a player before current one was removed
            return prevIndex - 1;
          }
          return prevIndex; // Keep the same if removing a player after the current one
        });
      }

      return newPlayers;
    });
    setMessage("");
  };

  const updatePlayerName = (index, newName) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, name: newName } : player
      )
    );
    setMessage("");
  };

  const handleEditButtonClick = (index) => {
    setSelectedPlayerIndex(index);
    setShowEditModal(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  return (
    <>
      <h1 className="text-center mb-4">Ô Chữ May Mắn</h1>
      <Button
        className="position-absolute"
        style={{ top: "25px", right: "25px" }}
        size="lg"
        variant="info"
        onClick={() => setShowRulesModal(true)}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Button>
      {/* Dataset Selection Dropdown */}
      <h3 className="text-center">Ô Chữ có {word.length} ký tự</h3>
      {gameOver ? (
        <div className="text-center">
          <h3 className="masked-word text-center display-6">
            {getMaskedWord()}
          </h3>
          <h4>
            Trò chơi kết thúc
            {players.length > 0 && (
              <>
                ,{" "}
                {
                  players.reduce(
                    (prev, current) =>
                      prev.score > current.score ? prev : current,
                    players[0]
                  )?.name
                }{" "}
                giành chiến thắng!
              </>
            )}
          </h4>
          <Button size="lg" onClick={restartGame}>
            <FontAwesomeIcon icon={faRedo} className="me-2" /> Chơi lại
          </Button>
        </div>
      ) : (
        <>
          <Row className="justify-content-center">
            <Col xs="auto">
              <h5 class="text-center">Gợi ý: {clue}</h5>
              <h3 className="masked-word text-center display-6">
                {getMaskedWord()}
              </h3>
            </Col>
          </Row>

          <Row className="justify-content-center mt-3">
            <Col xs="auto">
              <Button size="lg" onClick={startGame} className="me-2">
                <FontAwesomeIcon icon={faPlay} className="me-2" />
                Chơi
              </Button>
              <Button size="lg" variant="light" onClick={restartGame}>
                <FontAwesomeIcon
                  icon={wordData.length === 1 ? faRedo : faGamepad}
                  className="me-2"
                />
                {wordData.length === 1 ? "Chơi lại" : "Ván mới"}
              </Button>
            </Col>
          </Row>
          {players.length > 0 && (
            <div className="mt-3 text-center">
              <h4>Lượt chơi của {players[currentPlayerIndex]?.name}</h4>
              <h5 class="text-center">
                Số điểm của {players[currentPlayerIndex]?.name}:{" "}
                {players[currentPlayerIndex]?.score}
              </h5>
            </div>
          )}
          {message && <p className="text-center mt-3 lead">{message}</p>}
        </>
      )}

      <GuessLetterModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleGuessLetter}
        letterToGuess={letterToGuess}
        guessedLetters={guessedLetters}
        currentPlayerName={players[currentPlayerIndex]?.name}
        message={message}
      />

      <div className="mt-4 col-lg-6 col-md-8 col-sm-10 col-xs-12 mx-auto shadow-lg p-4 rounded">
        <Form onSubmit={(e) => e.preventDefault()} className="mb-3 mx-auto">
          <Row>
            <Col>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Nhập tên người chơi"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength="15"
              />
            </Col>
            <Col xl={2} lg={2} md={2} sm={4} xs={12} className="mt-2 mt-sm-0">
              <Button
                size="lg"
                variant="success"
                onClick={addPlayer}
                disabled={!newPlayerName.trim()}
              >
                <FontAwesomeIcon icon={faAdd} />
              </Button>
            </Col>
          </Row>
        </Form>
        {error && <p className="text-danger">{error}</p>}

        <ListGroup>
          {players.map((player, index) => (
            <ListGroup.Item
              key={index}
              className="ps-0 d-flex justify-content-between align-items-center"
            >
              <span className="text-break w-75">
                {player.name} - Điểm: {player.score}
              </span>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEditButtonClick(index)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => removePlayer(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <EditPlayerNameModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentName={players[selectedPlayerIndex]?.name || ""}
        onSubmit={(newName) => {
          updatePlayerName(selectedPlayerIndex, newName);
          setShowEditModal(false);
        }}
        players={players}
      />
      <RulesModal
        show={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        handleClose={() => setShowRulesModal(false)}
      />
    </>
  );
};

export default KambriaWordPuzzle;
