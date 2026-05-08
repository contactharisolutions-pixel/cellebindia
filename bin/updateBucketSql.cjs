const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    await client.query(`
      DROP POLICY IF EXISTS "public_media_access" ON storage.objects;
      CREATE POLICY "public_media_access" 
      ON storage.objects FOR ALL 
      USING (bucket_id = 'media')
      WITH CHECK (bucket_id = 'media');
    `);

    console.log("Bucket policy updated successfully via SQL");
  } catch (err) {
    console.error("SQL Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
