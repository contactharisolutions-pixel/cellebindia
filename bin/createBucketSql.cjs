const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    // Check if storage.buckets exists
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('media', 'media', true)
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      CREATE POLICY "public_media_access" 
      ON storage.objects FOR ALL 
      USING (bucket_id = 'media' );
    `);

    console.log("Bucket created successfully via SQL");
  } catch (err) {
    console.error("SQL Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
