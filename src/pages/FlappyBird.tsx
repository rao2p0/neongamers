import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const GRAVITY = 0.8;
const JUMP_FORCE = -10;
const PIPE_SPEED = 3;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const BIRD_SIZE = 30;

const FlappyBird = () => {
  const [birdPosition, setBirdPosition] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; height: number }[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const jump = useCallback(() => {
    if (!isPlaying) return;
    setBirdVelocity(JUMP_FORCE);
  }, [isPlaying]);

  const startGame = () => {
    setBirdPosition(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setIsPlaying(true);
  };

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

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      setBirdPosition((prev) => {
        const newPosition = prev + birdVelocity;
        if (newPosition > 500 || newPosition < 0) {
          setIsPlaying(false);
          toast({
            title: "Game Over!",
            description: `Final Score: ${score}`,
            variant: "destructive",
          });
          return prev;
        }
        return newPosition;
      });

      setBirdVelocity((prev) => prev + GRAVITY);

      setPipes((prevPipes) => {
        const newPipes = prevPipes
          .map((pipe) => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED,
          }))
          .filter((pipe) => pipe.x > -PIPE_WIDTH);

        if (prevPipes.length === 0 || prevPipes[prevPipes.length - 1].x < 300) {
          const height = Math.random() * (400 - PIPE_GAP);
          newPipes.push({ x: 800, height });
        }

        return newPipes;
      });

      // Collision detection
      pipes.forEach((pipe) => {
        const birdRight = 100 + BIRD_SIZE;
        const birdLeft = 100;
        const birdTop = birdPosition;
        const birdBottom = birdPosition + BIRD_SIZE;

        if (
          birdRight > pipe.x &&
          birdLeft < pipe.x + PIPE_WIDTH &&
          (birdTop < pipe.height || birdBottom > pipe.height + PIPE_GAP)
        ) {
          setIsPlaying(false);
          toast({
            title: "Game Over!",
            description: `Final Score: ${score}`,
            variant: "destructive",
          });
        }

        if (pipe.x + PIPE_WIDTH < 100 && pipe.x + PIPE_WIDTH > 97) {
          setScore((prev) => prev + 1);
        }
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [isPlaying, birdVelocity, pipes, score, toast]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Flappy Bird</h1>
          <div className="w-20"></div>
        </div>

        <div 
          className="relative bg-blue-500 w-[800px] h-[500px] overflow-hidden"
          onClick={jump}
        >
          {/* Bird */}
          <div
            className="absolute w-[30px] h-[30px] bg-yellow-400 rounded-full transition-transform"
            style={{
              left: "100px",
              top: `${birdPosition}px`,
              transform: `rotate(${birdVelocity * 2}deg)`,
            }}
          />

          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <div key={index}>
              {/* Top pipe */}
              <div
                className="absolute bg-green-500"
                style={{
                  left: `${pipe.x}px`,
                  top: 0,
                  width: PIPE_WIDTH,
                  height: pipe.height,
                }}
              />
              {/* Bottom pipe */}
              <div
                className="absolute bg-green-500"
                style={{
                  left: `${pipe.x}px`,
                  top: pipe.height + PIPE_GAP,
                  width: PIPE_WIDTH,
                  height: 500 - pipe.height - PIPE_GAP,
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white">Score: {score}</p>
          </div>
          {!isPlaying && (
            <Button
              onClick={startGame}
              className="w-32 bg-purple-600 hover:bg-purple-700"
            >
              Start Game
            </Button>
          )}
        </div>

        <div className="text-white text-sm text-center">
          Press spacebar or click to make the bird jump<br/>
          Avoid the pipes and score points!
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;