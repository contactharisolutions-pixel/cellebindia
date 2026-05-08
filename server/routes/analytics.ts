import { RequestHandler } from "express";
import { getAllArticles } from "../lib/storage";

export const getAnalytics: RequestHandler = async (req, res) => {
  let articles = [];
  try {
    const result = await getAllArticles();
    articles = result.articles || [];
  } catch (error) {
    console.error("Analytics: Failed to fetch articles from storage, using mock data fallback.", error);
  }
  
  // Real-time Mock KPI tracking
  const totalViews = 125430;
  const avgSession = "4m 12s";
  const bounceRate = "32.5%";
  const activeNow = Math.floor(Math.random() * 50) + 10;

  // Monthly views data (last 7 months)
  const monthlyViews = [
    { name: 'Jan', views: 4000, engagement: 2400 },
    { name: 'Feb', views: 3000, engagement: 1398 },
    { name: 'Mar', views: 2000, engagement: 9800 },
    { name: 'Apr', views: 2780, engagement: 3908 },
    { name: 'May', views: 1890, engagement: 4800 },
    { name: 'Jun', views: 2390, engagement: 3800 },
    { name: 'Jul', views: 3490, engagement: 4300 },
  ];

  // Daily views data (last 7 days)
  const dailyViews = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      views: Math.floor(Math.random() * 5000) + 1000,
    };
  });

  // Top Articles based on "views" (Mocked)
  const topArticles = articles
    .filter(a => a.status === "Published")
    .slice(0, 5)
    .map(a => ({
      id: a.id,
      title: a.title,
      views: Math.floor(Math.random() * 10000) + 5000,
      engagement: `${(Math.random() * 5 + 2).toFixed(1)}%`
    }))
    .sort((a, b) => b.views - a.views);

  // Category performance
  const categoryStats = [
    { name: 'Bollywood', value: 45 },
    { name: 'PAN India', value: 25 },
    { name: 'Streaming', value: 15 },
    { name: 'Hollywood', value: 10 },
    { name: 'Other', value: 5 },
  ];

  res.json({
    kpis: {
      totalViews,
      avgSession,
      bounceRate,
      activeNow
    },
    charts: {
      monthlyViews,
      dailyViews,
      categoryStats
    },
    topArticles
  });
};
