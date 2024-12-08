interface WordleGridProps {
  currentGuess: string;
  guesses: string[];
  targetWord: string;
  maxAttempts: number;
}

const WordleGrid = ({ currentGuess, guesses, targetWord, maxAttempts }: WordleGridProps) => {
  const getBackgroundColor = (letter: string, index: number, isCompleted: boolean) => {
    if (!isCompleted) return "bg-gray-700";
    
    const upperLetter = letter.toUpperCase();
    const upperTarget = targetWord.toUpperCase();
    
    if (upperTarget[index] === upperLetter) {
      return "bg-green-600";
    }
    
    // Count remaining occurrences of the letter
    const letterCount = upperTarget.split('').reduce((count, l) => {
      return l === upperLetter ? count + 1 : count;
    }, 0);
    
    // Count correct positions before this index
    const correctBefore = guesses[guesses.length - 1]
      .slice(0, index)
      .split('')
      .reduce((count, l, i) => {
        return l === upperLetter && upperTarget[i] === l ? count + 1 : count;
      }, 0);
    
    // Count yellow positions before this index
    const yellowBefore = guesses[guesses.length - 1]
      .slice(0, index)
      .split('')
      .reduce((count, l, i) => {
        return l === upperLetter && upperTarget[i] !== l && upperTarget.includes(l) ? count + 1 : count;
      }, 0);
    
    if (upperTarget.includes(upperLetter) && (correctBefore + yellowBefore) < letterCount) {
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
          {letter.toUpperCase()}
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