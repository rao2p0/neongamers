import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { getLineIndex, isValidMove, isBoxCompleted } from "../utils/dotsAndBoxes";
import { findBestMove } from "./useComputerMove";

export const useDotsAndBoxes = (size: number) => {
  const [lines, setLines] = useState<boolean[][]>([
    Array(size * (size + 1)).fill(false), // horizontal lines
    Array((size + 1) * size).fill(false), // vertical lines
  ]);
  
  const [boxes, setBoxes] = useState<string[][]>(
    Array(size).fill(null).map(() => Array(size).fill(""))
  );
  const [currentPlayer, setCurrentPlayer] = useState<"player" | "computer">("player");
  const [scores, setScores] = useState({ player: 0, computer: 0 });
  const [gameOver, setGameOver] = useState(false);

  const checkForCompletedBoxes = useCallback((newLines: boolean[][]): string[][] => {
    const newBoxes = [...boxes.map(row => [...row])];
    let boxCompleted = false;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!newBoxes[row][col] && isBoxCompleted(row, col, newLines, size)) {
          newBoxes[row][col] = currentPlayer;
          boxCompleted = true;
        }
      }
    }

    if (boxCompleted) {
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1
      }));
    }

    return newBoxes;
  }, [boxes, currentPlayer, size]);

  const makeMove = useCallback((row: number, col: number, isHorizontal: boolean) => {
    if (gameOver || !isValidMove(row, col, size, isHorizontal)) return;

    const lineIndex = getLineIndex(row, col, size, isHorizontal);
    if (lines[isHorizontal ? 0 : 1][lineIndex]) return;

    const newLines = lines.map(arr => [...arr]);
    newLines[isHorizontal ? 0 : 1][lineIndex] = true;
    
    const newBoxes = checkForCompletedBoxes(newLines);
    const boxesCompleted = JSON.stringify(boxes) !== JSON.stringify(newBoxes);

    setLines(newLines);
    setBoxes(newBoxes);

    // Check if game is over
    const totalBoxes = size * size;
    const newTotalScore = scores.player + scores.computer + (boxesCompleted ? 1 : 0);
    
    if (newTotalScore === totalBoxes) {
      setGameOver(true);
      const winner = scores.player > scores.computer ? "player" : "computer";
      toast.success(`Game Over! ${winner === "player" ? "You" : "Computer"} won!`);
      return;
    }

    // Switch turns if no box was completed
    if (!boxesCompleted) {
      setCurrentPlayer(current => current === "player" ? "computer" : "player");
    }
  }, [lines, boxes, scores, gameOver, size, checkForCompletedBoxes]);

  // Computer's turn
  useEffect(() => {
    if (currentPlayer === "computer" && !gameOver) {
      const timer = setTimeout(() => {
        const move = findBestMove(lines, size);
        if (move) {
          makeMove(move.row, move.col, move.isHorizontal);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, lines, size, makeMove]);

  const resetGame = useCallback(() => {
    setLines([
      Array(size * (size + 1)).fill(false),
      Array((size + 1) * size).fill(false),
    ]);
    setBoxes(Array(size).fill(null).map(() => Array(size).fill("")));
    setCurrentPlayer("player");
    setScores({ player: 0, computer: 0 });
    setGameOver(false);
  }, [size]);

  return {
    lines,
    boxes,
    currentPlayer,
    scores,
    gameOver,
    makeMove,
    resetGame,
  };
};