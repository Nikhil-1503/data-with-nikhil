import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} pipeline_blog. Built with precision.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
