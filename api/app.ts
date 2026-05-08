import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import { handleDemo } from "../server/routes/demo";
import { 
  getArticles, 
  getArticleById, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from "../server/routes/articles";
import { getMedia, uploadMedia, deleteMedia } from "../server/routes/media";
import { getSitemap, getRSS } from "../server/routes/feeds";
import { getAnalytics } from "../server/routes/analytics";
import { generateContent } from "../server/routes/ai";
import { getAds, updateAdStatus, getMonetizationStats } from "../server/routes/ads";
import { getAuditLogs } from "../server/routes/security";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../server/routes/categories";
import { getTags, createTag, updateTag, deleteTag } from "../server/routes/tags";
import { getComments, updateCommentStatus, deleteComment } from "../server/routes/comments";
import { getUsers, createUser, updateUser, deleteUser } from "../server/routes/users";
import { getNotifications, markAsRead, deleteNotification, createNotification } from "../server/routes/notifications";
import { getIntegrations, createIntegration, updateIntegration, deleteIntegration } from "../server/routes/integrations";
import { getGalleries, createGallery, updateGallery, deleteGallery } from "../server/routes/galleries";
import { getVideos, updateVideoGallery } from "../server/routes/video-galleries";

export function createServer() {
  try {
    const uploadDir = process.env.VERCEL ? "/tmp/uploads" : path.join(process.cwd(), "uploads");
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (e) {
      console.warn("Failsystem init warning:", e);
    }

    const app = express();

    const storage = multer.memoryStorage();
    const upload = multer({ 
      storage,
      limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
    });

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use((req, _res, next) => {
      console.log(`[${req.method}] ${req.url}`);
      next();
    });
    
    app.use("/uploads", express.static(uploadDir));

    // API routes
    app.get("/api/ping", (_req, res) => {
      const ping = process.env.PING_MESSAGE ?? "ping";
      res.json({ message: ping });
    });

    app.get("/api/demo", handleDemo);

    app.get("/api/health", (_req, res) => {
      res.json({ 
        status: "ok", 
        env: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        db_connected: !!process.env.DATABASE_URL,
        supabase_connected: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
      });
    });
    
    // Article routes
    app.get("/api/articles", getArticles);
    app.get("/api/articles/:id", getArticleById);
    app.post("/api/articles", createArticle);
    app.patch("/api/articles/:id", updateArticle);
    app.delete("/api/articles/:id", deleteArticle);

    // Category routes
    app.get("/api/categories", getCategories);
    app.post("/api/categories", createCategory);
    app.patch("/api/categories/:id", updateCategory);
    app.delete("/api/categories/:id", deleteCategory);

    // Tag routes
    app.get("/api/tags", getTags);
    app.post("/api/tags", createTag);
    app.patch("/api/tags/:id", updateTag);
    app.delete("/api/tags/:id", deleteTag);

    // Comment routes
    app.get("/api/comments", getComments);
    app.patch("/api/comments/:id", updateCommentStatus);
    app.delete("/api/comments/:id", deleteComment);

    // User routes
    app.get("/api/users", getUsers);
    app.post("/api/users", createUser);
    app.patch("/api/users/:id", updateUser);
    app.delete("/api/users/:id", deleteUser);

    // Notification routes
    app.get("/api/notifications", getNotifications);
    app.post("/api/notifications", createNotification);
    app.patch("/api/notifications/:id", markAsRead);
    app.delete("/api/notifications/:id", deleteNotification);

    // Integration routes
    app.get("/api/integrations", getIntegrations);
    app.post("/api/integrations", createIntegration);
    app.patch("/api/integrations/:id", updateIntegration);
    app.delete("/api/integrations/:id", deleteIntegration);

    // Media routes
    app.get("/api/media", getMedia);
    app.post("/api/media", upload.single("file"), uploadMedia);
    app.delete("/api/media/:id", deleteMedia);

    // SEO Feeds
    app.get("/sitemap.xml", getSitemap);
    app.get("/rss.xml", getRSS);

    // Analytics
    app.get("/api/analytics", getAnalytics);

    // AI assistant
    app.post("/api/ai/generate", generateContent);

    // Monetization
    app.get("/api/ads", getAds);
    app.patch("/api/ads/:id", updateAdStatus);
    app.get("/api/monetization/stats", getMonetizationStats);

    // Security
    app.get("/api/security/audit", getAuditLogs);

    // Gallery routes
    app.get("/api/galleries", getGalleries);
    app.post("/api/galleries", createGallery);
    app.patch("/api/galleries/:id", updateGallery);
    app.delete("/api/galleries/:id", deleteGallery);

    // Video Gallery routes
    app.get("/api/video-gallery", getVideos);
    app.post("/api/video-gallery", updateVideoGallery);

    return app;
  } catch (error) {
    console.error("CRITICAL: Failed to create Express server:", error);
    throw error;
  }
}

export default createServer();
