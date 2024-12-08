interface WordleGridProps {
  currentGuess: string;
  guesses: string[];
  targetWord: string;
  maxAttempts: number;
}

const WordleGrid = ({ currentGuess, guesses, targetWord, maxAttempts }: WordleGridProps) => {
  const getBackgroundColor = (letter: string, index: number, isCompleted: boolean) => {
    if (!isCompleted) return "bg-gray-700";
    
    if (targetWord[index] === letter) {
      return "bg-green-600";
    }
    if (targetWord.includes(letter)) {
      return "bg-yellow-500";
    }
    return "bg-gray-600";
  };

  const renderRow = (guess: string, isCurrentGuess: boolean = false) => {
    const tiles = [];
    for (let i = 0; i < 5; i++) {
      const letter = guess[i] || "";
      const isCompleted = !isCurrentGuess && guess.length === 5;
      
      tiles.push(
        <div
          key={i}
          className={`w-14 h-14 border-2 border-gray-600 flex items-center justify-center text-2xl font-bold text-white m-1 
            ${getBackgroundColor(letter, i, isCompleted)}
            ${letter ? 'scale-100' : 'scale-95'}
            transition-all duration-200`}
        >
          {letter}
        </div>
      );
    }
    return (
      <div className="flex">
        {tiles}
      </div>
    );
  };

  const rows = [];
  for (let i = 0; i < maxAttempts; i++) {
    if (i < guesses.length) {
      rows.push(
        <div key={i} className="mb-2">
          {renderRow(guesses[i])}
        </div>
      );
    } else if (i === guesses.length) {
      rows.push(
        <div key={i} className="mb-2">
          {renderRow(currentGuess, true)}
        </div>
      );
    } else {
      rows.push(
        <div key={i} className="mb-2">
          {renderRow("")}
        </div>
      );
    }
  }

  return <div className="flex flex-col items-center">{rows}</div>;
};

export default WordleGrid;