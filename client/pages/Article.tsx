import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import CellebClicks from "@/components/CellebClicks";
import ShareBar from "@/components/ShareBar";
import AdUnit from "@/components/AdUnit";
import { fetchArticleById, fetchArticles, fetchGalleries } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { parseEmbeds } from "@/lib/utils";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticleById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | CELLEB`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", article.excerpt || article.title);
      }
      // Also add/update a canonical tag
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `https://www.cellebindia.com/article/${article.id}`);
    } else {
      document.title = "CELLEB - The Sparkling World of Stars";
    }
  }, [article]);

  const { data: nextData } = useQuery({
    queryKey: ["articles", article?.category, "next"],
    queryFn: () => fetchArticles({ category: article?.category, limit: 6 }),
    enabled: !!article,
  });

  const { data: hotData } = useQuery({
    queryKey: ["articles", "hot"],
    queryFn: () => fetchArticles({ limit: 5 }),
  });

  const { data: galleries } = useQuery({
    queryKey: ["galleries"],
    queryFn: fetchGalleries,
  });

  const nextStories = nextData?.articles.filter(a => a.id !== id).slice(0, 5) || [];
  const whatHotArticles = hotData?.articles || [];
  const activeGalleries = (galleries || []).filter(g => g.active).slice(0, 5);

  if (isArticleLoading) {
    return (
      <div className="min-h-screen bg-light-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-light-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50">
      {/* Header */}
      <Header />

      {/* Article Header */}
      <div className="bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wider font-bold">
              BY {article.author} • {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <ShareBar title={article.title} className="bg-transparent border-none p-0" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN - Article & Next Stories (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="mb-8 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none mb-12">
              <div 
                className="text-lg text-gray-800 leading-relaxed mb-6 article-body"
                dangerouslySetInnerHTML={{ 
                  __html: parseEmbeds(article.content || article.excerpt) 
                }} 
              />

              {/* Media Blocks */}
              {article.mediaBlocks && article.mediaBlocks.length > 0 && (
                <div className="my-12 space-y-8">
                  {article.mediaBlocks.map((block, index) => (
                    <div key={index}>
                      {block.type === "image" && (
                        <figure>
                          <img
                            src={block.url}
                            alt={block.caption || "Article image"}
                            className="w-full"
                          />
                          {block.caption && (
                            <figcaption className="text-sm text-gray-600 italic mt-2">
                              {block.caption}
                            </figcaption>
                          )}
                        </figure>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>

            {/* Share Bar below article */}
            <div className="my-10">
              <ShareBar title={article.title} />
            </div>

            {/* AdSense — In-Article Unit */}
            <AdUnit
              slot="8278177353"
              format="rectangle"
              layout="in-article"
              className="my-8"
            />

            {/* Divider */}
            <div className="border-b-2 border-black my-12"></div>

            {/* Next Stories from Same Category */}
            {nextStories.length > 0 && (
              <div className="space-y-16">
                {nextStories.map((nextArticle, idx) => (
                  <div key={nextArticle.id}>
                    <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-widest">
                      NEXT TOP STORY ({idx + 1})
                    </h2>

                    <Link
                      to={`/article/${nextArticle.id}`}
                      className="block group"
                    >
                      <h3 className="text-2xl font-serif font-bold text-black mb-4 group-hover:text-primary transition-colors">
                        {nextArticle.title}
                      </h3>

                      <div className="mb-4 overflow-hidden border border-black">
                        <img
                          src={nextArticle.image}
                          alt={nextArticle.title}
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    {/* Divider */}
                    {idx < nextStories.length - 1 && (
                      <div className="border-b-2 border-black my-12"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Sidebar (1/3 width) */}
          <aside className="lg:col-span-1">
            {/* AdSense — Sidebar Rectangle (sticky-top) */}
            <div className="mb-8">
              <AdUnit slot="8278177353" format="rectangle" />
            </div>
            {/* WHAT'S HOT Section */}
            <section className="mb-12 border-b-2 border-black pb-8">
              <h3 className="text-lg font-bold text-black mb-6 uppercase tracking-widest">
                WHAT'S HOT
              </h3>

              <div className="space-y-6">
                {whatHotArticles.map((hotArticle) => (
                  <Link
                    key={hotArticle.id}
                    to={`/article/${hotArticle.id}`}
                    className="group block"
                  >
                    <div className="mb-3 overflow-hidden">
                      <img
                        src={hotArticle.image}
                        alt={hotArticle.title}
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-black line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {hotArticle.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                      BY {hotArticle.author} • {new Date(hotArticle.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* AdSense — Sidebar unit between sections */}
            {activeGalleries.length > 0 && (
              <div className="my-6">
                <AdUnit slot="8278177353" format="auto" />
              </div>
            )}

            {/* CELLEB CLICKS Galleries */}
            {activeGalleries.map((gallery) => (
              <CellebClicks
                key={gallery.id}
                gallery={gallery}
              />
            ))}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
