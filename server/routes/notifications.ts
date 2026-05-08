import { RequestHandler } from "express";
import { db } from "../lib/storage";

export const getNotifications: RequestHandler = async (req, res) => {
  const { data, error } = await db
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.json(data);
};

export const markAsRead: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await db
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.json(data);
};

export const deleteNotification: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await db
    .from('notifications')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.status(204).send();
};

// Create a notification (Internal use or Campaign)
export const createNotification: RequestHandler = async (req, res) => {
  const { type, title, message, link } = req.body;
  const { data, error } = await db
    .from('notifications')
    .insert({ type, title, message, link })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.status(201).json(data);
};
