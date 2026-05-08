import { db } from "../lib/storage";

async function read() {
  try {
    console.log("--- articles ---");
    const art = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'articles'");
    console.log(JSON.stringify(art.rows, null, 2));

    console.log("--- tags ---");
    const tags = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tags'");
    console.log(JSON.stringify(tags.rows, null, 2));

    console.log("--- article_tags ---");
    const at = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'article_tags'");
    console.log(JSON.stringify(at.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

read();
