import supabase from "../config/supabaseConfig";

// Helper to generate a random alphanumeric key
function generateRoomKey(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Helper to ensure uniqueness by checking Supabase
export async function createUniqueRoomKey() {
  let key;
  let isUnique = false;

  while (!isUnique) {
    key = generateRoomKey(12);

    const { data } = await supabase
      .from("rooms")
      .select("id")
      .eq("room_key", key)
      .single();

    if (!data) isUnique = true; // Key not found = unique
  }

  return key;
}