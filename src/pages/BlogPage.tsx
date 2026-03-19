import { useState, useMemo } from "react";
import { articles, allTags } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 font-display text-4xl font-bold tracking-tighter md:text-5xl">
            Articles
          </h1>
          <p className="mb-8 text-muted-foreground">
            Browse all technical deep-dives and tutorials.
          </p>

          <div className="mb-6 max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="mb-10">
            <FilterBar tags={allTags} selected={selectedTags} onToggle={handleToggle} />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-border py-16 text-center">
              <p className="mb-2 font-display text-lg font-semibold">No articles found</p>
              <p className="text-sm text-muted-foreground">Try different search terms or filters.</p>
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
