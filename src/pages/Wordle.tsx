import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import WordleGrid from "@/components/wordle/WordleGrid";
import WordleKeyboard from "@/components/wordle/WordleKeyboard";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const Wordle = () => {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Extended word list for more variety
  const wordList = [
    "REACT", "VITES", "GAMES", "CODES", "BUILD",
    "WORLD", "PIXEL", "SCORE", "LEVEL", "POWER",
    "BRAIN", "SMART", "QUICK", "LOGIC", "THINK",
    "GUESS", "SOLVE", "LEARN", "WRITE", "CLICK",
    "MOUSE", "BOARD", "SPACE", "LIGHT", "SOUND"
  ];

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setTargetWord(newWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setGameWon(false);
  };

  const handleKeyPress = (key: string) => {
    if (gameOver || gameWon) return;

    if (key === "ENTER") {
      if (currentGuess.length !== WORD_LENGTH) {
        toast.error("Word must be 5 letters long!");
        return;
      }

      const guessUpperCase = currentGuess.toUpperCase();
      if (!wordList.includes(guessUpperCase)) {
        toast.error("Not in word list!");
        return;
      }

      const newGuesses = [...guesses, guessUpperCase];
      setGuesses(newGuesses);
      setCurrentGuess("");

      if (guessUpperCase === targetWord) {
        setGameWon(true);
        toast.success("Congratulations! You won!");
        return;
      }

      if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameOver(true);
        toast.error(`Game Over! The word was ${targetWord}`);
      }
    } else if (key === "BACKSPACE") {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const getLetterStates = () => {
    const states: { [key: string]: 'correct' | 'present' | 'absent' | 'unused' } = {};
    
    // Initialize all letters as unused
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      states[letter] = 'unused';
    });

    // Count letter frequencies in target word
    const targetLetterCount: { [key: string]: number } = {};
    targetWord.split('').forEach(letter => {
      targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
    });

    // Update states based on guesses
    guesses.forEach(guess => {
      const remainingLetters = { ...targetLetterCount };
      const guessArray = guess.split('');
      
      // First pass: mark correct letters
      guessArray.forEach((letter, i) => {
        if (targetWord[i] === letter) {
          states[letter] = 'correct';
          remainingLetters[letter]--;
        }
      });

      // Second pass: mark present/absent letters
      guessArray.forEach((letter, i) => {
        if (targetWord[i] !== letter) {
          if (remainingLetters[letter] > 0) {
            states[letter] = 'present';
            remainingLetters[letter]--;
          } else {
            if (states[letter] !== 'correct') {
              states[letter] = 'absent';
            }
          }
        }
      });
    });

    return states;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Wordle</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-gray-700 px-4 py-2 rounded">
              <p className="text-white">Attempts: {guesses.length}/{MAX_ATTEMPTS}</p>
            </div>
            <Button 
              onClick={startNewGame}
              className="bg-purple-600 hover:bg-purple-700"
            >
              New Game
            </Button>
          </div>

          <WordleGrid 
            currentGuess={currentGuess}
            guesses={guesses}
            targetWord={targetWord}
            maxAttempts={MAX_ATTEMPTS}
          />

          <div className="mt-8">
            <WordleKeyboard 
              onKeyPress={handleKeyPress}
              letterStates={getLetterStates()}
            />
          </div>
        </div>

        <div className="text-white text-sm text-center">
          Guess the 5-letter word<br/>
          Green = correct position, Yellow = wrong position, Gray = not in word
        </div>
      </div>
    </div>
  );
};

export default Wordle;