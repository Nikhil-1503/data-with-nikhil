import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "python" }: Props) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState<string>("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

   useEffect(() => {
    const highlight = async () => {
      // const isDark = document.documentElement.classList.contains("dark");
      const html = await codeToHtml(code, {
        lang: language,
        theme: isDark ? "github-dark" : "github-light",
      });
      const cleanedHtml = html
        .replace(/style="[^"]*background-color:[^;]+;?[^"]*"/g, "")
        .replace(/background-color:[^;]+;?/g, "");

      setHighlighted(cleanedHtml);
    };

    highlight();
  }, [code, language, isDark]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-lg border-r-4 p-5 overflow-hidden border border-border bg-primary/5 shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        {/* <code className="font-mono text-muted-foreground">{code}</code> */}
        <div className="overflow-x-auto px-4 py-3 text-sm">
          <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
        {/* {code.split("\n").map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
            <code>{line}</code>
          </div>
        ))} */}
      </pre>
    </div>
  );
}
