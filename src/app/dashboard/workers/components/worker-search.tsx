import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";

interface WorkerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function WorkerSearch({
  searchTerm,
  onSearchChange,
}: WorkerSearchProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative max-w-sm flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          placeholder="Search workers..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          className="pl-10"
        />
      </div>
    </div>
  );
}
