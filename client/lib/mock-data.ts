export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  author?: string;
  date: string;
  featured?: boolean;
  mediaBlocks?: MediaBlock[];
  relatedArticles?: string[];
}

export interface MediaBlock {
  type: "image" | "video";
  url: string;
  caption?: string;
}

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

const categories = [
  "Bollywood",
  "PAN India",
  "Movie Review",
  "Streaming",
  "TV Serial",
  "Hollywood",
  "Box Office",
  "Trailer Review",
];

export const mockArticles: Article[] = [
  // Featured article
  {
    id: "1",
    title: "Bollywood's Golden Night: Awards Show Highlights and Red Carpet Magic",
    excerpt: "An unforgettable evening celebrating cinema's finest talent with stunning performances and surprise announcements.",
    content: `<p>The prestigious awards ceremony brought together the brightest stars of Bollywood for an evening of glamour and celebration. The red carpet saw stunning fashion moments as celebrities arrived in their finest attire, each making a statement with their style choices.</p><p>The evening featured memorable performances, emotional acceptance speeches, and surprising wins that had the audience on their feet. Industry veterans shared the stage with rising talents, creating magical moments that will be remembered for years to come.</p>`,
    image: demoImages[2],
    category: "Bollywood",
    author: "Team CELLEB",
    date: "2024-01-15",
    featured: true,
    mediaBlocks: [
      {
        type: "image",
        url: demoImages[3],
        caption: "Award winners celebrating their achievements",
      },
      {
        type: "image",
        url: demoImages[8],
        caption: "Elegant moments from the awards ceremony",
      },
    ],
  },

  // More articles for different categories
  ...generateMockArticles("Bollywood", 15),
  ...generateMockArticles("PAN India", 15),
  ...generateMockArticles("Movie Review", 15),
  ...generateMockArticles("Streaming", 15),
  ...generateMockArticles("TV Serial", 15),
  ...generateMockArticles("Hollywood", 15),
  ...generateMockArticles("Box Office", 15),
  ...generateMockArticles("Trailer Review", 15),
];

function generateMockArticles(category: string, count: number): Article[] {
  const titles: Record<string, string[]> = {
    Bollywood: [
      "Deepika Padukone's latest project breaks box office records",
      "Shah Rukh Khan announces upcoming romantic drama",
      "Alia Bhatt stuns in new photoshoot",
      "Behind the scenes of blockbuster film production",
      "Top 10 Bollywood actors to watch in 2024",
      "Priyanka Chopra returns to Indian cinema",
      "Ranbir Kapoor's career-defining role",
      "Katrina Kaif celebrates anniversary milestone",
      "New age of Bollywood storytelling begins",
      "Bollywood's youngest sensation breaks records",
      "Industry veterans mentor new generation",
      "Kareena Kapoor Khan's style evolution",
      "Akshay Kumar's action thriller gets rave reviews",
      "Love story of the year announced",
      "Bollywood families unite for charity event",
    ],
    "PAN India": [
      "Prabhas and Anushka Shetty reunite for mega project",
      "Tamil cinema's biggest release this year",
      "Kannada films gain international recognition",
      "Telugu hero breaks into mainstream cinema",
      "South Indian cinema dominates box office",
      "Malayalam film wins prestigious award",
      "Regional cinema's global expansion",
      "Tamil superstar's comeback announcement",
      "Telugu director signs big Bollywood deal",
      "PAN India collaboration brings stars together",
      "South Indian cinema's evolution continues",
      "Record-breaking collections for regional film",
      "Multilingual project unites industries",
      "South star's Hollywood debut confirmed",
      "Regional cinema overtakes Bollywood earnings",
    ],
    "Movie Review": [
      "Latest action thriller gets 4 stars",
      "Family drama wins hearts at box office",
      "Experimental film pushes boundaries",
      "Superhero film redefines the genre",
      "Romantic drama exceeds expectations",
      "Dark thriller keeps audience on edge",
      "Comedy film brings laughter to masses",
      "Historical drama impresses critics",
      "Crime thriller unravels mystery",
      "Love story touches hearts",
      "Adventure film delivers spectacle",
      "Biopic honors legendary figure",
      "Psychological thriller bewilders audience",
      "Fantasy film creates magical world",
      "Drama film makes social impact",
    ],
    Streaming: [
      "New series breaks streaming records",
      "Limited series finale leaves audience speechless",
      "Streaming giant announces next big project",
      "Celebrity series gets greenlit for second season",
      "Documentary series reveals untold stories",
      "Crime thriller dominates streaming charts",
      "Comedy series becomes cultural phenomenon",
      "International collaboration comes to platform",
      "Exclusive content deals announced",
      "Original series wins international awards",
      "Streaming wars intensify with new releases",
      "Binge-worthy series of the month revealed",
      "Reality show casts announced",
      "Special series event breaks records",
      "Behind-the-scenes series explores creativity",
    ],
    "TV Serial": [
      "Long-running serial reaches milestone episode",
      "TV couple's on-screen chemistry wins fans",
      "New serial brings fresh storytelling",
      "Daytime drama takes unexpected turn",
      "Prime time serial tops ratings",
      "TV serial crossover creates buzz",
      "Child actor becomes household name",
      "TV serial renewal announced for next season",
      "Serial's villain steals the show",
      "Emotional episode leaves viewers in tears",
      "TV serial wins best drama award",
      "Cast of serial celebrates on-screen wedding",
      "New storyline divides serial fans",
      "TV serial's set design wins recognition",
      "Serial's opening theme becomes trendy",
    ],
    Hollywood: [
      "Oscar contender releases first trailer",
      "Superhero film dominates worldwide box office",
      "A-list couple reunites for romantic film",
      "Hollywood legend announces farewell project",
      "Fantasy epic breaks attendance records",
      "Sci-fi thriller explores future world",
      "Hollywood director wins international acclaim",
      "Blockbuster franchise announces new installment",
      "Award season begins with stellar releases",
      "Action star brings iconic character back",
      "Comedy film becomes instant classic",
      "Drama explores complex human relationships",
      "Animation studio creates stunning world",
      "Documentary uncovers Hollywood secrets",
      "International film breaks into Hollywood",
    ],
    "Box Office": [
      "Weekend box office hits record numbers",
      "Summer blockbuster shatters opening records",
      "Family film dominates charts for third week",
      "Horror flick surprises with strong performance",
      "Indie film unexpectedly breaks into top 10",
      "Action sequel maintains box office crown",
      "Drama film wins over critics and audiences",
      "Animated feature captures family audiences",
      "Box office update: biggest gainers revealed",
      "International film breaks domestic records",
      "Re-release of classic film draws crowds",
      "Holiday film becomes Christmas sensation",
      "Box office forecast: upcoming releases preview",
      "Sleeper hit rises to box office glory",
      "Box office battle: franchises clash this weekend",
    ],
    "Trailer Review": [
      "Highly anticipated trailer exceeds expectations",
      "Action film trailer sets new standards",
      "Romantic comedy teaser goes viral",
      "Superhero movie trailer drops with excitement",
      "Horror film preview terrifies and intrigues",
      "Drama series first look releases worldwide",
      "Sci-fi epic trailer showcases stunning visuals",
      "Official trailer for blockbuster finally here",
      "Exclusive behind-the-scenes footage revealed",
      "Animated film trailer delights audiences",
      "Thriller teaser keeps secrets intact",
      "Musical drama trailer showcases performances",
      "Franchise sequel trailer hypes fanbase",
      "International film trailer gets worldwide release",
      "Director's cut trailer offers extended footage",
    ],
  };

  const articles: Article[] = [];
  const categoryTitles = titles[category] || titles.Bollywood;

  for (let i = 0; i < Math.min(count, categoryTitles.length); i++) {
    articles.push({
      id: `${category}-${i}`,
      title: categoryTitles[i % categoryTitles.length],
      excerpt: `Exclusive coverage and latest updates on ${category}. Dive into the world of entertainment with in-depth analysis and breaking news.`,
      content: `<p>Discover the latest developments in ${category}. Our team brings you exclusive interviews, behind-the-scenes insights, and comprehensive coverage of all major events.</p>`,
      image: demoImages[(i + Math.floor(Math.random() * demoImages.length)) % demoImages.length],
      category,
      author: "Team CELLEB",
      date: new Date(
        2024,
        0,
        Math.max(1, 15 - Math.floor(i / 3))
      ).toISOString().split("T")[0],
    });
  }

  return articles;
}

export function getArticleById(id: string): Article | undefined {
  return mockArticles.find((article) => article.id === id);
}

export function getArticlesByCategory(category: string): Article[] {
  return mockArticles.filter((article) => article.category === category);
}

export function getFeaturedArticle(): Article | undefined {
  return mockArticles.find((article) => article.featured);
}

export function getTopStoriesStrip(): Article[] {
  return mockArticles.slice(1, 6);
}

export function getLatestArticles(limit: number = 20): Article[] {
  return mockArticles
    .filter((article) => !article.featured)
    .slice(0, limit);
}
