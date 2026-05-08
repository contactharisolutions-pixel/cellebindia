import { RequestHandler } from "express";
import { getVideoGallery, saveVideoGallery } from "../lib/storage";
import { VideoGallery } from "../../shared/api";

export const getVideos: RequestHandler = async (req, res) => {
  try {
    const gallery = await getVideoGallery();
    res.json(gallery);
  } catch (error: any) {
    console.error("Error in getVideos:", error);
    res.status(500).json({ error: error.message || "Failed to fetch video gallery" });
  }
};

export const updateVideoGallery: RequestHandler = async (req, res) => {
  try {
    const gallery: VideoGallery = req.body;
    await saveVideoGallery(gallery);
    res.json({ success: true, gallery });
  } catch (error: any) {
    console.error("Error in updateVideoGallery:", error);
    res.status(500).json({ error: error.message || "Failed to save video gallery" });
  }
};
