import { useState, useCallback } from 'react';
import { toast } from "sonner";

const generateInitialPuzzle = () => {
  // For now, return a simple puzzle. In a real game, you'd want to generate random puzzles
  const puzzle = Array(9).fill('').map(() => Array(9).fill(''));
  const initialValues = [
    [1, 0, 0, 0, 0, 7, 0, 9, 0],
    [0, 3, 0, 0, 2, 0, 0, 0, 8],
    [0, 0, 9, 6, 0, 0, 5, 0, 0],
    [0, 0, 5, 3, 0, 0, 9, 0, 0],
    [0, 1, 0, 0, 8, 0, 0, 0, 2],
    [6, 0, 0, 0, 0, 4, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 7],
    [0, 0, 7, 0, 0, 0, 3, 0, 0],
  ];

  initialValues.forEach((row, i) => {
    row.forEach((value, j) => {
      if (value !== 0) {
        puzzle[i][j] = value.toString();
      }
    });
  });

  return puzzle;
};

const isValidMove = (puzzle: string[][], row: number, col: number, value: string): boolean => {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col && puzzle[row][i] === value) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && puzzle[i][col] === value) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (i !== row && j !== col && puzzle[i][j] === value) return false;
    }
  }

  return true;
};

const isBoardComplete = (puzzle: string[][]): boolean => {
  return puzzle.every(row => row.every(cell => cell !== ''));
};

// Solution for the current puzzle
const solution = [
    ["1", "5", "4", "8", "3", "7", "2", "9", "6"],
    ["7", "3", "6", "4", "2", "9", "1", "5", "8"],
    ["8", "2", "9", "6", "1", "5", "5", "4", "3"],
    ["4", "8", "5", "3", "7", "1", "9", "6", "2"],
    ["3", "1", "2", "5", "8", "6", "4", "7", "2"],
    ["6", "9", "7", "2", "5", "4", "8", "3", "1"],
    ["3", "6", "8", "7", "4", "2", "5", "1", "9"],
    ["5", "4", "1", "9", "6", "3", "2", "8", "7"],
    ["2", "7", "7", "1", "9", "8", "3", "6", "4"],
];

export const useSudoku = () => {
  const [puzzle, setPuzzle] = useState(() => generateInitialPuzzle());
  const [initialPuzzle] = useState(() => puzzle.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellSelect = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

  const handleCellChange = useCallback((row: number, col: number, value: string) => {
    if (initialPuzzle[row][col] !== '') return;

    setPuzzle(current => {
      const newPuzzle = current.map(r => [...r]);
      newPuzzle[row][col] = value;

      if (value !== '' && !isValidMove(newPuzzle, row, col, value)) {
        toast.error("Invalid move!");
      } else if (value !== '' && isBoardComplete(newPuzzle)) {
        toast.success("Congratulations! You solved the puzzle!");
      }

      return newPuzzle;
    });
  }, [initialPuzzle]);

  const getHint = useCallback(() => {
    // Find an empty cell that hasn't been filled correctly
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === '' || puzzle[row][col] !== solution[row][col]) {
          setPuzzle(current => {
            const newPuzzle = current.map(r => [...r]);
            newPuzzle[row][col] = solution[row][col];
            return newPuzzle;
          });
          toast.success("Here's a hint for you!");
          return;
        }
      }
    }
    toast.info("No more hints needed - you're doing great!");
  }, [puzzle]);

  const isValidCell = useCallback((row: number, col: number): boolean => {
    return puzzle[row][col] === '' || isValidMove(puzzle, row, col, puzzle[row][col]);
  }, [puzzle]);

  const resetGame = useCallback(() => {
    setPuzzle(generateInitialPuzzle());
    setSelectedCell(null);
  }, []);

  return {
    puzzle,
    initialPuzzle,
    selectedCell,
    handleCellSelect,
    handleCellChange,
    isValidCell,
    resetGame,
    getHint,
  };
};