import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const BUCKET_NAME = 'media';

async function migrate() {
  console.log('Starting migration of local uploads to Supabase Storage...');

  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log('Uploads directory not found. Skipping.');
    return;
  }

  const files = fs.readdirSync(UPLOADS_DIR);
  console.log(`Found ${files.length} files to migrate.`);

  for (const file of files) {
    const filePath = path.join(UPLOADS_DIR, file);
    if (!fs.statSync(filePath).isFile()) continue;

    console.log(`Uploading ${file}...`);
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type
    let contentType = 'image/jpeg';
    if (file.endsWith('.webp')) contentType = 'image/webp';
    if (file.endsWith('.png')) contentType = 'image/png';

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(file, fileBuffer, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      console.error(`Failed to upload ${file}:`, uploadError.message);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(file);

    console.log(`Successfully uploaded ${file}. Public URL: ${publicUrl}`);

    // Update database
    const localUrl = `/uploads/${file}`;
    
    // Update articles images
    const { error: articleError } = await supabase
      .from('articles')
      .update({ image: publicUrl })
      .eq('image', localUrl);

    if (articleError) console.error(`Error updating articles for ${file}:`, articleError.message);

    // Update articles SEO images
    // Note: SEO is a JSON object, might need more complex update if stored there
    
    // Update media records
    const { error: mediaError } = await supabase
      .from('media')
      .update({ url: publicUrl, metadata: { storage: 'supabase', migrated: true } })
      .eq('url', localUrl);

    if (mediaError) console.error(`Error updating media records for ${file}:`, mediaError.message);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
