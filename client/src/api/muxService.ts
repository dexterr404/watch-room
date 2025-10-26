import axios from "axios";
import { supabase } from "../config/supabaseClient";

export async function createMuxUploadUrl() {
    const { data: { session } } = await supabase.auth.getSession();

    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/mux/upload-url`,
        {},
        {
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        }
    )
    return res.data;
}

export async function getMuxAsset(uploadId: string){
    const { data: { session } } = await supabase.auth.getSession();

    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/mux/asset/${uploadId}`,
        {
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        }
    )
    return res.data;
}

export async function deleteUploadedVideo(assetId: string){
    const { data: { session } } = await supabase.auth.getSession();

    const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/mux/asset/${assetId}`,
        {
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        }
    )
    return res.data;
}