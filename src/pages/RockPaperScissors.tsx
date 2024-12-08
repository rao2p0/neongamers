import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import GameCard from "@/components/rock-paper-scissors/GameCard";
import { Choice, getWinner } from "@/utils/rockPaperScissors";
import { useState } from "react";

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const handleChoice = (choice: Choice) => {
    const computerMove = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)] as Choice;
    setPlayerChoice(choice);
    setComputerChoice(computerMove);

    const result = getWinner(choice, computerMove);
    if (result === "win") {
      setScore(prev => prev + 1);
      toast({
        title: "You won! 🎉",
        description: `${choice} beats ${computerMove}`,
      });
    } else if (result === "lose") {
      toast({
        title: "You lost! 😢",
        description: `${computerMove} beats ${choice}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "It's a tie! 🤝",
        description: "Try again!",
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
          <h1 className="text-4xl font-bold text-white">Rock Paper Scissors</h1>
          <div className="w-20"></div>
        </div>

        <Card className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-white">Score: {score}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GameCard type="rock" onClick={() => handleChoice("rock")} isSelected={playerChoice === "rock"} />
            <GameCard type="paper" onClick={() => handleChoice("paper")} isSelected={playerChoice === "paper"} />
            <GameCard type="scissors" onClick={() => handleChoice("scissors")} isSelected={playerChoice === "scissors"} />
          </div>

          {playerChoice && computerChoice && (
            <div className="mt-8 text-center">
              <p className="text-xl mb-4 text-white">
                Computer chose: <span className="font-bold text-purple-400">{computerChoice}</span>
              </p>
            </div>
          )}
        </Card>

        <div className="text-white text-sm text-center">
          Choose your move to play!<br/>
          Try to beat the computer and score points.
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissors;