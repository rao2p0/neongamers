interface GameCardProps {
  type: "rock" | "paper" | "scissors";
  onClick: () => void;
  isSelected: boolean;
}

const GameCard = ({ type, onClick, isSelected }: GameCardProps) => {
  const getGradient = () => {
    switch (type) {
      case "rock":
        return "from-blue-500 to-cyan-300";
      case "paper":
        return "from-yellow-500 to-yellow-300";
      case "scissors":
        return "from-red-500 to-pink-300";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg p-6 transition-all duration-300
        ${isSelected ? 'scale-105 ring-2 ring-white' : 'hover:scale-105'}
        bg-gradient-to-b ${getGradient()}
      `}
    >
      <div className="aspect-square relative">
        <img
          src="/lovable-uploads/fdc12c29-240c-4c9b-84e7-e77f1aea8fff.png"
          alt={type}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-center p-2 bg-black/50 backdrop-blur-sm">
        <p className="text-lg font-bold capitalize text-white">{type}</p>
      </div>
    </button>
  );
};

export default GameCard;