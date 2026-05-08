import { RequestHandler } from "express";
import { db } from "../lib/storage";

export const getAuditLogs: RequestHandler = async (req, res) => {
  const { data, error } = await db
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.json(data);
};
