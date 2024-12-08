import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

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

export const useGameState = () => {
  const [planeY, setPlaneY] = useState(GAME_HEIGHT / 2);
  const [planeVelocity, setPlaneVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [rotation, setRotation] = useState(0);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

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
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
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