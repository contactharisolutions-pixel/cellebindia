import pg from "pg";
import "dotenv/config";
import { Article, MediaBlock } from "../../shared/api.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const demoImages = [
  "https://images.pexels.com/photos/16324983/pexels-photo-16324983.jpeg",
  "https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg",
  "https://images.pexels.com/photos/7005622/pexels-photo-7005622.jpeg",
  "https://images.pexels.com/photos/7005636/pexels-photo-7005636.jpeg",
  "https://images.pexels.com/photos/7865064/pexels-photo-7865064.jpeg",
  "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
  "https://images.pexels.com/photos/5202917/pexels-photo-5202917.jpeg",
  "https://images.pexels.com/photos/4218027/pexels-photo-4218027.jpeg",
  "https://images.pexels.com/photos/2333719/pexels-photo-2333719.jpeg",
  "https://images.pexels.com/photos/14598059/pexels-photo-14598059.jpeg",
  "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg",
  "https://images.pexels.com/photos/18238117/pexels-photo-18238117.jpeg",
];

const categories = [
  "Bollywood",
  "PAN India",
  "Movie Review",
  "Streaming",
  "TV Serial",
  "Hollywood",
  "Box Office",
  "Trailer Review",
];

function generateMockArticles(category: string, count: number): Article[] {
  const articles: Article[] = [];
  for (let i = 0; i < count; i++) {
    articles.push({
      id: `${category.toLowerCase().replace(/\s+/g, '-')}-${i}-${Date.now()}`,
      slug: `${category.toLowerCase().replace(/\s+/g, '-')}-buzz-${i + 1}`,
      title: `${category} Highlight: The latest buzz in the industry - Story ${i + 1}`,
      excerpt: `An exclusive look at what's happening in the world of ${category}. We bring you the latest updates and behind-the-scenes stories.`,
      content: `<p>This is the detailed content for the ${category} story. We explore the nuances and the impact of recent developments on the industry.</p><p>Stay tuned for more updates on this story as it unfolds.</p>`,
      image: demoImages[(i + Math.floor(Math.random() * demoImages.length)) % demoImages.length],
      category,
      author: "Team CELLEB",
      date: new Date().toISOString().split("T")[0],
      featured: i === 0 && category === "Bollywood", // Set one featured article
      status: "Published",
      mediaBlocks: [
        { type: "image", url: demoImages[(i + 1) % demoImages.length], caption: "Capturing the moment" }
      ],
      relatedArticles: [],
      tags: [],
      seo: {
        metaTitle: `${category} Buzz - Story ${i + 1}`,
        metaDescription: `Read about ${category} latest highlight and industry buzz.`
      }
    });
  }
  return articles;
}

async function setupDb() {
  const client = await pool.connect();
  try {
    console.log("Starting DB setup...");

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        slug TEXT,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL,
        date TEXT NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        status TEXT DEFAULT 'Published',
        media_blocks JSONB DEFAULT '[]',
        related_articles JSONB DEFAULT '[]',
        seo JSONB DEFAULT '{}'
      )
    `);
    console.log("Table 'articles' ensured.");

    // Clear existing data (optional, but good for a fresh start during setup)
    await client.query("DELETE FROM articles");
    console.log("Existing articles cleared.");

    // Generate and Insert Initial Data
    const allMockArticles: Article[] = [];
    categories.forEach(cat => {
      allMockArticles.push(...generateMockArticles(cat, 12)); // 12 articles per category
    });

    for (const article of allMockArticles) {
      const query = `
        INSERT INTO articles (id, slug, title, excerpt, content, image, category, author, date, featured, status, media_blocks, related_articles, seo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `;
      await client.query(query, [
        article.id,
        article.slug,
        article.title,
        article.excerpt,
        article.content,
        article.image,
        article.category,
        article.author,
        article.date,
        article.featured,
        article.status,
        JSON.stringify(article.mediaBlocks),
        JSON.stringify(article.relatedArticles),
        JSON.stringify(article.seo || {}),
      ]);
    }

    console.log(`Successfully seeded ${allMockArticles.length} articles.`);
  } catch (err) {
    console.error("Error setting up DB:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDb();
