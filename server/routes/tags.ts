import { RequestHandler } from "express";
import { db } from "../lib/storage";
import { logAction } from "../lib/audit";

export const getTags: RequestHandler = async (req, res) => {
  const { data, error } = await db
    .from('tags')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.json(data);
};

export const createTag: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const { data, error } = await db
    .from('tags')
    .insert({ name, slug })
    .select()
    .single();

  if (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Created Tag", "Taxonomy", data.id.toString());
  res.status(201).json(data);
};

export const updateTag: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const { data, error } = await db
    .from('tags')
    .update({ name, slug })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    console.error("Error updating tag:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Updated Tag", "Taxonomy", id as string);
  res.json(data);
};

export const deleteTag: RequestHandler = async (req, res) => {
  const { id } = req.params;
  
  // First clean up junction table
  await db.from('article_tags').delete().eq('tag_id', id);
  
  const { data, error } = await db
    .from('tags')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Deleted Tag", "Taxonomy", id as string);
  res.status(204).send();
};
