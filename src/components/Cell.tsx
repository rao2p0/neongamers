import { cn } from "@/lib/utils";

interface CellProps {
  type: string | null;
}

const Cell = ({ type }: CellProps) => {
  return (
    <div
      className={cn(
        "w-6 h-6 border border-gray-700",
        type ? `bg-${type}` : "bg-transparent"
      )}
    />
  );
};

export default Cell;