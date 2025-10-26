import axios from "axios";
import { supabase } from "../config/supabaseClient";
import type { Room } from "../types/Room";

export async function getMyRoom() {
    const { data: { session } } = await supabase.auth.getSession();

    const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/rooms/me`,
        {
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        }
    )
    return res.data;
}

export async function getRoomById(roomId: string) {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/rooms/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      }
    }
  );

  return res.data;
}

export async function getPublicRooms() {
  const { data: { session } } = await supabase.auth.getSession();
    
    const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/rooms/public`,
        {
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        }
    )
    return res.data.rooms;
}


export async function createRoom({ title,video_url,playback_id,asset_id,thumbnail,is_private}: Partial<Room>) {
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/rooms`,
        {title,video_url,playback_id,asset_id,thumbnail,is_private},
        {
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        }
    )
    return res.data;
}

export async function updateRoom(roomId: string, updates: Partial<Room>) {
  const { data: { session } } = await supabase.auth.getSession();
    
    const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/rooms/${roomId}`,
        updates,
        {
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        }
    )
    return res.data;
}

export async function joinRoomByKey(roomKey: string) {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/rooms/join-by-key/${roomKey}`,
    {},
    {
        headers: { 
            Authorization: `Bearer ${session?.access_token}` 
        } 
    }
  );
  return res.data;
}

export async function changeRoomKey(roomId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/rooms/${roomId}/change-key`,
        {},
        {
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        }
    )
    return res.data;
}

export async function kickParticipant(roomId: string, targetUserId: string) {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/api/rooms/${roomId}/kick-participant`,
    {
      headers: { 
        Authorization: `Bearer ${session?.access_token}` 
      },
      data: { targetUserId }
    }
  );

  return res.data;
}