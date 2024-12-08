import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const WORDS = [
  "REACT",
  "TYPESCRIPT",
  "JAVASCRIPT",
  "PROGRAMMING",
  "DEVELOPER",
  "CODING",
  "COMPUTER",
  "SOFTWARE",
  "INTERFACE",
  "APPLICATION",
];

const MAX_TRIES = 6;

const Hangman = () => {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [remainingTries, setRemainingTries] = useState(MAX_TRIES);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setRemainingTries(MAX_TRIES);
    setGameOver(false);
    setGameWon(false);
  };

  const guessLetter = (letter: string) => {
    if (gameOver || gameWon || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newRemainingTries = remainingTries - 1;
      setRemainingTries(newRemainingTries);

      if (newRemainingTries === 0) {
        setGameOver(true);
        toast.error("Game Over! The word was: " + word);
      }
    } else {
      const isWordComplete = [...word].every(letter => newGuessedLetters.has(letter));
      if (isWordComplete) {
        setGameWon(true);
        toast.success("Congratulations! You won!");
      }
    }
  };

  const renderWord = () => {
    return word.split("").map((letter, index) => (
      <span key={index} className="mx-1 text-4xl font-bold">
        {guessedLetters.has(letter) ? letter : "_"}
      </span>
    ));
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Hangman</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-gray-700 px-4 py-2 rounded">
              <p className="text-white">Tries Left: {remainingTries}</p>
            </div>
            <Button 
              onClick={startNewGame}
              className="bg-purple-600 hover:bg-purple-700"
            >
              New Game
            </Button>
          </div>

          <div className="text-white text-center mb-8">
            {renderWord()}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {alphabet.map((letter) => (
              <Button
                key={letter}
                onClick={() => guessLetter(letter)}
                disabled={
                  guessedLetters.has(letter) || gameOver || gameWon
                }
                className={`w-10 h-10 ${
                  guessedLetters.has(letter)
                    ? "bg-gray-600"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-white text-sm text-center">
          Guess the word by clicking on letters<br/>
          You have {MAX_TRIES} tries to guess correctly!
        </div>
      </div>
    </div>
  );
};

export default Hangman;