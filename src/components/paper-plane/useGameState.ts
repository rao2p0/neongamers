import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PLANE_SIZE = 30;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 200;
const IMMUNITY_DURATION = 2000; // 2 seconds immunity at start

interface Obstacle {
  x: number;
  height: number;
}

export const useGameState = () => {
  const [planeY, setPlaneY] = useState(GAME_HEIGHT / 2);
  const [planeVelocity, setPlaneVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [rotation, setRotation] = useState(0);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const gameStartTimeRef = useRef<number>();

  const jump = useCallback(() => {
    if (!isPlaying) return;
    setPlaneVelocity(JUMP_FORCE);
  }, [isPlaying]);

  const startGame = useCallback(() => {
    setPlaneY(GAME_HEIGHT / 2);
    setPlaneVelocity(0);
    setObstacles([]);
    setScore(0);
    setRotation(0);
    setIsPlaying(true);
    gameStartTimeRef.current = Date.now();
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Update plane position
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

    // Update obstacles
    setObstacles((prevObstacles) => {
      // Don't spawn obstacles during the first 2 seconds
      if (prevObstacles.length === 0 && Date.now() - (gameStartTimeRef.current || 0) < IMMUNITY_DURATION) {
        return [];
      }

      const newObstacles = prevObstacles
        .map((obstacle) => ({
          ...obstacle,
          x: obstacle.x - 3,
        }))
        .filter((obstacle) => obstacle.x > -OBSTACLE_WIDTH);

      // Only add new obstacle if there's none or the last one is far enough
      if (
        (prevObstacles.length === 0 && Date.now() - (gameStartTimeRef.current || 0) >= IMMUNITY_DURATION) ||
        (prevObstacles.length > 0 && prevObstacles[prevObstacles.length - 1].x < GAME_WIDTH - 300)
      ) {
        const height = Math.random() * (GAME_HEIGHT - OBSTACLE_GAP - 100) + 50; // Ensure some minimum space at top
        newObstacles.push({ x: GAME_WIDTH, height });
      }

      return newObstacles;
    });

    // Collision detection (only after immunity period)
    if (Date.now() - (gameStartTimeRef.current || 0) >= IMMUNITY_DURATION) {
      obstacles.forEach((obstacle) => {
        if (!isPlaying) return;

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

        // Score point when passing obstacle
        if (obstacle.x + OBSTACLE_WIDTH < 100 && obstacle.x + OBSTACLE_WIDTH > 97) {
          setScore((prev) => prev + 1);
        }
      });
    }

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isPlaying, obstacles, planeVelocity, planeY, score]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, gameLoop]);

  return {
    planeY,
    rotation,
    obstacles,
    score,
    isPlaying,
    jump,
    startGame,
  };
};