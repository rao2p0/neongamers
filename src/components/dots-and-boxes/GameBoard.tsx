import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  size: number;
  onLineClick: (row: number, col: number, isHorizontal: boolean) => void;
  lines: boolean[][];
  boxes: string[][];
  currentPlayer: "player" | "computer";
}

const GameBoard = ({ size, onLineClick, lines, boxes, currentPlayer }: GameBoardProps) => {
  const [hoveredLine, setHoveredLine] = useState<{ row: number; col: number; isHorizontal: boolean } | null>(null);

  const getLineClass = (row: number, col: number, isHorizontal: boolean) => {
    const isHovered = hoveredLine?.row === row && 
                     hoveredLine?.col === col && 
                     hoveredLine?.isHorizontal === isHorizontal;

    // Calculate line index based on position and orientation
    const lineIndex = isHorizontal ? row * size + col : row + col * size;
    const isDrawn = lines[isHorizontal ? 0 : 1][lineIndex];

    return cn(
      "absolute transform transition-colors duration-200",
      isHorizontal ? "h-1 w-12" : "w-1 h-12",
      isDrawn ? "bg-purple-500" : 
      isHovered ? "bg-purple-400" : "bg-gray-300 hover:bg-purple-300",
      currentPlayer === "computer" && "pointer-events-none"
    );
  };

  const getDotClass = "absolute w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1.5 -translate-y-1.5";

  const getBoxClass = (row: number, col: number) => {
    const owner = boxes[row][col];
    return cn(
      "absolute w-12 h-12 flex items-center justify-center text-2xl font-bold transition-colors duration-300",
      owner === "player" ? "text-purple-500" : owner === "computer" ? "text-red-500" : "text-transparent"
    );
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
            onClick={() => onLineClick(row, col, true)}
            onMouseEnter={() => setHoveredLine({ row, col, isHorizontal: true })}
            onMouseLeave={() => setHoveredLine(null)}
            disabled={lines[0][row * size + col] || currentPlayer === "computer"}
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
            onClick={() => onLineClick(row, col, false)}
            onMouseEnter={() => setHoveredLine({ row, col, isHorizontal: false })}
            onMouseLeave={() => setHoveredLine(null)}
            disabled={lines[1][row + col * size] || currentPlayer === "computer"}
          />
        ))
      )}

      {/* Dots */}
      {Array.from({ length: size + 1 }, (_, row) =>
        Array.from({ length: size + 1 }, (_, col) => (
          <div
            key={`d-${row}-${col}`}
            className={getDotClass}
            style={{ top: row * 48, left: col * 48 }}
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