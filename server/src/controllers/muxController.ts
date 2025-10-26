import { Request,Response } from "express";
import mux from "../config/muxConfig";

export const createMuxUploadUrl = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Create a direct upload URL for the frontend
    const upload = await mux.video.uploads.create({
      cors_origin: process.env.APP_BASE_URL!,
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "plus",
      },
    });

    res.status(200).json({
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (error) {
    console.error("Mux error:", error);
    res.status(500).json({ message: "Failed to create upload URL" });
  }
};

export const getMuxAsset = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { uploadId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const upload = await mux.video.uploads.retrieve(uploadId);

    if (upload.asset_id) {
      const asset = await mux.video.assets.retrieve(upload.asset_id);

      res.status(200).json({
        playbackId: asset.playback_ids?.[0]?.id,
        assetId: asset.id,
        thumbnail: `https://image.mux.com/${asset.playback_ids?.[0]?.id}/thumbnail.jpg`,
      });
    } else {
      res.status(202).json({ message: "Still processing..." });
    }
  } catch (error) {
    console.error("Mux asset error:", error);
    res.status(500).json({ message: "Failed to fetch asset" });
  }
};


export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;

    await mux.video.assets.delete(assetId);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};