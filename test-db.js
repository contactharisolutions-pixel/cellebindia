import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: '3.108.251.216',
  port: 5432,
  database: 'postgres',
  user: 'postgres.bzknuowxkewtjatabsmt',
  password: 'Life@20242526',
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    const res = await pool.query('SELECT COUNT(*) FROM articles');
    console.log('SUCCESS:', res.rows[0]);
  } catch (err) {
    console.error('FAILURE:', err.message);
  } finally {
    await pool.end();
  }
}

test();
