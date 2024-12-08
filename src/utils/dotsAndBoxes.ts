// Line index calculations
export const getLineIndex = (row: number, col: number, size: number, isHorizontal: boolean): number => {
  return isHorizontal ? row * size + col : row + col * size;
};

// Check if a move is valid
export const isValidMove = (row: number, col: number, size: number, isHorizontal: boolean): boolean => {
  // Basic boundary checks
  if (row < 0 || col < 0) return false;
  
  // For horizontal lines:
  // - row must be between 0 and size (inclusive) for dot rows
  // - col must be between 0 and size-1 (inclusive) for connecting horizontal lines
  if (isHorizontal) {
    return row >= 0 && row <= size && col >= 0 && col < size;
  }
  
  // For vertical lines:
  // - row must be between 0 and size-1 (inclusive) for connecting vertical lines
  // - col must be between 0 and size (inclusive) for dot columns
  return row >= 0 && row < size && col >= 0 && col <= size;
};

// Check if a box is completed
export const isBoxCompleted = (
  row: number,
  col: number,
  lines: boolean[][],
  size: number
): boolean => {
  // Get indices for all four lines around the box
  const topLineIndex = row * size + col;
  const bottomLineIndex = (row + 1) * size + col;
  const leftLineIndex = row + col * size;
  const rightLineIndex = row + (col + 1) * size;

  // Check if all four lines are drawn
  return (
    lines[0][topLineIndex] &&     // top line
    lines[0][bottomLineIndex] &&  // bottom line
    lines[1][leftLineIndex] &&    // left line
    lines[1][rightLineIndex]      // right line
  );
};