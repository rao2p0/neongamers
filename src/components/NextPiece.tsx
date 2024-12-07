import Cell from "./Cell";
import { TetrominoType, TETROMINOES } from "@/utils/tetris";

interface NextPieceProps {
  piece: TetrominoType | null;
}

const NextPiece = ({ piece }: NextPieceProps) => {
  if (!piece) return null;

  const tetromino = TETROMINOES[piece];

  return (
    <div className="bg-tetris-bg p-4 rounded-lg">
      <h2 className="text-white mb-2">Next Piece</h2>
      <div className="inline-grid gap-0">
        {tetromino.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <Cell key={`${y}-${x}`} type={cell ? tetromino.color : null} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextPiece;