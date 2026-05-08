import { RequestHandler } from "express";
import { db } from "../lib/storage";
import { logAction } from "../lib/audit";

export const getCategories: RequestHandler = async (req, res) => {
  const { data, error } = await db
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.json(data);
};

export const createCategory: RequestHandler = async (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const { data, error } = await db
    .from('categories')
    .insert({ name, slug, description })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Created Category", "Taxonomy", data.id);
  res.status(201).json(data);
};

export const updateCategory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const { data, error } = await db
    .from('categories')
    .update({ name, slug, description })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    console.error("Error updating category:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Updated Category", "Taxonomy", id as string);
  res.json(data);
};

export const deleteCategory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await db
    .from('categories')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    console.error("Error deleting category:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Deleted Category", "Taxonomy", id as string);
  res.status(204).send();
};
