import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fileName = '1777253455106-5 (2).webp';
const filePath = path.join(process.cwd(), 'uploads', fileName);

async function fix() {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }

  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  const dataUrl = `data:image/webp;base64,${base64}`;

  const localUrl = `/uploads/${fileName}`;
  
  console.log(`Updating article image to Base64 for: ${localUrl}`);

  const { error } = await supabase
    .from('articles')
    .update({ image: dataUrl })
    .eq('image', localUrl);

  if (error) {
    console.error('Update failed:', error.message);
  } else {
    console.log('Update successful! Image now embedded in DB.');
  }
}

fix();
