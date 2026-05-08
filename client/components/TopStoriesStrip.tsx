import { Link } from "react-router-dom";
import { Article } from "@/lib/mock-data";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";

interface TopStoriesStripProps {
  articles: Article[];
}

export default function TopStoriesStrip({ articles }: TopStoriesStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-12 border-b border-gold-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-foreground">
          <span className="text-primary">—</span> Top Stories
        </h2>

        {/* Horizontal scroll container */}
        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
          >
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="flex-shrink-0 w-80 group/card snap-start"
              >
                <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent"></div>

                  {/* Overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                      {article.category}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white line-clamp-2 group-hover/card:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </div>

                {/* Card subtitle */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
