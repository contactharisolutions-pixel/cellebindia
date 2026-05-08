import { RequestHandler } from "express";
import { db } from "../lib/storage";
import { logAction } from "../lib/audit";

export const getIntegrations: RequestHandler = async (req, res) => {
  const { data, error } = await db
    .from('integrations')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching integrations:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  res.json(data);
};

export const createIntegration: RequestHandler = async (req, res) => {
  const { name, type, provider, credentials } = req.body;
  const { data, error } = await db
    .from('integrations')
    .insert({ 
      name, 
      type, 
      provider, 
      credentials: credentials || {}, 
      status: 'Active' 
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating integration:", error);
    res.status(500).json({ message: error.message });
    return;
  }
  
  await logAction(`Connected Integration: ${name}`, "System", data.id.toString());
  res.status(201).json(data);
};

export const updateIntegration: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, status, credentials } = req.body;
  
  const { data, error } = await db
    .from('integrations')
    .update({ 
      name, 
      status, 
      credentials: credentials || {}, 
      last_sync: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Integration not found" });
      return;
    }
    console.error("Error updating integration:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction(`Updated Integration: ${name}`, "System", id as string);
  res.json(data);
};

export const deleteIntegration: RequestHandler = async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await db
    .from('integrations')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404).json({ message: "Integration not found" });
      return;
    }
    console.error("Error deleting integration:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  await logAction(`Purged Integration: ${data.name}`, "System", id as string);
  res.status(204).send();
};
