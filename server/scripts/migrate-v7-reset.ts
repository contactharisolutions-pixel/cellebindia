import { db } from "../lib/storage";

async function migrate() {
  console.log("🚀 Hard Resetting Taxonomy Schema with Junctions...");

  try {
    await db.query("DROP TABLE IF EXISTS article_tags CASCADE");
    await db.query("DROP TABLE IF EXISTS categories CASCADE");
    await db.query("DROP TABLE IF EXISTS tags CASCADE");

    await db.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Junction table for Tag and Article association
    await db.query(`
      CREATE TABLE article_tags (
        article_id TEXT NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Taxonomy tables (categories, tags, article_tags) hard reset successfully.");
  } catch (err) {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

migrate();
