import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  visible: boolean;
}

const Breakout = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game state
  const paddleWidth = 100;
  const paddleHeight = 20;
  const ballRadius = 8;
  const blockRows = 5;
  const blockColumns = 8;
  const blockPadding = 10;
  const blockWidth = 80;
  const blockHeight = 20;
  
  // Game objects
  const [paddle, setPaddle] = useState({ x: 350, y: 550 });
  const [ball, setBall] = useState({ x: 400, y: 530, dx: 4, dy: -4 });
  const [blocks, setBlocks] = useState<Block[]>([]);
  
  // Initialize blocks
  const initializeBlocks = () => {
    const newBlocks: Block[] = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    
    for (let row = 0; row < blockRows; row++) {
      for (let col = 0; col < blockColumns; col++) {
        newBlocks.push({
          x: col * (blockWidth + blockPadding) + 100,
          y: row * (blockHeight + blockPadding) + 50,
          width: blockWidth,
          height: blockHeight,
          color: colors[row],
          visible: true
        });
      }
    }
    setBlocks(newBlocks);
  };

  // Start new game
  const startNewGame = () => {
    setPaddle({ x: 350, y: 550 });
    setBall({ x: 400, y: 530, dx: 4, dy: -4 });
    initializeBlocks();
    setGameStarted(true);
  };

  // Handle paddle movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      if (e.key === 'ArrowLeft' && paddle.x > 0) {
        setPaddle(prev => ({ ...prev, x: Math.max(0, prev.x - 20) }));
      }
      if (e.key === 'ArrowRight' && paddle.x < 800 - paddleWidth) {
        setPaddle(prev => ({ ...prev, x: Math.min(800 - paddleWidth, prev.x + 20) }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, paddle.x]);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const gameLoop = setInterval(() => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddle
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.closePath();

      // Draw blocks
      blocks.forEach(block => {
        if (block.visible) {
          ctx.fillStyle = block.color;
          ctx.fillRect(block.x, block.y, block.width, block.height);
        }
      });

      // Ball movement and collision detection
      setBall(prevBall => {
        let newBall = { ...prevBall };
        
        // Wall collisions
        if (newBall.x + ballRadius > canvas.width || newBall.x - ballRadius < 0) {
          newBall.dx *= -1;
        }
        if (newBall.y - ballRadius < 0) {
          newBall.dy *= -1;
        }
        
        // Paddle collision
        if (
          newBall.y + ballRadius > paddle.y &&
          newBall.x > paddle.x &&
          newBall.x < paddle.x + paddleWidth
        ) {
          newBall.dy = -Math.abs(newBall.dy);
        }

        // Block collisions
        blocks.forEach((block, index) => {
          if (block.visible &&
              newBall.x > block.x &&
              newBall.x < block.x + block.width &&
              newBall.y > block.y &&
              newBall.y < block.y + block.height
          ) {
            setBlocks(prevBlocks => {
              const newBlocks = [...prevBlocks];
              newBlocks[index].visible = false;
              return newBlocks;
            });
            newBall.dy *= -1;
          }
        });

        // Game over condition
        if (newBall.y + ballRadius > canvas.height) {
          setGameStarted(false);
          return prevBall;
        }

        // Update ball position
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;
        
        return newBall;
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameStarted, paddle.x, paddle.y, blocks]);

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