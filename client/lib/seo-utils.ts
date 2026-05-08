import { Article, SEOData } from "@shared/api";

export interface SEOScore {
  score: number;
  suggestions: { text: string; type: "good" | "warning" | "error" }[];
}

export function calculateSEOScore(data: Partial<Article>): SEOScore {
  let score = 0;
  const suggestions: SEOScore["suggestions"] = [];

  const title = data.seo?.metaTitle || data.title || "";
  const description = data.seo?.metaDescription || data.excerpt || "";
  const content = data.content || "";

  // Title length check (ideal: 50-60 characters)
  if (title.length >= 50 && title.length <= 60) {
    score += 20;
    suggestions.push({ text: "Title length is ideal.", type: "good" });
  } else if (title.length > 0) {
    score += 10;
    suggestions.push({ text: "Title length could be optimized (aim for 50-60 chars).", type: "warning" });
  } else {
    suggestions.push({ text: "Title is missing.", type: "error" });
  }

  // Description length check (ideal: 120-160 characters)
  if (description.length >= 120 && description.length <= 160) {
    score += 20;
    suggestions.push({ text: "Meta description length is ideal.", type: "good" });
  } else if (description.length > 0) {
    score += 10;
    suggestions.push({ text: "Meta description should be between 120-160 chars.", type: "warning" });
  } else {
    suggestions.push({ text: "Meta description is missing.", type: "error" });
  }

  // Content length check
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 600) {
    score += 20;
    suggestions.push({ text: "Article length is comprehensive (600+ words).", type: "good" });
  } else if (wordCount >= 300) {
    score += 10;
    suggestions.push({ text: "Article length is decent, but more depth is better.", type: "warning" });
  } else {
    suggestions.push({ text: "Content is too short for SEO (aim for 300+ words).", type: "error" });
  }

  // Keyword check
  if (data.seo?.keywords && data.seo.keywords.length > 0) {
    score += 20;
    suggestions.push({ text: "Focus keywords are defined.", type: "good" });
  } else {
    suggestions.push({ text: "Add focus keywords for better targeting.", type: "warning" });
  }

  // Featured Image check
  if (data.seo?.ogImage || (data as any).image) {
    score += 20;
    suggestions.push({ text: "Social sharing image is set.", type: "good" });
  } else {
    suggestions.push({ text: "Missing social sharing (OG) image.", type: "error" });
  }

  return { 
    score: Math.min(100, score), 
    suggestions: suggestions.sort((a, b) => {
      const order = { good: 3, warning: 2, error: 1 };
      return order[a.type] - order[b.type];
    })
  };
}
