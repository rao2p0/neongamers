import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SudokuCellProps {
  value: string;
  isInitial: boolean;
  isSelected: boolean;
  isValid: boolean;
  onSelect: () => void;
  onChange: (value: string) => void;
}

const SudokuCell = ({
  value,
  isInitial,
  isSelected,
  isValid,
  onSelect,
  onChange,
}: SudokuCellProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(-1);
    if (newValue === '' || /^[1-9]$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <Input
      type="text"
      value={value || ''}
      onChange={handleChange}
      onClick={onSelect}
      readOnly={isInitial}
      className={cn(
        "w-10 h-10 p-0 text-center text-lg font-bold border-2",
        isInitial ? "bg-gray-100 text-gray-900" : "bg-white",
        isSelected ? "border-purple-500" : "border-gray-300",
        !isValid && value ? "text-red-500" : "text-gray-900",
        "focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      )}
      maxLength={1}
    />
  );
};

export default SudokuCell;