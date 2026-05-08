import { RequestHandler } from "express";
import { db } from "../lib/storage";
import { logAction } from "../lib/audit";

export const getComments: RequestHandler = async (req, res) => {
  // Join with articles to show where the comment was made
  const { data, error } = await db
    .from('comments')
    .select('*, articles(title)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  // Flatten the join result to match expected API output
  const comments = data.map((c: any) => ({
    ...c,
    article_title: c.articles?.title
  }));

  res.json(comments);
};

export const updateCommentStatus: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved', 'spam', 'pending'

  const { data, error } = await db
    .from('comments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    console.error("Error updating comment status:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction(`Updated Comment Status: ${status}`, "Moderation", id as string);
  res.json(data);
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await db
    .from('comments')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Deleted Comment", "Moderation", id as string);
  res.status(204).send();
};
