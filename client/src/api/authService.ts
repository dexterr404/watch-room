import axios from "axios"
import { supabase } from "../config/supabaseClient"

export async function registerUser() {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
    {},
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    }
  );

  return res.data;
}

export async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();

    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
    {
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        }
    }
    );
    return res.data;
}