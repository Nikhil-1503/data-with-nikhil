import { useState, useEffect, useMemo } from "react";
import { Check, Copy } from "lucide-react";
// import { codeToHtml } from "shiki"; -- Shiki
import Prism from "prismjs";

// Languages
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";

interface Props {
  code: string;
  language?: string;
}

const langMap: Record<string, string> = {
  python: "python",
  pyspark: "python",
  sql: "sql",
  bash: "bash",
  shell: "bash",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
};

export default function CodeBlock({ code, language = "python" }: Props) {
  const [copied, setCopied] = useState(false);
  // const [highlighted, setHighlighted] = useState<string>("");
  // const [isDark, setIsDark] = useState(false);

  const prismLang = langMap[language.toLowerCase()] || "python";
  const grammar = Prism.languages[prismLang];

  // const highlightedHTML = useMemo(() => {
  //   if (!grammar) return code;
    
  //   return Prism.highlight(code, grammar, prismLang);
  // }, [code, grammar, prismLang]);

  const formattedCode = useMemo(() => {
    if (prismLang === "json") {
      try {
        return JSON.stringify(JSON.parse(code), null, 2);
      } catch {
        return code;
      }
    }
    return code;
  }, [code, prismLang]);

  const highlightedHTML = useMemo(() => {
    if (!grammar) return formattedCode;
    return Prism.highlight(formattedCode, grammar, prismLang);
  }, [formattedCode, grammar, prismLang]);

  const lines = highlightedHTML.split("\n");

  // useEffect(() => {
  //   const checkDark = () => {
  //     setIsDark(document.documentElement.classList.contains("dark"));
  //   };

  //   checkDark();

  //   const observer = new MutationObserver(checkDark);
  //   observer.observe(document.documentElement, {
  //     attributes: true,
  //     attributeFilter: ["class"],
  //   });

  //   return () => observer.disconnect();
  // }, []);

  //  useEffect(() => {
  //   const highlight = async () => {
  //     // const isDark = document.documentElement.classList.contains("dark");
  //     const html = await codeToHtml(code, {
  //       lang: language,
  //       theme: isDark ? "github-dark" : "github-light",
  //     });
  //     const cleanedHtml = html
  //       .replace(/style="[^"]*background-color:[^;]+;?[^"]*"/g, "")
  //       .replace(/background-color:[^;]+;?/g, "");

  //     setHighlighted(cleanedHtml);
  //   };

  //   highlight();
  // }, [code, language, isDark]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-lg border-r-4 p-5 overflow-hidden border border-border bg-primary/5 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-all hover:text-foreground hover:bg-muted/40"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse font-mono text-sm leading-relaxed">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-muted/50 transition-colors">
                
                {/* Line Number */}
                <td className="select-none pr-4 text-right text-xs text-muted-foreground/40 align-top w-[1%] whitespace-nowrap">
                  {i + 1}
                </td>

                {/* Code Line */}
                <td className="w-full">
                  <span
                    className="block"
                    dangerouslySetInnerHTML={{
                      __html: line || "&nbsp;",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // return (
  //   <div className="group relative my-6 rounded-lg border-r-4 p-5 overflow-hidden border border-border bg-primary/5 shadow-sm">
  //     <div className="flex items-center justify-between border-b border-border px-4 py-2">
  //       <span className="font-mono text-xs text-muted-foreground">
  //         {language}
  //       </span>
  //       <button
  //         onClick={handleCopy}
  //         className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
  //       >
  //         {copied ? <Check size={12} /> : <Copy size={12} />}
  //         {copied ? "Copied" : "Copy"}
  //       </button>
  //     </div>
  //     <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
  //       {/* <code className="font-mono text-muted-foreground">{code}</code> */}
  //       <div className="overflow-x-auto px-4 py-3 text-sm">
  //         <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: highlighted }} />
  //       </div>
  //       {/* {code.split("\n").map((line, i) => (
  //         <div key={i} className="flex gap-4">
  //           <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
  //           <code>{line}</code>
  //         </div>
  //       ))} */}
  //     </pre>
  //   </div>
  // );
}
