import { db } from "../lib/storage";

async function test() {
  const query = `
    SELECT a.*, array_agg(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
    FROM articles a
    LEFT JOIN article_tags at ON a.id = at.article_id
    LEFT JOIN tags t ON at.tag_id = t.id
    GROUP BY a.id
    ORDER BY a.date DESC
  `;
  try {
    const res = await db.query(query);
    console.log("Success! Rows:", res.rows.length);
  } catch (err) {
    console.error("Error detected:");
    console.error(err);
  } finally {
    process.exit(0);
  }
}

test();
