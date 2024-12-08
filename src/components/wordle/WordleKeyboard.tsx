interface WordleKeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: { [key: string]: 'correct' | 'present' | 'absent' | 'unused' };
}

const WordleKeyboard = ({ onKeyPress, letterStates }: WordleKeyboardProps) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  const getKeyBackground = (key: string) => {
    if (key === 'ENTER' || key === 'BACKSPACE') return 'bg-gray-600';
    const state = letterStates[key];
    switch (state) {
      case 'correct':
        return 'bg-green-600';
      case 'present':
        return 'bg-yellow-500';
      case 'absent':
        return 'bg-gray-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`${getKeyBackground(key)} 
                ${key.length > 1 ? 'px-4' : 'w-10'} 
                h-14 
                text-white 
                font-bold 
                rounded 
                hover:opacity-90 
                transition-opacity`}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordleKeyboard;