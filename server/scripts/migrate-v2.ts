import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Starting v2 migration...");

    // Add columns if they don't exist
    await client.query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS slug TEXT,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Published',
      ADD COLUMN IF NOT EXISTS seo JSONB DEFAULT '{}'
    `);

    // Backfill slugs for existing articles based on titles
    const res = await client.query("SELECT id, title FROM articles WHERE slug IS NULL");
    console.log(`Backfilling slugs for ${res.rows.length} articles...`);

    for (let i = 0; i < res.rows.length; i++) {
      const row = res.rows[i];
      const slug = row.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      await client.query("UPDATE articles SET slug = $1 WHERE id = $2", [slug, row.id]);
      if (i % 10 === 0) console.log(`Processed ${i}/${res.rows.length}...`);
    }

    // Set a unique constraint on slug if possible (optional, but good)
    // await client.query("ALTER TABLE articles ADD CONSTRAINT unique_slug UNIQUE (slug)");

    console.log("Migration v2 completed successfully.");
  } catch (err) {
    console.error("Error during migration:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
