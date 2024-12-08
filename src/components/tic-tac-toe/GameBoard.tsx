interface GameBoardProps {
  board: (string | null)[];
  playerSymbol: string;
  onCellClick: (index: number) => void;
}

const GameBoard = ({ board, playerSymbol, onCellClick }: GameBoardProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {board.map((square, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          className={`w-20 h-20 flex items-center justify-center text-4xl font-bold 
            ${square ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'} 
            ${square === playerSymbol ? 'text-purple-400' : 'text-white'}
            rounded transition-colors`}
        >
          {square}
        </button>
      ))}
    </div>
  );
};

export default GameBoard;