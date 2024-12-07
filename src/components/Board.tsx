import { useEffect, useState } from "react";
import Cell from "./Cell";
import { BOARD_HEIGHT, BOARD_WIDTH, BoardType, createEmptyBoard } from "@/utils/tetris";

const Board = () => {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());

  return (
    <div className="inline-grid gap-0 bg-tetris-bg p-2 rounded-lg">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <Cell key={`${y}-${x}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;