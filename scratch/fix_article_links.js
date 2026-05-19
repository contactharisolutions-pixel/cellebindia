const fs = require('fs');

const files = [
  'client/pages/Index.tsx',
  'client/components/TopStoryCard.tsx',
  'client/components/TopStoriesStrip.tsx',
  'client/components/LatestFeed.tsx',
  'client/components/HeroSection.tsx',
  'client/components/CategorySection.tsx',
  'client/components/ArticleCard.tsx',
];

const OLD = '/article/${article.id}';
const NEW = '/article/${article.slug || article.id}';

files.forEach(f => {
  try {
    let c = fs.readFileSync(f, 'utf8');
    if (c.includes(OLD)) {
      const newC = c.split(OLD).join(NEW);
      fs.writeFileSync(f, newC);
      console.log('Fixed:', f);
    } else {
      console.log('No match:', f);
    }
  } catch(e) {
    console.log('Skip:', f, e.message);
  }
});
