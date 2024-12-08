import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export const useDotsAndBoxes = (size: number) => {
  // Initialize horizontal and vertical lines separately
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
    // Get indices for the lines surrounding this box
    const topLineIndex = row * size + col;
    const bottomLineIndex = (row + 1) * size + col;
    const leftLineIndex = row + col * size;
    const rightLineIndex = row + (col + 1) * size;

    // Check if all four lines are drawn
    const top = lines[0][topLineIndex];
    const bottom = lines[0][bottomLineIndex];
    const left = lines[1][leftLineIndex];
    const right = lines[1][rightLineIndex];

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
              const topLineIndex = (row - 1) * size + col;
              const leftLineIndex = (row - 1) + col * size;
              const rightLineIndex = (row - 1) + (col + 1) * size;
              if (lines[0][topLineIndex] && lines[1][leftLineIndex] && lines[1][rightLineIndex]) completes = true;
            }
            if (row < size) {
              const bottomLineIndex = (row + 1) * size + col;
              const leftLineIndex = row + col * size;
              const rightLineIndex = row + (col + 1) * size;
              if (lines[0][bottomLineIndex] && lines[1][leftLineIndex] && lines[1][rightLineIndex]) completes = true;
            }
          } else {
            if (col > 0) {
              const leftLineIndex = row + (col - 1) * size;
              const topLineIndex = row * size + (col - 1);
              const bottomLineIndex = (row + 1) * size + (col - 1);
              if (lines[1][leftLineIndex] && lines[0][topLineIndex] && lines[0][bottomLineIndex]) completes = true;
            }
            if (col < size) {
              const rightLineIndex = row + (col + 1) * size;
              const topLineIndex = row * size + col;
              const bottomLineIndex = (row + 1) * size + col;
              if (lines[1][rightLineIndex] && lines[0][topLineIndex] && lines[0][bottomLineIndex]) completes = true;
            }
          }
          
          if (completes) {
            return { row, col, isHorizontal: Boolean(isHorizontal) };
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

    // Calculate the correct line index based on orientation
    const lineIndex = isHorizontal ? row * size + col : row + col * size;
    
    // Check if the line is already drawn
    if (lines[isHorizontal ? 0 : 1][lineIndex]) {
      return;
    }

    // Update lines state
    const newLines = lines.map(arr => [...arr]);
    newLines[isHorizontal ? 0 : 1][lineIndex] = true;
    setLines(newLines);

    let boxCompleted = false;
    const newBoxes = [...boxes.map(row => [...row])];

    // Check surrounding boxes for completion
    const checkSurroundingBoxes = () => {
      if (isHorizontal) {
        // Check box above the line (if not top row)
        if (row > 0) {
          const boxOwner = checkBox(row - 1, col);
          if (boxOwner) {
            newBoxes[row - 1][col] = boxOwner;
            boxCompleted = true;
          }
        }
        // Check box below the line (if not bottom row)
        if (row < size) {
          const boxOwner = checkBox(row, col);
          if (boxOwner) {
            newBoxes[row][col] = boxOwner;
            boxCompleted = true;
          }
        }
      } else {
        // Check box to the left of the line (if not leftmost column)
        if (col > 0) {
          const boxOwner = checkBox(row, col - 1);
          if (boxOwner) {
            newBoxes[row][col - 1] = boxOwner;
            boxCompleted = true;
          }
        }
        // Check box to the right of the line (if not rightmost column)
        if (col < size) {
          const boxOwner = checkBox(row, col);
          if (boxOwner) {
            newBoxes[row][col] = boxOwner;
            boxCompleted = true;
          }
        }
      }
    };

    checkSurroundingBoxes();
    setBoxes(newBoxes);

    if (boxCompleted) {
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1
      }));
    }

    // Check if game is over
    const totalBoxes = size * size;
    const newTotalScore = scores.player + scores.computer + (boxCompleted ? 1 : 0);
    
    if (newTotalScore === totalBoxes) {
      setGameOver(true);
      const winner = scores.player > scores.computer ? "player" : "computer";
      toast.success(`Game Over! ${winner === "player" ? "You" : "Computer"} won!`);
      return;
    }

    // Switch turns if no box was completed
    if (!boxCompleted) {
      setCurrentPlayer(current => current === "player" ? "computer" : "player");
    }
  }, [lines, boxes, scores, gameOver, size, checkBox, currentPlayer]);

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