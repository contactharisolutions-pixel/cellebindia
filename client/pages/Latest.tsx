import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { fetchArticles } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Latest() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", "latest", "all"],
    queryFn: () => fetchArticles({ limit: 50 }),
  });

  const articles = data?.articles || [];

  return (
    <div className="min-h-screen bg-light-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 border-b-2 border-black pb-4">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
            LATEST NEWS
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            The most recent updates and stories, published right now.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">
            Failed to load latest articles.
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            No articles published yet.
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {/* Full width feature article */}
            {articles.length > 0 && (
              <Link to={`/article/${articles[0].id}`} className="group block relative overflow-hidden bg-black">
                <div className="w-full aspect-[16/9] md:aspect-[2.5/1]">
                  <img
                    src={articles[0].image}
                    alt={articles[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 p-6 md:p-10 lg:p-14 max-w-4xl">
                  <span className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold uppercase tracking-wider mb-4">
                    {articles[0].category}
                  </span>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                    {articles[0].title}
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4 max-w-2xl">
                    {articles[0].excerpt}
                  </p>
                  <div className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    BY {articles[0].author} • {new Date(articles[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of the articles grid */}
            {articles.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {articles.slice(1).map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    layout="vertical"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
