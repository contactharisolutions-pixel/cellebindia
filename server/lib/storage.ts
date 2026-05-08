import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { Article, Media } from "../../shared/api";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if ((!supabaseUrl || !supabaseAnonKey) && process.env.NODE_ENV === 'production') {
  console.warn("WARNING: SUPABASE_URL or SUPABASE_ANON_KEY is not defined in production environment!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Alias for compatibility if needed, though we should transition to 'supabase' client
export const db = supabase;

function mapArticle(row: any): Article {
  // Handle tags which might come back as an array of objects from Supabase
  const tags = Array.isArray(row.tags) 
    ? row.tags.map((t: any) => typeof t === 'string' ? t : t.name).filter(Boolean)
    : row.tags || [];

  return {
    id: row.id,
    slug: row.slug || "",
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    category: row.category,
    author: row.author,
    date: row.date,
    featured: row.featured,
    status: row.status || "Published",
    mediaBlocks: row.media_blocks || [],
    relatedArticles: row.related_articles || [],
    tags: tags,
    seo: row.seo || {},
    scheduledDate: row.scheduled_date,
  };
}

export async function getAllArticles(params: { category?: string, limit?: number, offset?: number, whatsHot?: boolean } = {}): Promise<{ articles: Article[], total: number }> {
  let query = supabase
    .from('articles')
    .select(`
      *,
      article_tags (
        tags (
          name
        )
      )
    `, { count: 'exact' });

  if (params.category) {
    query = query.ilike('category', `%${params.category}%`);
  }

  if (params.whatsHot) {
    // Only get articles where whatsHotOrder exists and is > 0
    query = query.not('seo->whatsHotOrder', 'is', null);
    query = query.gt('seo->whatsHotOrder', 0);
    // Sort by the order number (ascending)
    query = query.order('seo->whatsHotOrder', { ascending: true });
  } else {
    // Default sort by date (latest first) and then by ID (which includes timestamp)
    query = query.order('date', { ascending: false }).order('id', { ascending: false });
  }

  if (params.limit !== undefined) {
    const from = params.offset || 0;
    const to = from + params.limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }

  const articles = data.map((row: any) => {
    // Flatten tags from join
    const tags = row.article_tags?.map((at: any) => at.tags?.name).filter(Boolean) || [];
    return mapArticle({ ...row, tags });
  });

  return { articles, total: count || 0 };
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_tags (
        tags (
          name
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error("Error fetching article by ID:", error);
    throw error;
  }

  const tags = data.article_tags?.map((at: any) => at.tags?.name).filter(Boolean) || [];
  return mapArticle({ ...data, tags });
}

export async function saveArticle(article: Article): Promise<void> {
  const articleData = {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    image: article.image,
    category: article.category,
    author: article.author,
    date: article.date,
    featured: article.featured,
    status: article.status,
    media_blocks: article.mediaBlocks,
    related_articles: article.relatedArticles,
    seo: article.seo || {},
    scheduled_date: article.scheduledDate,
  };

  const { error } = await supabase
    .from('articles')
    .upsert(articleData);

  if (error) {
    console.error("Error saving article:", error);
    throw error;
  }

  // Handle tags
  if (article.tags) {
    // Delete existing tags for this article
    await supabase.from('article_tags').delete().eq('article_id', article.id);

    if (article.tags.length > 0) {
      for (const tagName of article.tags) {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Find or create tag
        let { data: tagData, error: tagError } = await supabase
          .from('tags')
          .select('id')
          .eq('slug', tagSlug)
          .single();

        let tagId;
        if (!tagData) {
          tagId = `tag-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
          await supabase.from('tags').insert({ id: tagId, name: tagName, slug: tagSlug });
        } else {
          tagId = tagData.id;
        }

        await supabase.from('article_tags').insert({ article_id: article.id, tag_id: tagId });
      }
    }
  }
}

export async function deleteArticleRow(id: string): Promise<boolean> {
  const { error, count } = await supabase
    .from('articles')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) {
    console.error("Error deleting article:", error);
    throw error;
  }

  return (count || 0) > 0;
}

// Media Operations
function mapMedia(row: any): Media {
  return {
    id: row.id,
    url: row.url,
    filename: row.filename,
    mimetype: row.mimetype,
    size: row.size,
    width: row.width,
    height: row.height,
    createdAt: row.created_at,
    altText: row.alt_text,
    metadata: row.metadata || {},
  };
}

export async function getAllMedia(): Promise<Media[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching media:", error);
    throw error;
  }

  return data.map(mapMedia);
}

export async function saveMedia(media: Media): Promise<void> {
  const mediaData = {
    id: media.id,
    url: media.url,
    filename: media.filename,
    mimetype: media.mimetype,
    size: media.size,
    width: media.width,
    height: media.height,
    alt_text: media.altText,
    metadata: media.metadata || {},
  };

  const { error } = await supabase
    .from('media')
    .upsert(mediaData);

  if (error) {
    console.error("Error saving media:", error);
    throw error;
  }
}

export async function deleteMediaRow(id: string): Promise<boolean> {
  const { error, count } = await supabase
    .from('media')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) {
    console.error("Error deleting media:", error);
    throw error;
  }

  return (count || 0) > 0;
}

// Gallery Operations
import { Gallery } from "../../shared/api";

function mapGallery(row: any): Gallery {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    images: row.images || [],
    createdAt: row.created_at,
    active: row.active ?? true,
  };
}

export async function getAllGalleries(): Promise<Gallery[]> {
  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching galleries:", error);
    // Return empty array if table doesn't exist yet to avoid crashing
    return [];
  }

  return data.map(mapGallery);
}

export async function saveGallery(gallery: Gallery): Promise<void> {
  const galleryData = {
    id: gallery.id,
    title: gallery.title,
    description: gallery.description,
    images: gallery.images || [],
    active: gallery.active,
  };

  const { error } = await supabase
    .from('galleries')
    .upsert(galleryData);

  if (error) {
    console.error("Error saving gallery:", error);
    throw error;
  }
}

export async function deleteGalleryRow(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('galleries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting gallery:", error);
    return false;
  }
  return true;
}

// Video Gallery Operations
import { VideoGallery } from "../../shared/api";

function mapVideoGallery(row: any): VideoGallery {
  return {
    id: row.id,
    title: row.title,
    videos: row.videos || [],
  };
}

export async function getVideoGallery(): Promise<VideoGallery> {
  const { data, error } = await supabase
    .from('video_galleries')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return { id: 'default', title: 'Video Gallery', videos: [] };
    }
    console.error("Error fetching video gallery:", error);
    return { id: 'default', title: 'Video Gallery', videos: [] };
  }

  return mapVideoGallery(data);
}

export async function saveVideoGallery(gallery: VideoGallery): Promise<void> {
  const { error } = await supabase
    .from('video_galleries')
    .upsert({
      id: gallery.id || 'default',
      title: gallery.title,
      videos: gallery.videos,
    });

  if (error) {
    console.error("Error saving video gallery:", error);
    throw error;
  }
}
