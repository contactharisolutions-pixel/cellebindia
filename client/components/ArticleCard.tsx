import { Link } from "react-router-dom";
import { Article } from "@shared/api";

interface ArticleCardProps {
  article: Article;
  layout?: "vertical" | "horizontal" | "small";
  variant?: "default" | "compact";
}

export default function ArticleCard({
  article,
  layout = "vertical",
  variant = "default",
}: ArticleCardProps) {
  if (layout === "small") {
    return (
      <Link to={`/article/${article.slug || article.id}`} className="flex gap-3 group py-4">
        <div className="w-24 flex-shrink-0 overflow-hidden aspect-[3/2]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-black group-hover:text-primary transition-colors line-clamp-3 leading-snug mb-1">
            {article.title}
          </h3>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
            BY {article.author} • {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </Link>
    );
  }

  if (layout === "horizontal") {
    return (
      <Link to={`/article/${article.slug || article.id}`} className="group flex gap-4 py-4">
        <div className="w-32 md:w-48 flex-shrink-0 overflow-hidden aspect-[16/9]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            {article.category}
          </span>
          <h3 className="text-lg font-bold text-black mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {variant === "default" && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <p className="text-xs text-gray-500 font-medium mt-3 uppercase tracking-wider font-bold">
            BY {article.author} • {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </Link>
    );
  }

  // Vertical layout (default)
  return (
    <Link to={`/article/${article.slug || article.id}`} className="group block">
      <div className="mb-4 overflow-hidden aspect-[16/9]">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <span className="text-xs font-bold text-primary tracking-widest uppercase">
        {article.category}
      </span>

      <h2 className="text-base md:text-lg font-bold text-black mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {article.title}
      </h2>

      {variant === "default" && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {article.excerpt}
        </p>
      )}

      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider font-bold">
        BY {article.author} • {new Date(article.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </Link>
  );
}
