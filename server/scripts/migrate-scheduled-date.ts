import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Starting migration: adding scheduled_date to articles...");
    await client.query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS scheduled_date TEXT;
    `);
    console.log("Successfully added scheduled_date column.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
