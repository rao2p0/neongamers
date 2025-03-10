import { useEffect } from "react";
import Plane from "./Plane";
import Obstacles from "./Obstacles";
import { GameState } from "./useGameState";

interface GameAreaProps {
  gameState: GameState;
}

const GameArea = ({ gameState }: GameAreaProps) => {
  const { planeY, rotation, obstacles, jump } = gameState;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  return (
    <div 
      className="relative bg-gradient-to-b from-blue-900 to-purple-900 w-[800px] h-[500px] overflow-hidden cursor-pointer"
      onClick={jump}
    >
      <Plane y={planeY} rotation={rotation} />
      <Obstacles obstacles={obstacles} />
    </div>
  );
};

export default GameArea;