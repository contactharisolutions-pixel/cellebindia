import { RequestHandler } from "express";
import { getAllGalleries, saveGallery, deleteGalleryRow } from "../lib/storage";
import { Gallery } from "../../shared/api";

export const getGalleries: RequestHandler = async (req, res) => {
  try {
    const galleries = await getAllGalleries();
    res.json(galleries);
  } catch (error) {
    console.error("Error in getGalleries:", error);
    res.status(500).json({ error: "Failed to fetch galleries" });
  }
};

export const createGallery: RequestHandler = async (req, res) => {
  try {
    const gallery: Gallery = req.body;
    if (!gallery.id) {
      gallery.id = `gallery-${Date.now()}`;
    }
    await saveGallery(gallery);
    res.json({ success: true, gallery });
  } catch (error: any) {
    console.error("Error in createGallery:", error);
    res.status(500).json({ error: error.message || "Failed to save gallery" });
  }
};

export const updateGallery: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery: Gallery = { ...req.body, id };
    await saveGallery(gallery);
    res.json({ success: true, gallery });
  } catch (error: any) {
    console.error("Error in updateGallery:", error);
    res.status(500).json({ error: error.message || "Failed to update gallery" });
  }
};

export const deleteGallery: RequestHandler = async (req, res) => {
  try {
    const success = await deleteGalleryRow(req.params.id as string);
    res.json({ success });
  } catch (error) {
    console.error("Error in deleteGallery:", error);
    res.status(500).json({ error: "Failed to delete gallery" });
  }
};
