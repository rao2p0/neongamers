import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

// Extended word list for more variety
const words = [
  "speed", "racing", "turbo", "nitro", "drift", "gear", "accelerate",
  "brake", "engine", "track", "finish", "victory", "champion", "boost",
  "velocity", "momentum", "throttle", "steering", "dashboard", "circuit",
  "pilot", "driver", "formula", "pitstop", "mechanic", "garage", "wheel",
  "pedal", "clutch", "transmission", "aerodynamic", "suspension", "fuel",
  "speedway", "racetrack", "competition", "qualifying", "performance", "lap"
];

const TypingRacer = () => {
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [carPosition, setCarPosition] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const getRandomWord = useCallback(() => {
    // Filter out already used words
    const availableWords = words.filter(word => !usedWords.has(word));
    
    // If all words have been used, return a random word from the full list
    if (availableWords.length === 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      return words[randomIndex];
    }

    // Get a random word from available words
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    
    // Add the word to used words
    setUsedWords(prev => new Set([...prev, selectedWord]));
    
    return selectedWord;
  }, [usedWords]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setCarPosition(0);
    setUsedWords(new Set()); // Reset used words at game start
    const firstWord = getRandomWord();
    setCurrentWord(firstWord);
    setUserInput("");
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      toast({
        title: "Game Over!",
        description: `Your final score: ${score} words`,
      });
    }
  }, [timeLeft, isPlaying, score, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying) return;
    
    const value = e.target.value;
    setUserInput(value);

    if (value === currentWord) {
      setScore((prev) => prev + 1);
      setCurrentWord(getRandomWord());
      setUserInput("");
      setCarPosition((prev) => Math.min(prev + 20, 80));
      
      toast({
        title: "Correct!",
        description: "+1 point",
        duration: 1000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-white hover:text-gray-300">
            ← Back to Games
          </Link>
          <h1 className="text-4xl font-bold text-white">Typing Racer</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="mb-8">
            <div className="bg-gray-700 p-4 rounded-lg relative h-20 mb-4">
              <div
                className="absolute bottom-4 left-0 w-12 h-8 transition-all duration-300"
                style={{ left: `${carPosition}%` }}
              >
                🏎️
              </div>
              <div className="absolute right-4 top-4">🏁</div>
            </div>

            <div className="flex justify-between text-white text-sm mb-4">
              <span>Score: {score}</span>
              <span>Time: {timeLeft}s</span>
            </div>
          </div>

          {!isPlaying ? (
            <div className="text-center">
              <Button
                onClick={startGame}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-xl"
              >
                Start Game
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-3xl font-bold mb-4 text-purple-400">
                {currentWord}
              </div>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type the word here..."
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="text-white text-sm text-center">
          Type the words as quickly as you can to move your car!<br/>
          Race against time and reach the finish line.
        </div>
      </div>
    </div>
  );
};

export default TypingRacer;