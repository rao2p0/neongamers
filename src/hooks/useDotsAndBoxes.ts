import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

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

  const checkBox = useCallback((row: number, col: number): string | null => {
    // Get the indices for the lines surrounding this box
    const top = lines[0][row * size + col];
    const bottom = lines[0][(row + 1) * size + col];
    const left = lines[1][row + col * size];
    const right = lines[1][row + (col + 1) * size];

    if (top && bottom && left && right) {
      return currentPlayer;
    }
    return null;
  }, [lines, currentPlayer, size]);

  const findBestMove = useCallback((): { row: number; col: number; isHorizontal: boolean } | null => {
    // First, look for boxes that can be completed
    for (let isHorizontal = 0; isHorizontal < 2; isHorizontal++) {
      const maxIndex = isHorizontal ? size * (size + 1) : (size + 1) * size;
      for (let i = 0; i < maxIndex; i++) {
        if (!lines[isHorizontal][i]) {
          // Try this move
          const newLines = lines.map(arr => [...arr]);
          newLines[isHorizontal][i] = true;
          
          // Calculate row and col based on the line index
          let row, col;
          if (isHorizontal) {
            row = Math.floor(i / size);
            col = i % size;
          } else {
            row = i % size;
            col = Math.floor(i / size);
          }
          
          // Check if this move completes any boxes
          let completes = false;
          if (isHorizontal) {
            if (row > 0) {
              const top = lines[0][(row - 1) * size + col];
              const left = lines[1][(row - 1) + col * size];
              const right = lines[1][(row - 1) + (col + 1) * size];
              if (top && left && right) completes = true;
            }
            if (row < size) {
              const bottom = lines[0][(row + 1) * size + col];
              const left = lines[1][row + col * size];
              const right = lines[1][row + (col + 1) * size];
              if (bottom && left && right) completes = true;
            }
          } else {
            if (col > 0) {
              const left = lines[1][row + (col - 1) * size];
              const top = lines[0][row * size + (col - 1)];
              const bottom = lines[0][(row + 1) * size + (col - 1)];
              if (left && top && bottom) completes = true;
            }
            if (col < size) {
              const right = lines[1][row + (col + 1) * size];
              const top = lines[0][row * size + col];
              const bottom = lines[0][(row + 1) * size + col];
              if (right && top && bottom) completes = true;
            }
          }
          
          if (completes) {
            return {
              row,
              col,
              isHorizontal: Boolean(isHorizontal)
            };
          }
        }
      }
    }

    // If no completing moves, make a random move
    const availableMoves: { row: number; col: number; isHorizontal: boolean }[] = [];
    for (let isHorizontal = 0; isHorizontal < 2; isHorizontal++) {
      const maxIndex = isHorizontal ? size * (size + 1) : (size + 1) * size;
      for (let i = 0; i < maxIndex; i++) {
        if (!lines[isHorizontal][i]) {
          const row = isHorizontal ? Math.floor(i / size) : i % size;
          const col = isHorizontal ? i % size : Math.floor(i / size);
          availableMoves.push({
            row,
            col,
            isHorizontal: Boolean(isHorizontal)
          });
        }
      }
    }

    if (availableMoves.length === 0) return null;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }, [lines, size]);

  const makeMove = useCallback((row: number, col: number, isHorizontal: boolean) => {
    if (gameOver) return;

    const newLines = lines.map(arr => [...arr]);
    const lineIndex = isHorizontal ? row * size + col : row + col * size;
    
    // Check if the line is already drawn
    if (newLines[isHorizontal ? 0 : 1][lineIndex]) {
      return;
    }
    
    newLines[isHorizontal ? 0 : 1][lineIndex] = true;
    setLines(newLines);

    let boxCompleted = false;
    const newBoxes = [...boxes.map(row => [...row])];

    // Check if any boxes were completed
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!boxes[r][c]) {
          const boxOwner = checkBox(r, c);
          if (boxOwner) {
            newBoxes[r][c] = boxOwner;
            boxCompleted = true;
            setScores(prev => ({
              ...prev,
              [boxOwner]: prev[boxOwner as keyof typeof prev] + 1
            }));
          }
        }
      }
    }

    setBoxes(newBoxes);

    // Check if game is over
    const totalBoxes = size * size;
    if (scores.player + scores.computer + (boxCompleted ? 1 : 0) === totalBoxes) {
      setGameOver(true);
      const winner = scores.player > scores.computer ? "player" : "computer";
      toast.success(`Game Over! ${winner === "player" ? "You" : "Computer"} won!`);
      return;
    }

    // Switch turns if no box was completed
    if (!boxCompleted) {
      setCurrentPlayer(current => current === "player" ? "computer" : "player");
    }
  }, [lines, boxes, scores, gameOver, size, checkBox]);

  // Computer's turn
  useEffect(() => {
    if (currentPlayer === "computer" && !gameOver) {
      const timer = setTimeout(() => {
        const move = findBestMove();
        if (move) {
          makeMove(move.row, move.col, move.isHorizontal);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, findBestMove, makeMove]);

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