import { Button } from "@/components/ui/button";
import Board from "@/components/Board";
import NextPiece from "@/components/NextPiece";
import { useState } from "react";
import { TetrominoType, randomTetromino } from "@/utils/tetris";

const Index = () => {
  const [score, setScore] = useState(0);
  const [nextPiece, setNextPiece] = useState<TetrominoType>(randomTetromino());
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setNextPiece(randomTetromino());
  };

  return (
    <div className="min-h-screen bg-tetris-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-white mb-4">Tetris</h1>
        <div className="flex gap-8">
          <Board />
          <div className="flex flex-col gap-4">
            <NextPiece piece={nextPiece} />
            <div className="bg-tetris-bg p-4 rounded-lg">
              <h2 className="text-white mb-2">Score</h2>
              <p className="text-2xl font-bold text-white">{score}</p>
            </div>
            <Button
              onClick={() => (isPlaying ? setIsPlaying(false) : startGame())}
              className="w-full"
            >
              {isPlaying ? "Pause" : "Start"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;