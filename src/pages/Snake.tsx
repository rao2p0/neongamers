import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const Snake = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
    setFood(newFood);
  }, []);

  const checkCollision = useCallback((head: Position) => {
    // Check wall collision
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) return true;
    
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
    setSnake([{ x: 10, y: 10 }]);
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

        <div className="relative bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-20 gap-0">
            {Array.from({ length: 400 }).map((_, index) => {
              const x = Math.floor(index % 20);
              const y = Math.floor(index / 20);
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`w-4 h-4 border border-gray-700 ${
                    isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-gray-900"
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white">Score: {score}</p>
          </div>
          <Button
            onClick={() => (isPlaying ? setIsPlaying(false) : startGame())}
            className="w-32"
          >
            {isPlaying ? "Pause" : "Start"}
          </Button>
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