import { RequestHandler } from "express";
import { getAllArticles } from "../lib/storage";

export const getSitemap: RequestHandler = async (req, res) => {
  const { articles } = await getAllArticles();
  const baseUrl = "https://www.cellebindia.com"; // Updated to new domain

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  articles.filter(a => a.status === "Published").forEach(article => {
    xml += `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${article.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
};

export const getRSS: RequestHandler = async (req, res) => {
  const { articles } = await getAllArticles();
  const baseUrl = "https://www.cellebindia.com";

  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>CELLEB - Enterprise Blogging Platform</title>
  <link>${baseUrl}</link>
  <description>The latest news and insights from CELLEB</description>`;

  articles.filter(a => a.status === "Published").slice(0, 20).forEach(article => {
    rss += `
  <item>
    <title>${article.title}</title>
    <link>${baseUrl}/article/${article.slug}</link>
    <description>${article.excerpt}</description>
    <pubDate>${new Date(article.date).toUTCString()}</pubDate>
    <guid>${baseUrl}/article/${article.slug}</guid>
  </item>`;
  });

  rss += `
</channel>
</rss>`;

  res.header("Content-Type", "application/xml");
  res.send(rss);
};
