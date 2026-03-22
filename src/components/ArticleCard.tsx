import { Link } from "react-router-dom";
import { Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Article } from "@/data/articles";

interface Props {
  article: Article;
  index?: number;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export default function ArticleCard({ article, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link
        to={`/article/${article.id}`}
        className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-primary/5 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10" 
      >
      {/* {article.featured && (
        <span className="absolute right-4 top-4 rounded bg-primary px-2 py-1 font-mono text-[10px] text-primary-foreground">
          Featured
        </span>
      )} */}
      
      {/* Top Accent */}
        {/* <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#F0DCCA] to-[#F3E3D5] opacity-80 blur-[0.5px] group-hover:opacity-100" /> */}

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary"
            >
              {tag}
            </span>
          ))}
          {/* {article.difficulty && (
            <span className="mb-2 inline-block rounded bg-secondary px-2 py-1 text-[10px] font-mono text-secondary-foreground">
              {article.difficulty}
            </span>
          )} */}
          {article.difficulty && (
            <span className="rounded-md border border-border bg-primary/20 px-2.5 py-1 font-mono text-xs text-secondary-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary">
              {article.difficulty}
            </span>
          )}
        </div>


        <h3 className="mb-2 flex items-start justify-between gap-2 font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
          {article.title}
          <ArrowUpRight
            size={16}
            className="mt-1 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
          />
        </h3>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {article.description}
        </p>

        <div className="mt-auto flex items-center justify-between font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{article.readingTime} min read</span>
          </div>
          {/* <span>{new Date(article.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span> */}
          <span>{formatDate(article.date)}</span>
        </div>
      </Link>
    </motion.article>
  );
}
