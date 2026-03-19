import { Search as SearchIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search articles..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none"
      />
    </div>
  );
}
