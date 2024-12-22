import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_WIDTH = 32;
const GRID_HEIGHT = 18;

const Snake = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: Math.floor(GRID_WIDTH/2), y: Math.floor(GRID_HEIGHT/2) }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT),
    };
    setFood(newFood);
  }, []);

  const checkCollision = useCallback((head: Position) => {
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) return true;
    
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
  }, [snake]);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    if (checkCollision(head)) {
      setIsPlaying(false);
      toast({
        title: "Game Over!",
        description: `Final Score: ${score}`,
        variant: "destructive",
      });
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 1);
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, generateFood, checkCollision, score, toast]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection(prev => prev !== "DOWN" ? "UP" : prev);
          break;
        case "ArrowDown":
          setDirection(prev => prev !== "UP" ? "DOWN" : prev);
          break;
        case "ArrowLeft":
          setDirection(prev => prev !== "RIGHT" ? "LEFT" : prev);
          break;
        case "ArrowRight":
          setDirection(prev => prev !== "LEFT" ? "RIGHT" : prev);
          break;
      }
    };

    if (isPlaying) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying]);

  useEffect(() => {
    let gameLoop: number;

    if (isPlaying) {
      gameLoop = window.setInterval(moveSnake, 150);
    }

    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [isPlaying, moveSnake]);

  const startGame = () => {
    setSnake([{ x: Math.floor(GRID_WIDTH/2), y: Math.floor(GRID_HEIGHT/2) }]);
    setDirection("RIGHT");
    setScore(0);
    generateFood();
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Snake</h1>
          <div className="w-20"></div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white">Score: {score}</p>
          </div>
          <Button
            onClick={() => (isPlaying ? setIsPlaying(false) : startGame())}
            className="w-32 text-lg font-semibold bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {isPlaying ? "Pause" : "Start"}
          </Button>
        </div>

        <div className="relative bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-32 gap-0 max-w-[960px] w-[90vw]" style={{ aspectRatio: '16/9' }}>
            {Array.from({ length: GRID_WIDTH * GRID_HEIGHT }).map((_, index) => {
              const x = Math.floor(index % GRID_WIDTH);
              const y = Math.floor(index / GRID_WIDTH);
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`w-full h-full border border-gray-700 aspect-square ${
                    isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-gray-900"
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="text-white text-sm text-center">
          Use arrow keys to control the snake<br/>
          Collect the red food to grow and score points
        </div>
      </div>
    </div>
  );
};

export default Snake;