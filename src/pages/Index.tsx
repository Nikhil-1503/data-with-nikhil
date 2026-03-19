import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { articles, allTags } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Index() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const featured = articles.filter((a) => a.featured);

  const handleToggle = (tag: string) => {
    if (tag === "__clear__") {
      setSelectedTags([]);
      return;
    }
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((t) => a.tags.includes(t));
      return matchesSearch && matchesTags;
    });
  }, [search, selectedTags]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="px-6 py-[12vh] md:py-[15vh]">
        <div className="mx-auto max-w-7xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm uppercase tracking-widest text-primary"
          >
            Data Engineering Deep Dives
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-4 mb-6 font-display text-5xl font-bold tracking-tighter text-balance md:text-7xl lg:text-8xl"
          >
            Building Resilient{" "}
            <span className="text-muted-foreground/40">Pipelines.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="max-w-[60ch] text-lg text-muted-foreground text-pretty md:text-xl"
          >
            Technical deep-dives into PySpark optimization, SQL patterns, and
            cloud-native data orchestration. Real-world examples from production
            pipelines.
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-y border-border px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <FilterBar
            tags={allTags}
            selected={selectedTags}
            onToggle={handleToggle}
          />
        </div>
      </section>

      {/* Featured */}
      {!search && selectedTags.length === 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
              Featured Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All / Filtered Articles */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
            {search || selectedTags.length > 0 ? "Results" : "All Articles"}
          </h2>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-border py-16 text-center">
              <p className="mb-2 font-display text-lg font-semibold">
                No articles found
              </p>
              <p className="text-sm text-muted-foreground">
                Try different search terms or filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
