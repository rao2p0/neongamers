import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GameArea from "@/components/paper-plane/GameArea";
import { useGameState } from "@/components/paper-plane/useGameState";

const PaperPlane = () => {
  const gameState = useGameState();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Paper Plane</h1>
          <div className="w-20"></div>
        </div>

        <GameArea gameState={gameState} />

        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white">Score: {gameState.score}</p>
          </div>
          {!gameState.isPlaying && (
            <Button
              onClick={gameState.startGame}
              className="w-32 bg-purple-600 hover:bg-purple-700"
            >
              Start Game
            </Button>
          )}
        </div>

        <div className="text-white text-sm text-center">
          Press spacebar or click to make the plane fly up<br/>
          Avoid the obstacles and score points!
        </div>
      </div>
    </div>
  );
};

export default PaperPlane;