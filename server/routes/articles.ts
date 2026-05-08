import { RequestHandler } from "express";
import { 
  getAllArticles, 
  getArticleById as getArticle, 
  saveArticle, 
  deleteArticleRow 
} from "../lib/storage";
import { logAction } from "../lib/audit";
import { Article } from "../../shared/api";

export const getArticles: RequestHandler = async (req, res) => {
  try {
    const categoryQuery = req.query.category as string;
    const featuredQuery = req.query.featured === "true";
    const whatsHotQuery = req.query.whatsHot === "true";
    const limitQuery = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offsetQuery = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const statusQuery = req.query.status as string;
    const isAdmin = req.query.admin === "true";
    
    // Fetch from DB with category filter and pagination if provided
    // Note: status filtering still happens in memory for complex scheduled logic, 
    // or we could move it to DB for better performance if simplified.
    const result = await getAllArticles({ 
      category: categoryQuery,
      whatsHot: whatsHotQuery,
      limit: limitQuery,
      offset: offsetQuery
    });

    let articles = result.articles;

    // Secondary filtering (Status & Featured)
    if (!isAdmin && !statusQuery) {
      const now = new Date();
      articles = articles.filter(a => {
        if (a.status === "Published") return true;
        if (a.status === "Scheduled" && a.scheduledDate) {
          return new Date(a.scheduledDate) <= now;
        }
        return false;
      });
    } else if (statusQuery) {
      articles = articles.filter(a => a.status === statusQuery);
    }

    if (featuredQuery) {
      articles = articles.filter(a => a.featured);
    }

    res.json({ articles, total: result.total });
  } catch (error) {
    console.error("API Error [getArticles]:", error);
    res.status(500).json({ articles: [], total: 0, error: "Internal Server Error" });
  }
};

export const getArticleById: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const article = await getArticle(id);
  
  if (!article) {
    res.status(404).json({ message: "Article not found" });
    return;
  }

  res.json(article);
};

export const createArticle: RequestHandler = async (req, res) => {
  const articleData = req.body;
  
  const newArticle: Article = {
    ...articleData,
    id: `article-${Date.now()}`,
    slug: articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    date: new Date().toISOString().split("T")[0],
    status: articleData.status || "Draft",
    mediaBlocks: articleData.mediaBlocks || [],
    relatedArticles: articleData.relatedArticles || [],
    seo: articleData.seo || {},
  };

  await saveArticle(newArticle);
  await logAction("Created Article", "CMS", newArticle.id);
  res.status(201).json(newArticle);
};

export const updateArticle: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const updateData = req.body;
  
  const existing = await getArticle(id);
  if (!existing) {
    res.status(404).json({ message: "Article not found" });
    return;
  }

  const updatedArticle: Article = { ...existing, ...updateData };
  await saveArticle(updatedArticle);
  await logAction("Updated Article", "CMS", updatedArticle.id);
  res.json(updatedArticle);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const deleted = await deleteArticleRow(id);
  
  if (!deleted) {
    res.status(404).json({ message: "Article not found" });
    return;
  }

  await logAction("Deleted Article", "CMS", id);
  res.status(204).send();
};
