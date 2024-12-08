import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Breakout = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Breakout</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
            >
              New Game
            </Button>
          </div>

          <div className="w-[800px] h-[600px] bg-black relative">
            {/* Game canvas will be added here */}
          </div>
        </div>

        <div className="text-white text-sm text-center">
          Use left and right arrow keys to move the paddle<br/>
          Break all the blocks to win!
        </div>
      </div>
    </div>
  );
};

export default Breakout;