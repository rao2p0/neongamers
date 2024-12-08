import { cn } from "@/lib/utils";
import SudokuCell from "./SudokuCell";

interface SudokuBoardProps {
  puzzle: string[][];
  initialPuzzle: string[][];
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, value: string) => void;
  isValidCell: (row: number, col: number) => boolean;
}

const SudokuBoard = ({
  puzzle,
  initialPuzzle,
  selectedCell,
  onCellSelect,
  onCellChange,
  isValidCell,
}: SudokuBoardProps) => {
  return (
    <div className="grid grid-cols-9 gap-0.5 bg-gray-300 p-0.5">
      {puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isInitial = initialPuzzle[rowIndex][colIndex] !== '';
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "bg-white",
                colIndex % 3 === 2 && colIndex < 8 && "border-r-2 border-r-gray-400",
                rowIndex % 3 === 2 && rowIndex < 8 && "border-b-2 border-b-gray-400"
              )}
            >
              <SudokuCell
                value={cell}
                isInitial={isInitial}
                isSelected={isSelected}
                isValid={isValidCell(rowIndex, colIndex)}
                onSelect={() => onCellSelect(rowIndex, colIndex)}
                onChange={(value) => onCellChange(rowIndex, colIndex, value)}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default SudokuBoard;