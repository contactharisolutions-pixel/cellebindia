import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { fetchArticles } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function WhatsHot() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", "whatsHot", "all"],
    queryFn: () => fetchArticles({ whatsHot: true, limit: 50 }),
  });

  const articles = data?.articles || [];

  return (
    <div className="min-h-screen bg-light-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 border-b-2 border-black pb-4">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
            WHAT'S HOT
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            The most trending and hottest stories right now.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">
            Failed to load articles.
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            No hot stories currently available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                layout="vertical"
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
