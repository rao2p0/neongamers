import { getLineIndex, isValidMove, isBoxCompleted } from "../utils/dotsAndBoxes";

interface ComputerMoveResult {
  row: number;
  col: number;
  isHorizontal: boolean;
}

export const findBestMove = (
  lines: boolean[][],
  size: number
): ComputerMoveResult | null => {
  // First, look for boxes that can be completed
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Check horizontal lines
      if (isValidMove(row, col, size, true)) {
        const lineIndex = getLineIndex(row, col, size, true);
        if (!lines[0][lineIndex] && wouldCompleteBox(row, col, true, lines, size)) {
          return { row, col, isHorizontal: true };
        }
      }
      // Check vertical lines
      if (isValidMove(row, col, size, false)) {
        const lineIndex = getLineIndex(row, col, size, false);
        if (!lines[1][lineIndex] && wouldCompleteBox(row, col, false, lines, size)) {
          return { row, col, isHorizontal: false };
        }
      }
    }
  }

  // If no completing moves, make a random valid move
  const availableMoves: ComputerMoveResult[] = [];
  for (let row = 0; row <= size; row++) {
    for (let col = 0; col <= size; col++) {
      if (isValidMove(row, col, size, true) && !lines[0][getLineIndex(row, col, size, true)]) {
        availableMoves.push({ row, col, isHorizontal: true });
      }
      if (isValidMove(row, col, size, false) && !lines[1][getLineIndex(row, col, size, false)]) {
        availableMoves.push({ row, col, isHorizontal: false });
      }
    }
  }

  if (availableMoves.length === 0) return null;
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const wouldCompleteBox = (
  row: number,
  col: number,
  isHorizontal: boolean,
  lines: boolean[][],
  size: number
): boolean => {
  if (isHorizontal) {
    // Check box above
    if (row > 0 && hasThreeLines(row - 1, col, lines, size)) return true;
    // Check box below
    if (row < size && hasThreeLines(row, col, lines, size)) return true;
  } else {
    // Check box to the left
    if (col > 0 && hasThreeLines(row, col - 1, lines, size)) return true;
    // Check box to the right
    if (col < size && hasThreeLines(row, col, lines, size)) return true;
  }
  return false;
};

const hasThreeLines = (
  row: number,
  col: number,
  lines: boolean[][],
  size: number
): boolean => {
  const topLine = lines[0][row * size + col];
  const bottomLine = lines[0][(row + 1) * size + col];
  const leftLine = lines[1][row + col * size];
  const rightLine = lines[1][row + (col + 1) * size];
  
  return (topLine && bottomLine && leftLine && !rightLine) ||
         (topLine && bottomLine && !leftLine && rightLine) ||
         (topLine && !bottomLine && leftLine && rightLine) ||
         (!topLine && bottomLine && leftLine && rightLine);
};