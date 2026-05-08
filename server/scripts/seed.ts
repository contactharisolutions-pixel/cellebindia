import fs from "fs/promises";
import path from "path";
import { Article, MediaBlock } from "../../shared/api.js";

const demoImages = [
  "https://images.pexels.com/photos/16324983/pexels-photo-16324983.jpeg",
  "https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg",
  "https://images.pexels.com/photos/7005622/pexels-photo-7005622.jpeg",
  "https://images.pexels.com/photos/7005636/pexels-photo-7005636.jpeg",
  "https://images.pexels.com/photos/7865064/pexels-photo-7865064.jpeg",
  "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
  "https://images.pexels.com/photos/5202917/pexels-photo-5202917.jpeg",
  "https://images.pexels.com/photos/4218027/pexels-photo-4218027.jpeg",
  "https://images.pexels.com/photos/2333719/pexels-photo-2333719.jpeg",
  "https://images.pexels.com/photos/14598059/pexels-photo-14598059.jpeg",
  "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg",
  "https://images.pexels.com/photos/18238117/pexels-photo-18238117.jpeg",
];

const titles: Record<string, string[]> = {
  Bollywood: [
    "Deepika Padukone's latest project breaks box office records",
    "Shah Rukh Khan announces upcoming romantic drama",
    "Alia Bhatt stuns in new photoshoot",
    "Behind the scenes of blockbuster film production",
  ],
  "PAN India": [
    "Prabhas and Anushka Shetty reunite for mega project",
    "Tamil cinema's biggest release this year",
    "Kannada films gain international recognition",
  ],
  "Movie Review": [
    "Latest action thriller gets 4 stars",
    "Family drama wins hearts at box office",
  ],
  Streaming: [
    "New series breaks streaming records",
    "Limited series finale leaves audience speechless",
  ],
  "TV Serial": [
    "Long-running serial reaches milestone episode",
    "TV couple's on-screen chemistry wins fans",
  ],
  Hollywood: [
    "Oscar contender releases first trailer",
    "Superhero film dominates worldwide box office",
  ],
  "Box Office": [
    "Weekend box office hits record numbers",
    "Summer blockbuster shatters opening records",
  ],
  "Trailer Review": [
    "Highly anticipated trailer exceeds expectations",
    "Action film trailer sets new standards",
  ],
};

function generateMockArticles(category: string, count: number): Article[] {
  const articles: Article[] = [];
  const categoryTitles = titles[category] || titles.Bollywood;

  for (let i = 0; i < Math.min(count, categoryTitles.length); i++) {
    articles.push({
      id: `${category.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      slug: categoryTitles[i].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      title: categoryTitles[i],
      excerpt: `Exclusive coverage and latest updates on ${category}.`,
      content: `<p>Discover the latest developments in ${category}. Our team brings you exclusive interviews, behind-the-scenes insights, and comprehensive coverage of all major events.</p>`,
      image: demoImages[i % demoImages.length],
      category,
      author: "Team CELLEB",
      date: new Date().toISOString().split("T")[0],
      featured: i === 0 && category === "Bollywood",
      status: "Published",
      mediaBlocks: [],
      relatedArticles: [],
      tags: [],
    });
  }

  return articles;
}

const articles: Article[] = Object.keys(titles).flatMap(cat => generateMockArticles(cat, 10));

const db = { articles };

const DB_PATH = path.join(process.cwd(), "server", "db.json");
await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
console.log("Database seeded successfully!");
