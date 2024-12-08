import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTicTacToe } from "@/hooks/useTicTacToe";
import PlayerSelection from "@/components/tic-tac-toe/PlayerSelection";
import GameBoard from "@/components/tic-tac-toe/GameBoard";

const TicTacToe = () => {
  const {
    board,
    playerSymbol,
    gameStarted,
    gameOver,
    setPlayerSymbol,
    handlePlayerMove,
    startGame,
    resetGame,
  } = useTicTacToe();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Tic Tac Toe</h1>
          <div className="w-20"></div>
        </div>

        {!gameStarted ? (
          <PlayerSelection
            playerSymbol={playerSymbol}
            onSymbolChange={setPlayerSymbol}
            onStartGame={startGame}
          />
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-gray-700 px-4 py-2 rounded">
                <p className="text-white">Playing as: {playerSymbol}</p>
              </div>
              <Button 
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700"
              >
                New Game
              </Button>
            </div>

            <GameBoard
              board={board}
              playerSymbol={playerSymbol}
              onCellClick={handlePlayerMove}
            />
          </div>
        )}

        <div className="text-white text-sm text-center">
          {gameStarted ? (
            "Click on any square to make your move"
          ) : (
            "Select your symbol to start the game"
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;