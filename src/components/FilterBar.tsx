import { motion } from "framer-motion";

interface Props {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
}

export default function FilterBar({ tags, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => selected.length > 0 && onToggle("__clear__")}
        className={`rounded-full border px-4 py-1.5 font-mono text-sm transition-colors ${
          selected.length === 0
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:border-primary"
        }`}
      >
        All
      </button>
      {tags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`relative rounded-full border px-4 py-1.5 font-mono text-sm transition-colors ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
