const { execSync } = require('child_process');

const envs = {
  DATABASE_URL: 'postgresql://postgres:Life@20242526@db.bzknuowxkewtjatabsmt.supabase.co:5432/postgres',
  SUPABASE_URL: 'https://bzknuowxkewtjatabsmt.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_n85JCh1OkuHDlHwGfLpzxg__O048RTI',
  PING_MESSAGE: 'ping pong'
};

for (const [key, value] of Object.entries(envs)) {
  try {
    console.log(`Adding ${key}...`);
    // Echo value to stdin for 'vercel env add'
    execSync(`echo "${value}" | npx vercel env add ${key} production`, { stdio: 'inherit' });
    execSync(`echo "${value}" | npx vercel env add ${key} preview`, { stdio: 'inherit' });
    execSync(`echo "${value}" | npx vercel env add ${key} development`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to add ${key}: ${err.message}`);
  }
}
