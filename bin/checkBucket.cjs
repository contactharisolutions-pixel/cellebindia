require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function checkBucket() {
  const { data, error } = await supabase.storage.getBucket('media');
  console.log('Bucket check result:', data ? "Exists" : "Not found", error);
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('All buckets:', buckets ? buckets.map(b => b.name) : []);
}
checkBucket();
