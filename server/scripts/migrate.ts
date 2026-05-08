import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Starting full schema migration...");

    // Articles
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
        seo JSONB DEFAULT '{}',
        scheduled_date TEXT
      )
    `);
    console.log("Table 'articles' ensured.");

    // Tags
    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE
      )
    `);
    console.log("Table 'tags' ensured.");

    // Article Tags (Link table)
    await client.query(`
      CREATE TABLE IF NOT EXISTS article_tags (
        article_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        PRIMARY KEY (article_id, tag_id)
      )
    `);
    console.log("Table 'article_tags' ensured.");

    // Media
    await client.query(`
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        filename TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size INTEGER NOT NULL,
        width INTEGER,
        height INTEGER,
        alt_text TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'media' ensured.");

    // Audit Logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        module TEXT NOT NULL,
        target_id TEXT,
        user_name TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'audit_logs' ensured.");

    // Categories (if needed, but usually stored in articles.category)
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT
      )
    `);
    console.log("Table 'categories' ensured.");

    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
