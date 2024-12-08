import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PLANE_SIZE = 30;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 200;

interface Obstacle {
  x: number;
  height: number;
}

const PaperPlane = () => {
  const [planeY, setPlaneY] = useState(GAME_HEIGHT / 2);
  const [planeVelocity, setPlaneVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [rotation, setRotation] = useState(0);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const startGame = () => {
    setPlaneY(GAME_HEIGHT / 2);
    setPlaneVelocity(0);
    setObstacles([]);
    setScore(0);
    setRotation(0);
    setIsPlaying(true);
  };

  const jump = () => {
    if (!isPlaying) return;
    setPlaneVelocity(JUMP_FORCE);
  };

  const gameLoop = (timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    setPlaneY((prevY) => {
      const newY = prevY + planeVelocity;
      if (newY > GAME_HEIGHT - PLANE_SIZE || newY < 0) {
        setIsPlaying(false);
        toast.error(`Game Over! Final Score: ${score}`);
        return prevY;
      }
      return newY;
    });

    setPlaneVelocity((prev) => prev + GRAVITY);
    setRotation(planeVelocity * 2);

    setObstacles((prevObstacles) => {
      const newObstacles = prevObstacles
        .map((obstacle) => ({
          ...obstacle,
          x: obstacle.x - 3,
        }))
        .filter((obstacle) => obstacle.x > -OBSTACLE_WIDTH);

      if (prevObstacles.length === 0 || prevObstacles[prevObstacles.length - 1].x < GAME_WIDTH - 300) {
        const height = Math.random() * (GAME_HEIGHT - OBSTACLE_GAP);
        newObstacles.push({ x: GAME_WIDTH, height });
      }

      return newObstacles;
    });

    // Collision detection
    obstacles.forEach((obstacle) => {
      const planeRight = 100 + PLANE_SIZE;
      const planeLeft = 100;
      const planeTop = planeY;
      const planeBottom = planeY + PLANE_SIZE;

      if (
        planeRight > obstacle.x &&
        planeLeft < obstacle.x + OBSTACLE_WIDTH &&
        (planeTop < obstacle.height || planeBottom > obstacle.height + OBSTACLE_GAP)
      ) {
        setIsPlaying(false);
        toast.error(`Game Over! Final Score: ${score}`);
      }

      if (obstacle.x + OBSTACLE_WIDTH < 100 && obstacle.x + OBSTACLE_WIDTH > 97) {
        setScore((prev) => prev + 1);
      }
    });

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

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

        <div 
          className="relative bg-gradient-to-b from-blue-900 to-purple-900 w-[800px] h-[500px] overflow-hidden cursor-pointer"
          onClick={jump}
        >
          {/* Paper Plane */}
          <div
            className="absolute w-[30px] h-[30px] transition-transform"
            style={{
              left: "100px",
              top: `${planeY}px`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <div className="w-full h-full bg-white clip-path-triangle" />
          </div>

          {/* Obstacles */}
          {obstacles.map((obstacle, index) => (
            <div key={index}>
              {/* Top obstacle */}
              <div
                className="absolute bg-gradient-to-b from-red-500 to-orange-500"
                style={{
                  left: `${obstacle.x}px`,
                  top: 0,
                  width: OBSTACLE_WIDTH,
                  height: obstacle.height,
                }}
              />
              {/* Bottom obstacle */}
              <div
                className="absolute bg-gradient-to-b from-red-500 to-orange-500"
                style={{
                  left: `${obstacle.x}px`,
                  top: obstacle.height + OBSTACLE_GAP,
                  width: OBSTACLE_WIDTH,
                  height: GAME_HEIGHT - (obstacle.height + OBSTACLE_GAP),
                }}
              />
            </div>
          ))}

          {/* Rainbow trail effect */}
          <div
            className="absolute w-[100px] h-[2px] opacity-50"
            style={{
              left: "30px",
              top: `${planeY + PLANE_SIZE / 2}px`,
              background: "linear-gradient(to left, red, orange, yellow, green, blue, indigo, violet)",
            }}
          />
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
          Press spacebar or click to make the plane fly up<br/>
          Avoid the obstacles and score points!
        </div>
      </div>
    </div>
  );
};

export default PaperPlane;