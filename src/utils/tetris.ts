export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type CellType = TetrominoType | null;
export type BoardType = CellType[][];

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
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