import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import HomeGallery from "@/components/HomeGallery";
import HomeVideoGallery from "@/components/HomeVideoGallery";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import { Link } from "react-router-dom";
import { fetchArticles } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", category],
    queryFn: () => fetchArticles({ category }),
  });

  const articles = data?.articles || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
        </div>
      </div>
    );
  }

  // Split articles for in-feed ad injection
  const firstBatch = articles.slice(1, 5);   // first row (4 articles)
  const secondBatch = articles.slice(5);      // rest after in-feed ad

  return (
    <div className="min-h-screen bg-light-50">
      {/* Header */}
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b-2 border-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            {category}
          </h1>
          <p className="text-xl text-gray-700">
            Latest stories and updates from {category}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            No articles found in this category.
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {/* Full-width hero article */}
            <Link
              to={`/article/${articles[0].id}`}
              className="group block relative overflow-hidden bg-black rounded-sm shadow-xl"
            >
              <div className="w-full aspect-[16/9] md:aspect-[2.1/1]">
                <img
                  src={articles[0].image}
                  alt={articles[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 p-6 md:p-10 lg:p-12 max-w-4xl">
                <span
                  className="inline-block px-3 py-1 bg-[#E30000] text-white text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
                >
                  {articles[0].category}
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-gray-200 transition-colors drop-shadow-lg">
                  {articles[0].title}
                </h2>
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4 max-w-2xl font-medium">
                  {articles[0].excerpt}
                </p>
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  BY {articles[0].author} •{" "}
                  {new Date(articles[0].date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </Link>

            {/* Content Grid with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* ── Left Column: Articles ───────────────────────────── */}
              <div className="lg:col-span-8">
                {articles.length > 1 && (
                  <div className="space-y-8">
                    {/* First batch of articles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {firstBatch.map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          layout="vertical"
                        />
                      ))}
                    </div>

                    {/* In-feed AdSense banner between rows */}
                    {articles.length > 5 && (
                      <AdUnit
                        slot="4455667788"
                        format="horizontal"
                        className="my-4"
                      />
                    )}

                    {/* Second batch of articles */}
                    {secondBatch.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {secondBatch.map((article) => (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            layout="vertical"
                          />
                        ))}
                      </div>
                    )}

                    {/* Bottom Leaderboard */}
                    <AdUnit
                      slot="8877665544"
                      format="horizontal"
                      className="mt-8"
                    />
                  </div>
                )}
              </div>

              {/* ── Right Column: Sidebar ────────────────────────────── */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-8">
                  {/* Ad — Sidebar Top Rectangle */}
                  <AdUnit slot="2233445566" format="rectangle" />

                  {/* Galleries */}
                  <HomeGallery isSidebar={true} />

                  {/* Ad — Sidebar Mid */}
                  <AdUnit slot="6655443322" format="auto" label={false} />

                  {/* Video Gallery */}
                  <div className="pt-4 border-t border-gray-200">
                    <HomeVideoGallery isSidebar={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
