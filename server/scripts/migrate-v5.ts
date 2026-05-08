import { db } from "../lib/storage";

async function migrate() {
  console.log("🚀 Starting Ad Management Migration (v5)...");

  try {
    // Create ads table
    await db.query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        slot_name TEXT UNIQUE NOT NULL,
        provider TEXT NOT NULL,
        status TEXT DEFAULT 'Disabled',
        revenue_today DECIMAL(10, 2) DEFAULT 0,
        revenue_month DECIMAL(10, 2) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default ad slots
    const slots = [
      ['Header Banner', 'Google AdSense', 'Enabled', 12.50, 450.20],
      ['Sidebar Square', 'Amazon Associates', 'Enabled', 5.20, 180.40],
      ['In-Content Article', 'Google AdSense', 'Disabled', 0, 0],
      ['Footer Native', 'Taboola', 'Enabled', 8.90, 320.15]
    ];

    for (const [name, provider, status, today, month] of slots) {
      await db.query(`
        INSERT INTO ads (slot_name, provider, status, revenue_today, revenue_month)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slot_name) DO NOTHING
      `, [name, provider, status, today, month]);
    }

    console.log("✅ Ad Management tables created and seeded.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

migrate();
