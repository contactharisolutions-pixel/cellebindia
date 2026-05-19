import { Link } from "react-router-dom";
import { Article } from "@/lib/mock-data";

interface HeroSectionProps {
  article: Article;
}

export default function HeroSection({ article }: HeroSectionProps) {
  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden group">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover image-hover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <Link
        to={`/article/${article.slug || article.id}`}
        className="relative h-full flex flex-col justify-end p-6 md:p-10 lg:p-16 cursor-pointer"
      >
        {/* Category tag */}
        <div className="inline-flex items-center gap-2 mb-4 w-fit">
          <div className="w-1 h-6 bg-primary"></div>
          <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 max-w-3xl group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-200 max-w-2xl mb-6 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Read more indicator */}
        <div className="inline-flex items-center gap-2 text-primary font-semibold">
          <span>Read Full Story</span>
          <span className="text-xl">→</span>
        </div>
      </Link>
    </div>
  );
}
