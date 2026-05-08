import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fileName = '1777199041844-73994991.png';
const filePath = path.join(process.cwd(), 'uploads', fileName);

async function fix() {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }

  console.log(`Optimizing and converting ${fileName} to Base64...`);
  
  const optimizedBuffer = await sharp(filePath)
    .resize(1000)
    .webp({ quality: 75 })
    .toBuffer();

  const base64 = optimizedBuffer.toString('base64');
  const dataUrl = `data:image/webp;base64,${base64}`;

  const localUrl = `/uploads/${fileName}`;
  
  console.log(`Updating article image to Optimized Base64 for: ${localUrl}`);

  const { error } = await supabase
    .from('articles')
    .update({ image: dataUrl })
    .eq('image', localUrl);

  if (error) {
    console.error('Update failed:', error.message);
  } else {
    console.log('Update successful! Large image now optimized and embedded.');
  }
}

fix();
