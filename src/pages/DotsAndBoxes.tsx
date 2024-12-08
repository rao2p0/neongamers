import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameBoard from "@/components/dots-and-boxes/GameBoard";
import { useDotsAndBoxes } from "@/hooks/useDotsAndBoxes";

const DotsAndBoxes = () => {
  const {
    lines,
    boxes,
    currentPlayer,
    scores,
    gameOver,
    makeMove,
    resetGame,
  } = useDotsAndBoxes(4); // 4x4 grid

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Dots and Boxes</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-8">
              <div className="bg-gray-700 px-4 py-2 rounded">
                <p className="text-purple-400">You: {scores.player}</p>
              </div>
              <div className="bg-gray-700 px-4 py-2 rounded">
                <p className="text-red-400">Computer: {scores.computer}</p>
              </div>
            </div>
            <Button 
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-700"
            >
              New Game
            </Button>
          </div>

          <div className="flex justify-center mb-6">
            <p className="text-white">
              {gameOver ? "Game Over!" : `Current Turn: ${currentPlayer === "player" ? "Your" : "Computer's"}`}
            </p>
          </div>

          <GameBoard
            size={4}
            onLineClick={makeMove}
            lines={lines}
            boxes={boxes}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="text-white text-sm text-center">
          Connect dots to create boxes<br/>
          Complete a box to get a point and an extra turn
        </div>
      </div>
    </div>
  );
};

export default DotsAndBoxes;