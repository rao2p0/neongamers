export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type CellType = TetrominoType | null;
export type BoardType = CellType[][];
export type Position = { x: number; y: number };

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'tetris-cyan'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'tetris-yellow'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'tetris-purple'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'tetris-green'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'tetris-red'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'tetris-blue'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'tetris-orange'
  }
};

export const createEmptyBoard = (): BoardType => 
  Array.from({ length: BOARD_HEIGHT }, () => 
    Array.from({ length: BOARD_WIDTH }, () => null)
  );

export const randomTetromino = (): TetrominoType => {
  const pieces = Object.keys(TETROMINOES) as TetrominoType[];
  return pieces[Math.floor(Math.random() * pieces.length)];
};

export const rotateMatrix = (matrix: number[][]): number[][] => {
  const N = matrix.length;
  const ret: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
  
  for (let i = 0; i < N; ++i) {
    for (let j = 0; j < N; ++j) {
      ret[i][j] = matrix[N - 1 - j][i];
    }
  }
  
  return ret;
};

export const isValidMove = (board: BoardType, piece: TetrominoType, position: Position): boolean => {
  const tetromino = TETROMINOES[piece];
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        if (
          newX < 0 || 
          newX >= BOARD_WIDTH || 
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX] !== null)
        ) {
          return false;
        }
      }
    }
  }
  
  return true;
};

export const mergePieceToBoard = (board: BoardType, piece: TetrominoType, position: Position): BoardType => {
  const newBoard = board.map(row => [...row]);
  const tetromino = TETROMINOES[piece];
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newY = position.y + y;
        if (newY >= 0) {
          newBoard[newY][position.x + x] = piece;
        }
      }
    }
  }
  
  return newBoard;
};

export const clearLines = (board: BoardType): { newBoard: BoardType; linesCleared: number } => {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    const isLineFull = row.every(cell => cell !== null);
    if (isLineFull) linesCleared++;
    return !isLineFull;
  });
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { newBoard, linesCleared };
};