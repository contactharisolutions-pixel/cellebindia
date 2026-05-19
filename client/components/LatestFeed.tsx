import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Article, getLatestArticles } from "@/lib/mock-data";

export default function LatestFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initialize with latest articles
  useEffect(() => {
    const latestArticles = getLatestArticles(100);
    setArticles(latestArticles);
    setHasMore(latestArticles.length > 10);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, hasMore]);

  const loadMore = useCallback(() => {
    setDisplayedCount((prev) => {
      const newCount = prev + 10;
      setHasMore(newCount < articles.length);
      return newCount;
    });
  }, [articles.length]);

  const displayedArticles = articles.slice(0, displayedCount);

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2 className="text-3xl font-serif font-bold mb-8 text-foreground">
          <span className="text-primary">—</span> Latest News
        </h2>

        {/* Articles list */}
        <div className="space-y-8">
          {displayedArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.slug || article.id}`}
              className="group block"
            >
              <article className="flex gap-6 pb-8 border-b border-gold-700/20 last:border-b-0 hover:opacity-75 transition-opacity">
                {/* Image */}
                <div className="flex-shrink-0 w-40 md:w-48 h-32 md:h-40 overflow-hidden rounded-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col justify-between">
                  {/* Meta and title */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="py-8 text-center">
          {hasMore ? (
            <div className="flex justify-center items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
            </div>
          ) : (
            <p className="text-muted-foreground">No more articles to load</p>
          )}
        </div>
      </div>

      <style>{`
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </section>
  );
}
