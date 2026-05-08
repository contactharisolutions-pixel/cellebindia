import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Starting v3 migration (Media Library)...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        filename TEXT NOT NULL,
        mimetype TEXT,
        size INTEGER,
        width INTEGER,
        height INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        alt_text TEXT,
        metadata JSONB DEFAULT '{}'
      )
    `);

    console.log("Migration v3 completed successfully.");
  } catch (err) {
    console.error("Error during migration:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
