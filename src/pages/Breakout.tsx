import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback } from "react";
import { Block, drawBlocks, initializeBlocks, checkBlockCollisions } from "@/components/breakout/Block";
import { BallState, drawBall, updateBall } from "@/components/breakout/Ball";
import { PaddleState, drawPaddle, updatePaddlePosition } from "@/components/breakout/Paddle";

const GAME_CONFIG = {
  paddleWidth: 100,
  paddleHeight: 20,
  ballRadius: 8,
  blockRows: 5,
  blockColumns: 8,
  blockPadding: 10,
  blockWidth: 80,
  blockHeight: 20,
  paddleSpeed: 8,
  initialBallSpeed: 6
};

const Breakout = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [gameStarted, setGameStarted] = useState(false);
  
  const [paddle, setPaddle] = useState<PaddleState>({ x: 350, y: 550 });
  const [ball, setBall] = useState<BallState>({ 
    x: 400, 
    y: 530, 
    dx: GAME_CONFIG.initialBallSpeed, 
    dy: -GAME_CONFIG.initialBallSpeed 
  });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [keys, setKeys] = useState({ left: false, right: false });

  const startNewGame = useCallback(() => {
    setPaddle({ x: 350, y: 550 });
    setBall({ 
      x: 400, 
      y: 530, 
      dx: GAME_CONFIG.initialBallSpeed, 
      dy: -GAME_CONFIG.initialBallSpeed 
    });
    setBlocks(initializeBlocks(
      GAME_CONFIG.blockRows,
      GAME_CONFIG.blockColumns,
      GAME_CONFIG.blockWidth,
      GAME_CONFIG.blockHeight,
      GAME_CONFIG.blockPadding
    ));
    setGameStarted(true);
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !gameStarted) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update paddle position based on key state
    if (keys.left) {
      setPaddle(prev => ({ 
        ...prev, 
        x: updatePaddlePosition(prev.x, -GAME_CONFIG.paddleSpeed, canvas.width, GAME_CONFIG.paddleWidth)
      }));
    }
    if (keys.right) {
      setPaddle(prev => ({ 
        ...prev, 
        x: updatePaddlePosition(prev.x, GAME_CONFIG.paddleSpeed, canvas.width, GAME_CONFIG.paddleWidth)
      }));
    }

    // Update ball position and check collisions
    setBall(prevBall => {
      const newBall = updateBall(
        prevBall,
        canvas,
        paddle.x,
        GAME_CONFIG.paddleWidth,
        paddle.y,
        GAME_CONFIG.ballRadius
      );

      const { blocks: updatedBlocks, collision } = checkBlockCollisions(newBall, blocks);
      if (collision) {
        setBlocks(updatedBlocks);
        newBall.dy *= -1;
      }

      // Game over condition
      if (newBall.y + GAME_CONFIG.ballRadius > canvas.height) {
        setGameStarted(false);
        return prevBall;
      }

      return newBall;
    });

    // Draw game objects
    drawPaddle(ctx, paddle, GAME_CONFIG.paddleWidth, GAME_CONFIG.paddleHeight);
    drawBall(ctx, ball, GAME_CONFIG.ballRadius);
    drawBlocks(ctx, blocks);

    // Request next frame
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, paddle, ball, blocks, keys]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      if (e.key === 'ArrowLeft') setKeys(prev => ({ ...prev, left: true }));
      if (e.key === 'ArrowRight') setKeys(prev => ({ ...prev, right: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setKeys(prev => ({ ...prev, left: false }));
      if (e.key === 'ArrowRight') setKeys(prev => ({ ...prev, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameStarted, gameLoop]);

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
              onClick={startNewGame}
            >
              {gameStarted ? "Restart Game" : "New Game"}
            </Button>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="bg-black"
          />
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