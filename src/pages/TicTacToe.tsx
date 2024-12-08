import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Player = "X" | "O";
type BoardState = (Player | null)[];

const TicTacToe = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState<Player>("X");
  const [gameStarted, setGameStarted] = useState(false);
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

  const getAvailableMoves = (squares: BoardState): number[] => {
    return squares.reduce<number[]>((moves, cell, index) => 
      cell === null ? [...moves, index] : moves, []);
  };

  const minimax = (squares: BoardState, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(squares);
    if (winner === (playerSymbol === "X" ? "O" : "X")) return -10 + depth;
    if (winner === playerSymbol) return 10 - depth;
    if (getAvailableMoves(squares).length === 0) return 0;

    const moves = getAvailableMoves(squares);
    const computerSymbol = playerSymbol === "X" ? "O" : "X";

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of moves) {
        squares[move] = computerSymbol;
        const score = minimax(squares, depth + 1, false);
        squares[move] = null;
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        squares[move] = playerSymbol;
        const score = minimax(squares, depth + 1, true);
        squares[move] = null;
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  const computerMove = () => {
    const newBoard = [...board];
    const availableMoves = getAvailableMoves(newBoard);
    const computerSymbol = playerSymbol === "X" ? "O" : "X";
    
    if (availableMoves.length > 0) {
      let bestScore = -Infinity;
      let bestMove = availableMoves[0];

      for (const move of availableMoves) {
        newBoard[move] = computerSymbol;
        const score = minimax(newBoard, 0, false);
        newBoard[move] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      newBoard[bestMove] = computerSymbol;
      setBoard(newBoard);

      const winner = checkWinner(newBoard);
      if (winner) {
        setGameOver(true);
        toast.success(`Computer wins!`);
      } else if (!newBoard.includes(null)) {
        setGameOver(true);
        toast.info("It's a draw!");
      }
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver || !gameStarted) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      toast.success(`You win!`);
      return;
    }

    if (!newBoard.includes(null)) {
      setGameOver(true);
      toast.info("It's a draw!");
      return;
    }

    // Trigger computer's move after a short delay
    setTimeout(computerMove, 500);
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setGameStarted(false);
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

        {!gameStarted ? (
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <h2 className="text-white text-xl mb-4">Choose your symbol:</h2>
            <RadioGroup
              defaultValue={playerSymbol}
              onValueChange={(value) => setPlayerSymbol(value as Player)}
              className="flex gap-4 mb-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="X" />
                <Label htmlFor="X" className="text-white">Play as X</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="O" id="O" />
                <Label htmlFor="O" className="text-white">Play as O</Label>
              </div>
            </RadioGroup>
            <Button 
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-700 w-full"
            >
              Start Game
            </Button>
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-gray-700 px-4 py-2 rounded">
                <p className="text-white">Playing as: {playerSymbol}</p>
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
                  className={`w-20 h-20 flex items-center justify-center text-4xl font-bold 
                    ${square ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'} 
                    ${square === playerSymbol ? 'text-purple-400' : 'text-white'}
                    rounded transition-colors`}
                  disabled={!!square || gameOver}
                >
                  {square}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-white text-sm text-center">
          {gameStarted ? (
            "Click on any square to make your move"
          ) : (
            "Select your symbol to start the game"
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;