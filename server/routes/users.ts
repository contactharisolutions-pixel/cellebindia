import { RequestHandler } from "express";
import { db } from "../lib/storage";
import { logAction } from "../lib/audit";

export const getUsers: RequestHandler = async (req, res) => {
  const { data, error } = await db
    .from('users')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.json(data);
};

export const createUser: RequestHandler = async (req, res) => {
  const { name, email, role } = req.body;
  
  const { data, error } = await db
    .from('users')
    .insert({ name, email, role })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Created User", "Identity", data.id.toString());
  res.status(201).json(data);
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  const { data, error } = await db
    .from('users')
    .update({ name, email, role, status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Updated User Profile", "Identity", id as string);
  res.json(data);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await db
    .from('users')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction("Deleted User Account", "Identity", id as string);
  res.status(204).send();
};
