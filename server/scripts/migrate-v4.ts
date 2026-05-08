import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Starting v4 migration (Taxonomy)...");

    // Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        parent_id TEXT REFERENCES categories(id)
      )
    `);

    // Tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE
      )
    `);

    // Junction table for Article-Tag
    await client.query(`
      CREATE TABLE IF NOT EXISTS article_tags (
        article_id TEXT REFERENCES articles(id) ON DELETE CASCADE,
        tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (article_id, tag_id)
      )
    `);

    console.log("Migration v4 completed successfully.");
  } catch (err) {
    console.error("Error during migration:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
