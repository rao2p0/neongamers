import { cn } from "@/lib/utils";

interface CellProps {
  type: string | null;
}

const Cell = ({ type }: CellProps) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'tetris-i':
        return 'bg-cyan-500';
      case 'tetris-o':
        return 'bg-yellow-500';
      case 'tetris-t':
        return 'bg-purple-500';
      case 'tetris-s':
        return 'bg-green-500';
      case 'tetris-z':
        return 'bg-red-500';
      case 'tetris-j':
        return 'bg-blue-500';
      case 'tetris-l':
        return 'bg-orange-500';
      default:
        return 'bg-gray-900';
    }
  };

  return (
    <div
      className={cn(
        "w-6 h-6 border border-gray-700",
        type ? getBackgroundColor() : "bg-gray-900"
      )}
    />
  );
};

export default Cell;