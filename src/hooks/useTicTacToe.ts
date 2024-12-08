import { useState } from "react";
import { toast } from "sonner";

type Player = "X" | "O";
type BoardState = (Player | null)[];

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

const minimax = (
  squares: BoardState,
  depth: number,
  isMaximizing: boolean,
  playerSymbol: Player
): number => {
  const winner = checkWinner(squares);
  const computerSymbol = playerSymbol === "X" ? "O" : "X";
  
  if (winner === computerSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (getAvailableMoves(squares).length === 0) return 0;

  const moves = getAvailableMoves(squares);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of moves) {
      squares[move] = computerSymbol;
      const score = minimax(squares, depth + 1, false, playerSymbol);
      squares[move] = null;
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of moves) {
      squares[move] = playerSymbol;
      const score = minimax(squares, depth + 1, true, playerSymbol);
      squares[move] = null;
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
};

export const useTicTacToe = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState<Player>("X");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const computerMove = () => {
    const newBoard = [...board];
    const availableMoves = getAvailableMoves(newBoard);
    const computerSymbol = playerSymbol === "X" ? "O" : "X";
    
    if (availableMoves.length > 0) {
      let bestScore = -Infinity;
      let bestMove = availableMoves[0];

      for (const move of availableMoves) {
        newBoard[move] = computerSymbol;
        const score = minimax(newBoard, 0, false, playerSymbol);
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

  const handlePlayerMove = (index: number) => {
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

  return {
    board,
    playerSymbol,
    gameStarted,
    gameOver,
    setPlayerSymbol,
    handlePlayerMove,
    startGame,
    resetGame
  };
};