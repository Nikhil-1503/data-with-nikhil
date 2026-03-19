import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary/15">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} data_wtih_nikhil. Built by Nikhil Shanbhag.
        </p>
        <div className="flex items-center gap-4">
          <a  
              href="https://github.com/Nikhil-1503" 
              rel="noopener noreferrer"
              className="group text-muted-foreground transition-all duration-200 hover:text-primary" 
              aria-label="GitHub">
            <Github size={18} className="transition-transform duration-200 group-hover:scale-110"/>
          </a>
          <a 
              href="https://www.linkedin.com/in/nikhilshanbhag01/" 
              rel="noopener noreferrer"
              className="group text-muted-foreground transition-all duration-200 hover:text-primary" 
              aria-label="LinkedIn">
            <Linkedin size={18} className="transition-transform duration-200 group-hover:scale-110"/>
          </a>
        </div>
      </div>
    </footer>
  );
}
