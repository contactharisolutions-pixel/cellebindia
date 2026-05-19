import { Link } from "react-router-dom";
import { Article } from "@/lib/mock-data";

interface TopStoryCardProps {
  article: Article;
}

export default function TopStoryCard({ article }: TopStoryCardProps) {
  return (
    <Link
      to={`/article/${article.slug || article.id}`}
      className="block group border-b border-black pb-8 mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image - Half width on desktop */}
        <div className="w-full lg:w-1/2">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content - Half width on desktop */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              TOP STORY
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-black mb-4 leading-tight group-hover:text-primary transition-colors">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author */}
          <p className="text-sm text-gray-500 font-medium tracking-wide">
            {article.author}
          </p>
        </div>
      </div>
    </Link>
  );
}
