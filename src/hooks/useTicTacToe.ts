import { useState, useCallback, useEffect } from "react";
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
  const [isComputerTurn, setIsComputerTurn] = useState(false);

  const computerMove = useCallback(() => {
    console.log("Computer's turn");
    const computerSymbol = playerSymbol === "X" ? "O" : "X";
    
    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      const availableMoves = getAvailableMoves(newBoard);
      
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
        console.log(`Computer placed ${computerSymbol} at position ${bestMove}`);
        return newBoard;
      }
      return currentBoard;
    });

    setIsComputerTurn(false);
  }, [playerSymbol]);

  useEffect(() => {
    if (isComputerTurn && !gameOver && gameStarted) {
      const timer = setTimeout(computerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isComputerTurn, gameOver, gameStarted, computerMove]);

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setGameOver(true);
      toast.success(winner === playerSymbol ? "You win!" : "Computer wins!");
    } else if (!board.includes(null)) {
      setGameOver(true);
      toast.info("It's a draw!");
    }
  }, [board, playerSymbol]);

  const handlePlayerMove = (index: number) => {
    console.log(`Player attempting move at position ${index}`);
    if (board[index] || gameOver || !gameStarted || isComputerTurn) {
      console.log("Move rejected:", {
        alreadyOccupied: !!board[index],
        gameOver,
        notStarted: !gameStarted,
        computerTurn: isComputerTurn
      });
      return;
    }

    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      newBoard[index] = playerSymbol;
      console.log(`Player placed ${playerSymbol} at position ${index}`);
      return newBoard;
    });

    setIsComputerTurn(true);
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setGameStarted(true);
    setIsComputerTurn(false);
    console.log("Game started with player symbol:", playerSymbol);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setGameStarted(false);
    setIsComputerTurn(false);
    console.log("Game reset");
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