import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PlayerSelectionProps {
  playerSymbol: "X" | "O";
  onSymbolChange: (value: "X" | "O") => void;
  onStartGame: () => void;
}

const PlayerSelection = ({ playerSymbol, onSymbolChange, onStartGame }: PlayerSelectionProps) => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
      <h2 className="text-white text-xl mb-4">Choose your symbol:</h2>
      <RadioGroup
        defaultValue={playerSymbol}
        onValueChange={(value) => onSymbolChange(value as "X" | "O")}
        className="flex gap-4 mb-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="X" id="X" className="border-white text-white" />
          <Label htmlFor="X" className="text-white">Play as X</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="O" id="O" className="border-white text-white" />
          <Label htmlFor="O" className="text-white">Play as O</Label>
        </div>
      </RadioGroup>
      <Button 
        onClick={onStartGame}
        className="bg-purple-600 hover:bg-purple-700 w-full"
      >
        Start Game
      </Button>
    </div>
  );
};

export default PlayerSelection;