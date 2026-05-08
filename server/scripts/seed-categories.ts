import { db } from "../lib/storage";

const categories = [
  { name: "Bollywood", description: "All the latest from the world of Hindi Cinema." },
  { name: "PAN India", description: "Cross-regional cinematic excellence from across the country." },
  { name: "Movie Review", description: "Critical analysis and ratings for the latest releases." },
  { name: "Streaming", description: "OTT shifts, digital premiers, and binge-worthy content." },
  { name: "TV Serial", description: "Daily soaps, reality shows, and television updates." },
  { name: "Hollywood", description: "Global blockbusters and international entertainment news." },
  { name: "Box Office", description: "Revenue tracking and collection reports." },
  { name: "Trailer Review", description: "First looks and teaser analysis." },
];

async function seed() {
  console.log("🚀 Seeding CELLEB Taxonomy...");

  try {
    // Clear existing categories
    await db.query("DELETE FROM categories");
    
    for (const cat of categories) {
      const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await db.query(
        "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3)",
        [cat.name, slug, cat.description]
      );
      console.log(`✅ Seeded: ${cat.name}`);
    }

    console.log("🌟 Taxonomy Seeding Complete.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
