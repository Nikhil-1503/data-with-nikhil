import { Zap, HelpCircle, Briefcase } from "lucide-react";

interface Props {
  type: "takeaway" | "usecase" | "interview";
  text: string;
}

const config = {
  takeaway: {
    icon: Zap,
    title: "Key Takeaway",
    className: "border-primary bg-primary/5",
  },
  usecase: {
    icon: Briefcase,
    title: "Real-world Use Case",
    className: "border-primary bg-primary/5",
  },
  interview: {
    icon: HelpCircle,
    title: "Interview Question",
    className: "border-accent bg-accent/5",
  },
};

export default function Callout({ type, text }: Props) {
  const { icon: Icon, title, className } = config[type];

  return (
    <div className={`my-6 rounded-lg border-l-4 p-5 ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className={type === "interview" ? "text-accent" : "text-primary"} />
        <span className="font-display text-sm font-semibold">{title}</span>
      </div>
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">{text}</div>
    </div>
  );
}
