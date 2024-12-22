import { useState } from "react";
import { Button } from "@/components/ui/button";
import Board from "@/components/Board";
import NextPiece from "@/components/NextPiece";
import { TetrominoType, randomTetromino } from "@/utils/tetris";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const Tetris = () => {
  const [score, setScore] = useState(0);
  const [nextPiece, setNextPiece] = useState<TetrominoType>(randomTetromino());
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleGameOver = () => {
    setIsPlaying(false);
    toast({
      title: "Game Over!",
      description: `Final Score: ${score}`,
      variant: "destructive",
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-tetris-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Tetris</h1>
          <div className="w-20"></div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-tetris-bg p-4 rounded-lg">
            <h2 className="text-white mb-2">Score</h2>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          <Button
            onClick={() => (isPlaying ? setIsPlaying(false) : startGame())}
            className="w-32 text-lg font-semibold bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {isPlaying ? "Pause" : "Start"}
          </Button>
        </div>

        <div className="flex gap-8">
          <Board 
            isPlaying={isPlaying}
            onGameOver={handleGameOver}
            onScoreUpdate={setScore}
            setNextPiece={setNextPiece}
          />
          <div className="flex flex-col gap-4">
            <NextPiece piece={nextPiece} />
          </div>
        </div>

        <div className="text-white text-sm">
          Use arrow keys to play:<br/>
          ← → to move<br/>
          ↓ to drop faster<br/>
          ↑ to hard drop<br/>
          Space to rotate
        </div>
      </div>
    </div>
  );
};

export default Tetris;