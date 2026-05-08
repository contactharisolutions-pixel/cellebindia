import { RequestHandler } from "express";
import sharp from "sharp";
import { 
  getAllMedia, 
  saveMedia, 
  deleteMediaRow,
  supabase 
} from "../lib/storage";
import { Media } from "../../shared/api";

const BUCKET_NAME = "media";

export const getMedia: RequestHandler = async (req, res) => {
  const media = await getAllMedia();
  res.json({ media });
};

export const uploadMedia: RequestHandler = async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const { altText } = req.body;

  try {
    // Optimization Pipeline - High Performance Sharp
    const optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9]/g, "_")}.webp`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, optimizedBuffer, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      res.status(500).json({ message: "Failed to upload to cloud storage" });
      return;
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const info = await sharp(optimizedBuffer).metadata();

    const newMedia: Media = {
      id: `media-${Date.now()}`,
      url: publicUrl,
      filename: fileName,
      mimetype: 'image/webp',
      size: optimizedBuffer.length,
      width: info.width || 0,
      height: info.height || 0,
      createdAt: new Date().toISOString(),
      altText: altText || file.originalname,
      metadata: {
        storage: 'supabase',
        originalName: file.originalname,
        optimization: 'sharp-webp'
      }
    };

    await saveMedia(newMedia);
    res.status(201).json(newMedia);
  } catch (err) {
    console.error("Sharp optimization failed:", err);
    res.status(500).json({ message: "Failed to optimize and store image" });
  }
};

export const deleteMedia: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  
  // Get filename before deleting record
  const mediaList = await getAllMedia();
  const media = mediaList.find(m => m.id === id);
  
  if (media) {
    const fileName = media.filename;
    if (fileName) {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);
      
      if (deleteError) {
        console.error("Supabase Storage Delete Error:", deleteError);
      }
    }
  }

  const deleted = await deleteMediaRow(id);
  
  if (!deleted) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  res.status(204).send();
};
