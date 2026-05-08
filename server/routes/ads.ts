import { RequestHandler } from "express";
import { db } from "../lib/storage";

export const getAds: RequestHandler = async (req, res) => {
  const { data, error } = await db
    .from('ads')
    .select('*')
    .order('id');
  
  if (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.json(data);
};

export const updateAdStatus: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const { error } = await db
    .from('ads')
    .update({ 
      status, 
      last_updated: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) {
    console.error("Error updating ad status:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  res.json({ message: "Ad slot updated successfully" });
};

export const getMonetizationStats: RequestHandler = async (req, res) => {
  const { data, error } = await db
    .from('ads')
    .select('revenue_today, revenue_month');

  if (error) {
    console.error("Error fetching monetization stats:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  
  const kpis = data.reduce((acc: any, curr: any) => ({
    today: (acc.today || 0) + (curr.revenue_today || 0),
    month: (acc.month || 0) + (curr.revenue_month || 0)
  }), { today: 0, month: 0 });
  
  // Weekly trend mock
  const trend = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    revenue: (Math.random() * 50 + 20).toFixed(2)
  }));

  res.json({
    kpis,
    trend
  });
};
