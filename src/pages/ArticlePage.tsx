import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, useScroll } from "framer-motion";
import { ArrowLeft, Clock, Link as LinkIcon, Check } from "lucide-react";
import { articles } from "@/data/articles";
import type { ArticleSection } from "@/data/articles";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import ArticleCard from "@/components/ArticleCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/);

const getSimilarityScore = (a: string[], b: string[]) => {
  const setA = new Set(a);
  const setB = new Set(b);

  let score = 0;

  setA.forEach((word) => {
    if (setB.has(word)) score++;
  });

  return score;
};

export default function ArticlePage() {
  const { id } = useParams();
  const article = useMemo(
  () => articles.find((a) => a.id === id),
  [id]
);
  const { scrollYProgress } = useScroll();
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const headings = useMemo(
    () =>
      article?.content
        .filter((s) => s.type === "heading")
        .map((s) => ({ text: s.text!, level: s.level!, id: s.text!.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })) || [],
    [article]
  );

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-20% 0px -60% 0px", // controls when it activates
      threshold: 0,
    }
  );

  const elements = headings.map((h) =>
    document.getElementById(h.id)
  );

  elements.forEach((el) => {
    if (el) observer.observe(el);
  });

  return () => {
    elements.forEach((el) => {
      if (el) observer.unobserve(el);
    });
  };
}, [headings]);

  const related = useMemo(() => {
  if (!article) return [];

  const currentContent = normalizeText(
    `${article.title} ${article.description} ${article.tags.join(" ")}`
  );

  return articles
    .filter((a) => a.id !== article.id)
    .map((a) => {
      const compareContent = normalizeText(
        `${a.title} ${a.description} ${a.tags.join(" ")}`
      );

      const score = getSimilarityScore(currentContent, compareContent);

      return { ...a, score };
    })
    .filter((a) => a.score > 2) // threshold (tweakable)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}, [article]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <h1 className="mb-4 font-display text-2xl font-bold">Article not found</h1>
          <Link to="/blog" className="font-mono text-sm text-primary hover:underline">
            ← Back to articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Reading progress */}
      <motion.div
        className="fixed left-0 right-0 top-[57px] z-40 h-0.5 origin-left bg-primary"
        style={{ scaleX: scrollYProgress }}
      />

      <article className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between gap-8">
            {/* Main content */}
            <div className="min-w-0 flex-1 max-w-[75ch]">
              <Link
                to="/blog"
                className="mb-8 inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft size={14} />
                Back to articles
              </Link>

              {/* Meta */}
              <div className="mb-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                {article.title}
              </h1>

              <div className="mb-8 flex flex-wrap items-center gap-4 font-mono text-sm text-muted-foreground">
                <span>{article.author}</span>
                <span>·</span>
                <span>
                  {new Date(article.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {article.readingTime} min read
                </span>
                {article.difficulty && (
                <span className="rounded bg-secondary px-2 py-1 text-xs">
                  {article.difficulty}
                </span>
              )}
                <button
                  onClick={copyLink}
                  className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-3 py-1 transition-all hover:border-primary hover:bg-primary/5"
                >
                  {linkCopied ? <Check size={12} /> : <LinkIcon size={12} />}
                  {linkCopied ? "Copied!" : "Copy link"}
                </button>
              </div>

              {/* Content */}
              <div className="prose-content max-w-none">
                {article.content.map((section, i) => (
                  <ContentSection key={i} section={section} />
                ))}
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-16 border-t border-border pt-12">
                  <h2 className="mb-6 font-display text-xl font-bold">
                    Related Articles
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {related.map((a, i) => (
                      <ArticleCard key={a.id} article={a} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Table of Contents - desktop */}
            <aside className="hidden w-64 shrink-0 xl:block">
              <div className="sticky top-24 border-l border-border pl-6">
                <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  On this page
                </h4>
                <nav className="flex flex-col gap-2">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      // className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                      className={`font-mono text-xs transition-colors ${
                        activeId === h.id
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

function ContentSection({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case "heading": {
      const id = section.text!.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const Tag = `h${section.level}` as keyof JSX.IntrinsicElements;
      return (
        <Tag
          id={id}
          className="mb-4 mt-10 font-display text-xl font-bold tracking-tight scroll-mt-24 md:text-2xl"
        >
          {section.text}
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p className="mb-6 text-[15.5px] leading-7 text-foreground/90">
          {section.text}
        </p>
       );
    case "code":
      return <CodeBlock code={section.text!} language={section.language} />;
    case "list":
      return (
        <ul className="mb-4 ml-4 list-disc space-y-1.5">
          {section.items!.map((item, i) => (
            <li key={i} className="leading-relaxed text-foreground/90">
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return <Callout type={section.calloutType!} text={section.text!} />;
    default:
      return null;
  }
}
