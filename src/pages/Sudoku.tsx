import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SudokuBoard from "@/components/sudoku/SudokuBoard";
import { useSudoku } from "@/hooks/useSudoku";

const Sudoku = () => {
  const {
    puzzle,
    initialPuzzle,
    selectedCell,
    handleCellSelect,
    handleCellChange,
    isValidCell,
    resetGame,
  } = useSudoku();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Sudoku</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Button 
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-700"
            >
              New Game
            </Button>
          </div>

          <SudokuBoard
            puzzle={puzzle}
            initialPuzzle={initialPuzzle}
            selectedCell={selectedCell}
            onCellSelect={handleCellSelect}
            onCellChange={handleCellChange}
            isValidCell={isValidCell}
          />
        </div>

        <div className="text-white text-sm text-center">
          Fill in the empty cells with numbers 1-9<br/>
          Each row, column, and 3x3 box must contain all numbers 1-9
        </div>
      </div>
    </div>
  );
};

export default Sudoku;