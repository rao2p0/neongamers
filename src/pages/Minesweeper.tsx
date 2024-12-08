import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

const Minesweeper = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const rows = 10;
  const cols = 10;
  const mines = 10;

  const initializeBoard = () => {
    // Create empty board
    let newBoard = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0;
          // Check all 8 neighbors
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di === 0 && dj === 0) continue;
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && newBoard[ni][nj].isMine) {
                count++;
              }
            }
          }
          newBoard[i][j].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const revealCell = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isRevealed || board[row][col].isFlagged) return;

    const newBoard = [...board];
    
    if (board[row][col].isMine) {
      // Game Over
      newBoard[row][col].isRevealed = true;
      setBoard(newBoard);
      setGameOver(true);
      toast.error("Game Over!");
      return;
    }

    // Reveal current cell
    newBoard[row][col].isRevealed = true;

    // If cell has no neighboring mines, reveal neighbors recursively
    if (board[row][col].neighborMines === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = row + di;
          const nj = col + dj;
          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && !newBoard[ni][nj].isRevealed) {
            revealCell(ni, nj);
          }
        }
      }
    }

    setBoard(newBoard);

    // Check for win
    const allNonMinesRevealed = board.every((row) =>
      row.every((cell) => (cell.isMine && !cell.isRevealed) || (!cell.isMine && cell.isRevealed))
    );

    if (allNonMinesRevealed) {
      setGameWon(true);
      toast.success("Congratulations! You won!");
    }
  };

  const toggleFlag = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  const getCellColor = (cell: Cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) return "bg-red-500";
      return cell.neighborMines === 0 ? "bg-gray-200" : "bg-gray-100";
    }
    return cell.isFlagged ? "bg-yellow-200" : "bg-gray-300";
  };

  const getCellContent = (cell: Cell) => {
    if (!cell.isRevealed) return cell.isFlagged ? "🚩" : "";
    if (cell.isMine) return "💣";
    return cell.neighborMines === 0 ? "" : cell.neighborMines;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Minesweeper</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-gray-700 px-4 py-2 rounded">
              <p className="text-white">Mines: {mines}</p>
            </div>
            <Button 
              onClick={initializeBoard}
              className="bg-purple-600 hover:bg-purple-700"
            >
              New Game
            </Button>
          </div>
          
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  className={`w-8 h-8 flex items-center justify-center font-bold ${getCellColor(cell)} hover:brightness-95 transition-all`}
                  onClick={() => revealCell(i, j)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    toggleFlag(i, j);
                  }}
                  disabled={gameOver || gameWon}
                >
                  {getCellContent(cell)}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="text-white text-sm text-center">
          Right-click to flag mines<br/>
          Clear all cells without mines to win!
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;