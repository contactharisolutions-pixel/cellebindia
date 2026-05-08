import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, image')
    .ilike('title', '%Necklace%');
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

check();
