import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Player = "X" | "O";
type BoardState = (Player | null)[];

const TicTacToe = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (squares: BoardState): Player | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a] as Player;
      }
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      toast.success(`Player ${winner} wins!`);
      return;
    }

    if (newBoard.every(square => square !== null)) {
      setGameOver(true);
      toast.info("It's a draw!");
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Tic Tac Toe</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-gray-700 px-4 py-2 rounded">
              <p className="text-white">Current Player: {currentPlayer}</p>
            </div>
            <Button 
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-700"
            >
              New Game
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {board.map((square, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={`w-20 h-20 flex items-center justify-center text-4xl font-bold ${
                  square ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'
                } text-white rounded transition-colors`}
                disabled={!!square || gameOver}
              >
                {square}
              </button>
            ))}
          </div>
        </div>

        <div className="text-white text-sm text-center">
          Click on any square to make your move<br/>
          Get three in a row to win!
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;