import { Response,Request } from "express"
import supabase from "../config/supabaseConfig";

export const registerUser = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.id;

  try {
    console.log("[registerUser] userId:", userId, "email:", user.email);

    // Check if profile already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (existing) {
      return res.status(200).json({ message: "Profile already exists", profile: existing });
    }

    // Create new profile
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        username: user.email?.split("@")[0],
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Profile created", profile: data });
  } catch (error) {
    console.error("[registerUser] error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  res.json({ profile });
};