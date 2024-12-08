// Line index calculations
export const getLineIndex = (row: number, col: number, size: number, isHorizontal: boolean): number => {
  return isHorizontal ? row * size + col : row + col * size;
};

// Check if a move is valid
export const isValidMove = (row: number, col: number, size: number, isHorizontal: boolean): boolean => {
  // For horizontal lines:
  // - row can be 0 to size (inclusive) because we need one more row of dots
  // - col can be 0 to size-1 because we need one less column of lines than dots
  if (isHorizontal) {
    return row >= 0 && row <= size && col >= 0 && col < size;
  }
  
  // For vertical lines:
  // - row can be 0 to size-1 because we need one less row of lines than dots
  // - col can be 0 to size (inclusive) because we need one more column of dots
  return row >= 0 && row < size && col >= 0 && col <= size;
};

// Check if a box is completed
export const isBoxCompleted = (
  row: number,
  col: number,
  lines: boolean[][],
  size: number
): boolean => {
  const topLineIndex = row * size + col;
  const bottomLineIndex = (row + 1) * size + col;
  const leftLineIndex = row + col * size;
  const rightLineIndex = row + (col + 1) * size;

  return (
    lines[0][topLineIndex] &&
    lines[0][bottomLineIndex] &&
    lines[1][leftLineIndex] &&
    lines[1][rightLineIndex]
  );
};