import { db } from "../lib/storage";

async function migrate() {
  console.log("🚀 Starting Security & Compliance Migration (v6)...");

  try {
    // Create audit_logs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        module TEXT NOT NULL,
        target_id TEXT,
        user_name TEXT DEFAULT 'Vinay Admin',
        ip_address TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add role to users (if we had a users table, let's assume we use it for RBAC)
    // For this mock, we'll just log activity
    
    await db.query(`
      INSERT INTO audit_logs (action, module, target_id, user_name)
      VALUES 
        ('System Initialize', 'Security', '0', 'System'),
        ('Migration v6 Executed', 'Database', '0', 'Vinay Admin')
    `);

    console.log("✅ Security & Audit tables created.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

migrate();
