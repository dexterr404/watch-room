import * as UpChunk from "@mux/upchunk";
import { createMuxUploadUrl, getMuxAsset } from "../api/muxService";
import type { MuxAsset } from "../types/Mux";

export async function uploadMuxVideo(file: File, onProgress?: (progress: number) => void): Promise<MuxAsset> {
    //Ask backend for upload URL
    const res = await createMuxUploadUrl();

    //Upload directly to Mux
    return new Promise((resolve, reject) => {
        const upload = UpChunk.createUpload({
            endpoint: res.uploadUrl,
            file: file,
            chunkSize: 5120
        });

        upload.on("error", reject);
        upload.on("progress", (event) => onProgress?.(event.detail));
        upload.on("success", async() => {
            const pollAsset = async() => {
                try {
                    const assetRes = await getMuxAsset(res.uploadId);
                    if(assetRes.playbackId) {
                        resolve(assetRes as MuxAsset);
                    } else {
                        setTimeout(pollAsset, 3000);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            pollAsset();
        });
    });
}