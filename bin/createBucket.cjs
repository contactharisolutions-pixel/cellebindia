require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function create() {
  const { data, error } = await supabase.storage.createBucket('media', { public: true });
  console.log('Result:', data, error);
}
create();
