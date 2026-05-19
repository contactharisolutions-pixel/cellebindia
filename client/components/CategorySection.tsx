import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "@/lib/api-client";
import { Link } from "react-router-dom";
import ArticleCard from "./ArticleCard";

interface CategorySectionProps {
  category: string;
}

export default function CategorySection({ category }: CategorySectionProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", category],
    queryFn: () => fetchArticles({ category, limit: 5 }),
  });

  const articles = data?.articles || [];

  if (error) return <div className="h-20 flex items-center justify-center text-red-500 text-xs font-bold">Failed to load {category}</div>;
  if (isLoading) return <div className="h-64 flex items-center justify-center text-gray-400">Loading {category}...</div>;
  if (articles.length === 0) return null;

  return (
    <section className="mb-16 border-b border-black pb-12">
      <h2 className="text-3xl font-bold text-black mb-6">
        {category}
      </h2>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Left Column - Featured Article */}
        {articles.length > 0 && (
          <div>
            <Link to={`/article/${articles[0].slug || articles[0].id}`} className="group block">
              <div className="mb-4 overflow-hidden aspect-[16/9]">
                <img
                  src={articles[0].image}
                  alt={articles[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-black mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {articles[0].title}
              </h3>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                BY {articles[0].author} • {new Date(articles[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </Link>
          </div>
        )}

        {/* Right Column - Small Articles List */}
        {articles.length > 1 && (
          <div className="flex flex-col">
            {articles.slice(1).map((article, idx) => (
              <div key={article.id} className={`py-4 ${idx !== 0 ? 'border-t border-gray-100' : 'pt-0'}`}>
                <Link to={`/article/${article.slug || article.id}`} className="group flex justify-between gap-4">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-sm md:text-base font-semibold text-black group-hover:text-primary transition-colors line-clamp-3 leading-snug mb-2">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                      BY {article.author} • {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className="w-28 md:w-40 flex-shrink-0 overflow-hidden aspect-[16/9]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <Link 
          to={`/category/${category.toLowerCase().replace(/ /g, '-')}`} 
          className="block w-full bg-[#EAEAEA] hover:bg-[#DCDCDC] text-black text-center py-3 font-bold text-xs uppercase tracking-widest transition-colors"
        >
          Explore More {'>'}
        </Link>
      </div>
    </section>
  );
}
