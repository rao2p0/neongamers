import { useState } from "react";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  size: number;
  onLineClick: (row: number, col: number, isHorizontal: boolean) => void;
  lines: boolean[][];
  boxes: string[][];
  currentPlayer: "player" | "computer";
}

const GameBoard = ({ size, onLineClick, lines, boxes, currentPlayer }: GameBoardProps) => {
  const [selectedDot, setSelectedDot] = useState<{ row: number; col: number } | null>(null);
  const [hoveredLine, setHoveredLine] = useState<{ row: number; col: number; isHorizontal: boolean } | null>(null);

  const getLineClass = (row: number, col: number, isHorizontal: boolean) => {
    const isHovered = hoveredLine?.row === row && 
                     hoveredLine?.col === col && 
                     hoveredLine?.isHorizontal === isHorizontal;

    const lineIndex = isHorizontal ? 
      row * size + col : 
      row + col * size;

    const isDrawn = lines[isHorizontal ? 0 : 1][lineIndex];

    return cn(
      "absolute transform transition-colors duration-200",
      isHorizontal ? "h-1 w-12" : "w-1 h-12",
      isDrawn ? "bg-purple-500" : 
      isHovered ? "bg-purple-400" : "bg-gray-300 hover:bg-purple-300",
      currentPlayer === "computer" ? "pointer-events-none" : "cursor-pointer"
    );
  };

  const getDotClass = (row: number, col: number) => cn(
    "absolute w-3 h-3 rounded-full transform -translate-x-1.5 -translate-y-1.5 transition-colors duration-200",
    selectedDot?.row === row && selectedDot?.col === col 
      ? "bg-purple-500" 
      : currentPlayer === "computer"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gray-400 hover:bg-purple-400 cursor-pointer"
  );

  const getBoxClass = (row: number, col: number) => {
    const owner = boxes[row][col];
    return cn(
      "absolute w-12 h-12 flex items-center justify-center text-2xl font-bold transition-colors duration-300",
      owner === "player" ? "text-purple-500" : owner === "computer" ? "text-red-500" : "text-transparent"
    );
  };

  const handleDotClick = (row: number, col: number) => {
    if (currentPlayer === "computer") return;
    
    if (!selectedDot) {
      setSelectedDot({ row, col });
      return;
    }

    // Check if dots are adjacent
    const rowDiff = Math.abs(selectedDot.row - row);
    const colDiff = Math.abs(selectedDot.col - col);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      // Determine if it's a horizontal or vertical line
      const isHorizontal = rowDiff === 0;
      
      // Calculate the correct row and col for the line
      const lineRow = isHorizontal ? row : Math.min(selectedDot.row, row);
      const lineCol = isHorizontal ? Math.min(selectedDot.col, col) : col;
      
      onLineClick(lineRow, lineCol, isHorizontal);
    }
    
    setSelectedDot(null);
  };

  const handleLineClick = (row: number, col: number, isHorizontal: boolean) => {
    if (currentPlayer === "computer") return;
    
    // Check if the line is already drawn
    const lineIndex = isHorizontal ? row * size + col : row + col * size;
    if (lines[isHorizontal ? 0 : 1][lineIndex]) return;
    
    onLineClick(row, col, isHorizontal);
  };

  const handleLineMouseEnter = (row: number, col: number, isHorizontal: boolean) => {
    setHoveredLine({ row, col, isHorizontal });
  };

  const handleLineMouseLeave = () => {
    setHoveredLine(null);
  };

  return (
    <div className="relative" style={{ width: size * 48 + 12, height: size * 48 + 12 }}>
      {/* Horizontal lines */}
      {Array.from({ length: size + 1 }, (_, row) =>
        Array.from({ length: size }, (_, col) => (
          <button
            key={`h-${row}-${col}`}
            className={getLineClass(row, col, true)}
            style={{ top: row * 48, left: col * 48 + 12 }}
            onClick={() => handleLineClick(row, col, true)}
            onMouseEnter={() => handleLineMouseEnter(row, col, true)}
            onMouseLeave={handleLineMouseLeave}
          />
        ))
      )}

      {/* Vertical lines */}
      {Array.from({ length: size }, (_, row) =>
        Array.from({ length: size + 1 }, (_, col) => (
          <button
            key={`v-${row}-${col}`}
            className={getLineClass(row, col, false)}
            style={{ top: row * 48 + 12, left: col * 48 }}
            onClick={() => handleLineClick(row, col, false)}
            onMouseEnter={() => handleLineMouseEnter(row, col, false)}
            onMouseLeave={handleLineMouseLeave}
          />
        ))
      )}

      {/* Dots */}
      {Array.from({ length: size + 1 }, (_, row) =>
        Array.from({ length: size + 1 }, (_, col) => (
          <button
            key={`d-${row}-${col}`}
            className={getDotClass(row, col)}
            style={{ top: row * 48, left: col * 48 }}
            onClick={() => handleDotClick(row, col)}
            disabled={currentPlayer === "computer"}
          />
        ))
      )}

      {/* Boxes */}
      {Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, col) => (
          <div
            key={`b-${row}-${col}`}
            className={getBoxClass(row, col)}
            style={{ top: row * 48 + 12, left: col * 48 + 12 }}
          >
            {boxes[row][col] === "player" ? "P" : boxes[row][col] === "computer" ? "C" : ""}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;