import * as UpChunk from "@mux/upchunk";
import { createMuxUploadUrl, getMuxAsset } from "../api/muxService";
import type { MuxAsset } from "../types/Mux";

export function uploadMuxVideo(
  file: File,
  onProgress?: (progress: number) => void
): { assetPromise: Promise<MuxAsset>; cancel: () => void } {
  let upload: any = null;

  const assetPromise = new Promise<MuxAsset>(async (resolve, reject) => {
    try {
      const res = await createMuxUploadUrl();

      upload = UpChunk.createUpload({
        endpoint: res.uploadUrl,
        file,
        chunkSize: 5120,
      });

      upload.on("error", reject);
      upload.on("progress", (event: any) => onProgress?.(event.detail));
      upload.on("success", async () => {
        const pollAsset = async (): Promise<void> => {
          try {
            const assetRes = await getMuxAsset(res.uploadId);
            if (assetRes.playbackId) {
              resolve(assetRes as MuxAsset);
            } else {
              setTimeout(pollAsset, 3000);
            }
          } catch (err) {
            reject(err);
          }
        };
        pollAsset();
      });
    } catch (err) {
      reject(err);
    }
  });

  return {
    assetPromise,
    cancel: () => {
      if (upload && typeof upload.abort === "function") {
        console.log("Aborting upload...");
        upload.abort();
      } else {
        console.warn("Upload not started yet or already completed");
      }
    },
  };
}
