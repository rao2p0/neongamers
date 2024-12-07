import { useEffect, useState, useCallback } from "react";
import Cell from "./Cell";
import { 
  BOARD_HEIGHT, 
  BOARD_WIDTH, 
  BoardType, 
  TetrominoType, 
  Position,
  TETROMINOES,
  createEmptyBoard,
  isValidMove,
  mergePieceToBoard,
  clearLines,
  randomTetromino,
  rotateMatrix
} from "@/utils/tetris";
import { useToast } from "@/components/ui/use-toast";

interface BoardProps {
  isPlaying: boolean;
  onGameOver: () => void;
  onScoreUpdate: (points: number) => void;
  setNextPiece: (piece: TetrominoType) => void;
}

const INITIAL_DROP_TIME = 1000;
const POINTS_PER_LINE = 100;

const Board = ({ isPlaying, onGameOver, onScoreUpdate, setNextPiece }: BoardProps) => {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<TetrominoType | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dropTime, setDropTime] = useState<number | null>(null);
  const { toast } = useToast();

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    const newPiece = randomTetromino();
    const nextPiece = randomTetromino();
    setCurrentPiece(newPiece);
    setNextPiece(nextPiece);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setDropTime(INITIAL_DROP_TIME);
  }, [setNextPiece]);

  useEffect(() => {
    if (isPlaying && !currentPiece) {
      resetGame();
    }
  }, [isPlaying, currentPiece, resetGame]);

  const movePlayer = useCallback((dir: number) => {
    if (!currentPiece) return;
    
    const newPos = { ...position, x: position.x + dir };
    if (isValidMove(board, currentPiece, newPos)) {
      setPosition(newPos);
    }
  }, [board, currentPiece, position]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece) return;

    const piece = TETROMINOES[currentPiece];
    const newShape = rotateMatrix(piece.shape);
    const rotatedPiece = {
      ...piece,
      shape: newShape
    };

    // Check if the rotated piece would be in a valid position
    const isValid = newShape.every((row, y) =>
      row.every((cell, x) => {
        if (!cell) return true;
        const newX = position.x + x;
        const newY = position.y + y;
        return (
          newX >= 0 &&
          newX < BOARD_WIDTH &&
          newY < BOARD_HEIGHT &&
          (newY < 0 || board[newY][newX] === null)
        );
      })
    );

    if (isValid) {
      TETROMINOES[currentPiece].shape = newShape;
    }
  }, [board, currentPiece, position]);

  const drop = useCallback(() => {
    if (!currentPiece) return;

    const newPos = { ...position, y: position.y + 1 };
    if (isValidMove(board, currentPiece, newPos)) {
      setPosition(newPos);
    } else {
      // Merge the piece into the board
      const newBoard = mergePieceToBoard(board, currentPiece, position);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      if (linesCleared > 0) {
        onScoreUpdate(linesCleared * POINTS_PER_LINE);
        toast({
          title: "Lines Cleared!",
          description: `You cleared ${linesCleared} lines!`,
        });
      }
      
      setBoard(clearedBoard);
      
      // Get next piece
      const nextPiece = randomTetromino();
      setCurrentPiece(nextPiece);
      setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
      setNextPiece(randomTetromino());
      
      // Check for game over
      if (!isValidMove(clearedBoard, nextPiece, { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })) {
        onGameOver();
      }
    }
  }, [board, currentPiece, position, onScoreUpdate, setNextPiece, onGameOver, toast]);

  useEffect(() => {
    if (!isPlaying || !dropTime) return;
    
    const dropInterval = setInterval(() => {
      drop();
    }, dropTime);
    
    return () => clearInterval(dropInterval);
  }, [drop, dropTime, isPlaying]);

  const hardDrop = useCallback(() => {
    if (!currentPiece) return;
    
    let newY = position.y;
    while (isValidMove(board, currentPiece, { ...position, y: newY + 1 })) {
      newY++;
    }
    setPosition({ ...position, y: newY });
    drop();
  }, [board, currentPiece, position, drop]);

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentPiece) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePlayer(-1);
          break;
        case 'ArrowRight':
          movePlayer(1);
          break;
        case 'ArrowDown':
          drop();
          break;
        case 'ArrowUp':
          hardDrop();
          break;
        case ' ':
          rotatePiece();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentPiece, movePlayer, drop, hardDrop, rotatePiece]);

  // Render the game board with the current piece
  const gameBoard = board.map((row, y) => [...row]);
  if (currentPiece) {
    const piece = TETROMINOES[currentPiece];
    piece.shape.forEach((row, pieceY) => {
      row.forEach((cell, pieceX) => {
        if (cell && position.y + pieceY >= 0) {
          const boardY = position.y + pieceY;
          const boardX = position.x + pieceX;
          if (boardY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
            gameBoard[boardY][boardX] = cell ? currentPiece : null;
          }
        }
      });
    });
  }

  return (
    <div className="inline-grid gap-0 bg-tetris-bg p-2 rounded-lg">
      {gameBoard.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <Cell key={`${y}-${x}`} type={cell ? `tetris-${cell.toLowerCase()}` : null} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;