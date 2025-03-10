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
const INITIAL_HOVER_DURATION = 1500; // 1.5 seconds of hovering at start

interface Obstacle {
  x: number;
  height: number;
}

export interface GameState {
  planeY: number;
  rotation: number;
  obstacles: Obstacle[];
  score: number;
  isPlaying: boolean;
  jump: () => void;
  startGame: () => void;
}

export const useGameState = (): GameState => {
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

    const timeSinceStart = Date.now() - (gameStartTimeRef.current || 0);

    // Update plane position - only apply gravity after initial hover period
    setPlaneY((prevY) => {
      if (timeSinceStart < INITIAL_HOVER_DURATION) {
        return GAME_HEIGHT / 2; // Keep plane steady during initial period
      }
      
      const newY = prevY + planeVelocity;
      if (newY > GAME_HEIGHT - PLANE_SIZE || newY < 0) {
        setIsPlaying(false);
        toast.error(`Game Over! Final Score: ${score}`);
        return prevY;
      }
      return newY;
    });

    // Only apply gravity after initial hover period
    if (timeSinceStart >= INITIAL_HOVER_DURATION) {
      setPlaneVelocity((prev) => prev + GRAVITY);
      setRotation(planeVelocity * 2);
    } else {
      setPlaneVelocity(0);
      setRotation(0);
    }

    // Update obstacles
    setObstacles((prevObstacles) => {
      // Don't spawn obstacles during immunity period
      if (prevObstacles.length === 0 && timeSinceStart < IMMUNITY_DURATION) {
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
        (prevObstacles.length === 0 && timeSinceStart >= IMMUNITY_DURATION) ||
        (prevObstacles.length > 0 && prevObstacles[prevObstacles.length - 1].x < GAME_WIDTH - 300)
      ) {
        const height = Math.random() * (GAME_HEIGHT - OBSTACLE_GAP - 100) + 50;
        newObstacles.push({ x: GAME_WIDTH, height });
      }

      return newObstacles;
    });

    // Collision detection (only after immunity period)
    if (timeSinceStart >= IMMUNITY_DURATION) {
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