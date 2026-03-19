import { Link } from "react-router-dom";
import { Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Article } from "@/data/articles";

interface Props {
  article: Article;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link
        to={`/article/${article.id}`}
        className="flex h-full flex-col rounded-lg border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-primary"
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mb-2 font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>

        <div className="mt-auto flex items-center justify-between font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{article.readingTime} min read</span>
          </div>
          <span>{new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </Link>
    </motion.article>
  );
}
