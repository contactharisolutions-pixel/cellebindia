/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
  altText?: string;
  metadata: Record<string, any>;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface MediaBlock {
  type: "image" | "video";
  url: string;
  caption?: string;
}

export type ArticleStatus = "Draft" | "In Review" | "Approved" | "Scheduled" | "Published" | "Archived";

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  whatsHotOrder?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  featured: boolean;
  status: ArticleStatus;
  mediaBlocks: MediaBlock[];
  relatedArticles: string[];
  tags: string[];
  seo?: SEOData;
  scheduledDate?: string;
}

export interface GalleryImage {
  url: string;
  caption?: string;
  thumbnailUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  updatedAt: string;
}

export interface VideoGallery {
  id: string;
  title: string;
  videos: VideoItem[];
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  images: GalleryImage[];
  createdAt: string;
  active: boolean;
}

export type Category = 
  | "Bollywood"
  | "PAN India"
  | "Movie Review"
  | "Streaming"
  | "TV Serial"
  | "Hollywood"
  | "Box Office"
  | "Trailer Review";

export interface ArticlesResponse {
  articles: Article[];
  total: number;
}

export interface CreateArticleRequest extends Omit<Article, "id"> {}
export interface UpdateArticleRequest extends Partial<Omit<Article, "id">> {}
