import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import CategorySection from "@/components/CategorySection";
import HomeGallery from "@/components/HomeGallery";
import HomeVideoGallery from "@/components/HomeVideoGallery";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { fetchArticles, fetchCategories } from "@/lib/api-client";
import AdUnit from "@/components/AdUnit";
import { useQuery } from "@tanstack/react-query";
import { CategoryItem } from "@shared/api";

export default function Index() {
  const { data: featuredData } = useQuery({
    queryKey: ["articles", "featured"],
    queryFn: () => fetchArticles({ featured: true, limit: 8 }),
  });

  const { data: latestData, error: latestError, isLoading: latestLoading } = useQuery({
    queryKey: ["articles", "whatsHot"],
    queryFn: () => fetchArticles({ whatsHot: true, limit: 5 }),
  });

  if (latestError) {
    console.error("Latest Articles Error:", latestError);
  }

  const featuredArticles = featuredData?.articles || [];
  const latestArticles = latestData?.articles || [];

  const { data: dbCategories } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const displayOrder = [
    "Bollywood",
    "PAN India",
    "Streaming",
    "Box Office",
    "Hollywood",
    "Movie Review",
    "Trailer Review",
    "TV Serial"
  ];

  const categoryNames = dbCategories 
    ? displayOrder.filter(name => 
        dbCategories.some(c => c.name.toLowerCase() === name.toLowerCase())
      )
    : displayOrder;

  return (
    <div className="min-h-screen bg-light-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* NEW TWO-COLUMN HERO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 border-b border-black pb-12">
          
          {/* LEFT COLUMN: TOP STORIES (2/3 Width) */}
          <div className="lg:col-span-2">
            {featuredArticles && featuredArticles.length > 0 && (
              <div className="mb-8">
                {/* Main Featured Article */}
                {featuredArticles[0] && (
                  <Link to={`/article/${featuredArticles[0].id}`} className="block relative group overflow-hidden mb-6 rounded-sm">
                    <img 
                      src={featuredArticles[0].image} 
                      alt={featuredArticles[0].title}
                      className="w-full h-[40vh] md:h-[55vh] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div 
                      className="absolute top-0 left-0 bg-[#E30000] text-white px-4 py-2 font-bold uppercase tracking-wider z-10 text-sm md:text-base pr-8"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
                    >
                      TOP STORIES
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold mb-3 leading-tight group-hover:text-gray-200 transition-colors drop-shadow-lg">
                        {featuredArticles[0].title}
                      </h2>
                      <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-300">
                        BY {featuredArticles[0].author} • {new Date(featuredArticles[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </Link>
                )}

                {/* 4-Column Small Featured Articles Grid */}
                {featuredArticles.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                    {featuredArticles.slice(1, 5).map(article => (
                      <Link key={article.id} to={`/article/${article.id}`} className="group block">
                        <div className="aspect-square w-full overflow-hidden mb-3 bg-gray-100 rounded-sm">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>
                        <h3 className="text-sm md:text-base font-sans font-bold text-black group-hover:text-[#E30000] leading-snug line-clamp-4 mb-2 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-wider">
                          BY {article.author} • {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}

                {/* 3-Column Small Featured Articles Grid (Optional Row) */}
                {featuredArticles.length > 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {featuredArticles.slice(5, 8).map(article => (
                      <Link key={article.id} to={`/article/${article.id}`} className="group block">
                        <div className="aspect-video w-full overflow-hidden mb-3 bg-gray-100 rounded-sm">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>
                        <h3 className="text-base font-sans font-bold text-black group-hover:text-[#E30000] leading-snug line-clamp-3 mb-2 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-wider">
                          BY {article.author} • {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: WHAT'S HOT + ADS (1/3 Width) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Ad — Sidebar Top */}
            <AdUnit slot="8278177353" format="rectangle" label={true} />

            <div>
              <h2 className="text-3xl font-black text-black mb-4">
                What's Hot
              </h2>
            
            <div className="border border-gray-200 bg-white">
              <div className="flex flex-col">
                {latestArticles.slice(0, 5).map((article, index) => (
                  <Link 
                    key={article.id} 
                    to={`/article/${article.id}`} 
                    className="flex items-center gap-4 p-5 border-b border-gray-100 last:border-b-0 group"
                  >
                    <div className="text-4xl font-bold text-[#E30000] w-6 text-center shrink-0">
                      {index + 1}
                    </div>
                    <div className="w-16 h-16 shrink-0 overflow-hidden bg-gray-100">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-black group-hover:text-[#E30000] leading-snug line-clamp-3 transition-colors mb-1.5">
                        {article.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                        BY {article.author} • {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link 
                to="/whats-hot" 
                className="block w-full bg-gray-200 hover:bg-gray-300 transition-colors text-black text-center py-3 text-xs font-bold uppercase tracking-widest"
              >
                EXPLORE MORE ❯
              </Link>
            </div>
            </div>

            {/* Ad — Sidebar Bottom */}
            <AdUnit slot="8278177353" format="rectangle" label={true} />
          </div>
        </div>

        {/* AdSense — Leaderboard below hero */}
        <AdUnit slot="8278177353" format="horizontal" className="mb-12" />

        {/* Gallery Section */}
        <HomeGallery />

        {/* Category Sections */}
        {categoryNames.map((category) => (
          <CategorySection key={category} category={category} />
        ))}

        {/* AdSense — Horizontal between categories and video */}
        <AdUnit slot="8278177353" format="horizontal" className="my-8" />

        {/* Video Gallery Section */}
        <HomeVideoGallery />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
