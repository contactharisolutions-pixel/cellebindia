const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function sync() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();

  const { rows } = await pg.query('SELECT * FROM media WHERE url LIKE \'/uploads/%\'');
  console.log(`Found ${rows.length} local images to migrate to Supabase.`);

  for (const row of rows) {
    const filePath = path.join(__dirname, '..', ...row.url.split('/'));
    if (fs.existsSync(filePath)) {
      console.log('Uploading', row.filename);
      const buffer = fs.readFileSync(filePath);
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(row.filename, buffer, {
          contentType: row.mimetype,
          upsert: true
        });

      if (error) {
        console.error('Failed to upload', row.filename, error.message);
      } else {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(row.filename);
        await pg.query('UPDATE media SET url = $1, metadata = $2 WHERE id = $3', [
          publicUrl, 
          {...row.metadata, storage: 'supabase', migrated: true}, 
          row.id
        ]);
        console.log('Migrated', row.filename, 'to', publicUrl);
      }
    } else {
      console.log('File missing locally:', filePath);
    }
  }

  await pg.end();
}

sync();
