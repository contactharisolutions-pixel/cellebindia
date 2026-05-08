import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDb() {
  const client = await pool.connect();
  try {
    console.log("Initializing database...");
    
    // Create articles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL,
        date TEXT NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        media_blocks JSONB DEFAULT '[]',
        related_articles JSONB DEFAULT '[]'
      )
    `);

    console.log("Table 'articles' ensured.");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();
