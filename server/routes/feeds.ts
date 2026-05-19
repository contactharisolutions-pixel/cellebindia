import { RequestHandler } from "express";
import { getAllArticles, db } from "../lib/storage";

const BASE_URL = "https://www.cellebindia.com";

/** Escape special XML characters in text content */
function xmlEscape(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Static pages that should always be indexed */
const STATIC_PAGES = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/latest", changefreq: "daily", priority: "0.9" },
  { loc: "/whats-hot", changefreq: "daily", priority: "0.9" },
  { loc: "/bollywood", changefreq: "daily", priority: "0.8" },
  { loc: "/pan-india", changefreq: "daily", priority: "0.8" },
  { loc: "/streaming", changefreq: "daily", priority: "0.8" },
  { loc: "/box-office", changefreq: "daily", priority: "0.8" },
  { loc: "/hollywood", changefreq: "daily", priority: "0.8" },
  { loc: "/movie-review", changefreq: "daily", priority: "0.8" },
  { loc: "/trailer", changefreq: "daily", priority: "0.8" },
  { loc: "/tv-serial", changefreq: "daily", priority: "0.8" },
  { loc: "/about", changefreq: "monthly", priority: "0.5" },
  { loc: "/contact", changefreq: "monthly", priority: "0.5" },
  { loc: "/advertise", changefreq: "monthly", priority: "0.5" },
  { loc: "/privacy-policy", changefreq: "monthly", priority: "0.3" },
  { loc: "/terms-of-service", changefreq: "monthly", priority: "0.3" },
  { loc: "/cookies-policy", changefreq: "monthly", priority: "0.3" },
];

export const getSitemap: RequestHandler = async (req, res) => {
  try {
    const { articles } = await getAllArticles();
    const today = new Date().toISOString().split("T")[0];

    let urls = "";

    // ── Static pages ───────────────────────────────────────────────────────────
    for (const page of STATIC_PAGES) {
      urls += `
  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    // ── Category pages (dynamic from DB) ──────────────────────────────────────
    try {
      const { data: categories } = await db.from('categories').select('slug, name');
      for (const cat of (categories || [])) {
        if (cat.slug) {
          urls += `
  <url>
    <loc>${BASE_URL}/category/${cat.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      }
    } catch (e) {
      // categories table may not exist — skip gracefully
    }

    // ── Article pages — use SLUG for SEO-friendly URLs ─────────────────────────
    articles
      .filter((a) => a.status === "Published" && a.slug)
      .forEach((article) => {
        const lastmod = article.date
          ? new Date(article.date).toISOString().split("T")[0]
          : today;
        urls += `
  <url>
    <loc>${BASE_URL}/article/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // cache 1 hour
    res.send(xml);
  } catch (err) {
    console.error("[Sitemap] Error:", err);
    res.status(500).send("Error generating sitemap");
  }
};

export const getRSS: RequestHandler = async (req, res) => {
  try {
    const { articles } = await getAllArticles();

    let items = "";
    articles
      .filter((a) => a.status === "Published" && a.slug)
      .slice(0, 20)
      .forEach((article) => {
        items += `
  <item>
    <title>${xmlEscape(article.title)}</title>
    <link>${BASE_URL}/article/${article.slug}</link>
    <description>${xmlEscape(article.excerpt)}</description>
    <pubDate>${new Date(article.date).toUTCString()}</pubDate>
    <guid isPermaLink="true">${BASE_URL}/article/${article.slug}</guid>
    <category>${xmlEscape(article.category)}</category>
  </item>`;
      });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>CELLEB - The Sparkling World of Stars</title>
  <link>${BASE_URL}</link>
  <description>Your ultimate source for Bollywood, Hollywood, OTT, box office updates and movie reviews.</description>
  <language>en-in</language>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />${items}
</channel>
</rss>`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800");
    res.send(rss);
  } catch (err) {
    console.error("[RSS] Error:", err);
    res.status(500).send("Error generating RSS feed");
  }
};
