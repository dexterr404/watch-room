import { Response,Request } from "express";
import { createUniqueRoomKey } from "../utils/generateRoomKey";
import supabase from "../config/supabaseConfig";

export const getMyRoom = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Fetch the room owned by the user
    const { data: myRoom, error: ownedError } = await supabase
      .from("rooms")
      .select("*")
      .eq("owner_id", userId)
      .maybeSingle();

    if (ownedError && ownedError.code !== "PGRST116") {
      throw ownedError;
    }

    // Fetch the rooms the user joined as a participant
    const { data: participantRooms, error: participantError } = await supabase
      .from("room_participants")
      .select("rooms(*)") // join with rooms table
      .eq("user_id", userId)
      .not("rooms.owner_id", "eq", userId); // exclude their own room

    if (participantError) {
      throw participantError;
    }

    // Map out the joined rooms
    const joinedRooms = participantRooms?.map((p) => p.rooms) || [];

    return res.status(200).json({
      myRoom: myRoom || null,
      joinedRooms,
    });
  } catch (error) {
    console.error("Get my room error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoomById = async(req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        if(!userId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { data: room, error: fetchError } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", req.params.roomId)
            .single()

        if(fetchError && fetchError.code !== "PGRST116") {
            // Some error other than "no rows"
            throw fetchError;
        }

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.is_private && room.owner_id !== userId) {
        // Check if the user is a participant
        const { data: participant, error: partError } = await supabase
            .from("room_participants")
            .select("id")
            .eq("room_id", room.id)
            .eq("user_id", userId)
            .single();

        if (partError || !participant) {
            return res.status(403).json({ message: "This room is private" });
        }
        }

         const { data: participants, error: participantsError } = await supabase
            .from("room_participants")
            .select("id, user_id, profiles(username, avatar_url)")
            .eq("room_id", room.id);

        if (participantsError) throw participantsError;

        res.status(200).json({ room, participants: participants || [], });
    } catch (error) {
        console.error("Get room error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPublicRooms = async(req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
    const { data: rooms, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_private", false)
        .order("created_at", { ascending: false });

    if (error) throw error;

    // Exclude the user's own room
    const publicRooms = userId
        ? rooms.filter(room => room.owner_id !== userId)
        : rooms;

    res.status(200).json({ rooms: publicRooms });
    } catch (error) {
    console.error("Get public rooms error:", error);
    res.status(500).json({ message: "Internal server error" });
    }
};

export const createRoom = async(req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        if(!userId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        //Check for existing room
        const { data: existingRoom, error: fetchError } = await supabase
        .from("rooms")
        .select("*")
        .eq("owner_id", userId)
        .single();

        if(fetchError && fetchError.code !== "PGRST116") {
        // Some error other than "no rows"
        throw fetchError;
        }

        if(existingRoom) {
            return res.status(400).json({ message: "You already have an active room" });
        }

        // Generate unique room key
        const roomKey = await createUniqueRoomKey();

        //Insert new room
        const { data: newRoom, error: insertError } = await supabase
        .from("rooms")
        .insert({
            owner_id: userId,
            title: req.body.title,
            video_url: req.body.video_url || null,
            thumbnail: req.body.thumbnail || null,
            playback_id: req.body.playback_id || null,
            is_private: req.body.is_private || false,
            asset_id: req.body.asset_id || null,
            created_at: new Date().toISOString(),
            room_key: roomKey,
        })
        .select()
        .single()

        if (insertError) throw insertError;

        res.status(201).json({ message: "Room created", room: newRoom })
    } catch (error) {
        console.log("Create room error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateRoom = async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const { roomId } = req.params;
        const updates = req.body;
        console.log("ROOM ID",roomId);

        console.log(updates);
        console.log("userId",userId);

        if (!userId) {
        return res.status(401).json({ message: "Not authorized" });
        }

        try {
        // Ensure the user owns the room
        const { data: existingRoom, error: fetchError } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", roomId)
            .eq("owner_id", userId)
            .single();

        if (fetchError || !existingRoom) {
            console.log("Room not fouind");
            return res.status(404).json({ message: "Room not found or unauthorized" });
        }

        // Perform partial update
        const { data: updatedRoom, error: updateError } = await supabase
            .from("rooms")
            .update(updates)
            .eq("id", roomId)
            .select()
            .single();

        if (updateError) throw updateError;

        return res.status(200).json(updatedRoom);
    } catch (error) {
        console.error("Error updating room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const joinRoomByKey = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { roomKey } = req.params;
  console.log(roomKey);

  if (!roomKey) {
    console.log("No room key");
    return res.status(400).json({ message: "Room key is required" });
  }

  try {
    // Find the room
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, owner_id, title, room_key")
      .eq("room_key", roomKey)
      .single();

    if (roomError || !room) {
      console.error("Room not found:", roomError);
      return res.status(404).json({ message: "Room not found" });
    }

    const { data: existingParticipant } = await supabase
      .from("room_participants")
      .select("id")
      .eq("room_id", room.id)
      .eq("user_id", userId)
      .single();

    if (!existingParticipant) {
      await supabase.from("room_participants").insert({
        user_id: userId,
        room_id: room.id,
        joined_at: new Date().toISOString(),
      });
    }

    // Respond with the room ID
    return res.status(200).json({ roomId: room.id });
  } catch (error) {
    console.error("Error joining room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeRoomKey = async(req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { roomId } = req.params;

    try {
        // Ensure room exists and belongs to the user
        const { data: room, error } = await supabase
        .from("rooms")
        .select("id, owner_id")
        .eq("id", roomId)
        .single();

        if (error || !room) return res.status(404).json({ message: "Room not found" });
        if (room.owner_id !== userId) return res.status(403).json({ message: "Not authorized" });

        const newKey = await createUniqueRoomKey();
        console.log(newKey);

        const { data: updatedRoom, error: updateError } = await supabase
        .from("rooms")
        .update({ room_key: newKey })
        .eq("id", roomId)
        .select()
        .single();

        if (updateError) throw updateError;

        return res.status(200).json({ room: updatedRoom });
    } catch (err) {
        console.error("Error regenerating room key:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const kickParticipant = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { targetUserId } = req.body;
  const { roomId } = req.params;

  try {
    const { data: room } = await supabase
      .from("rooms")
      .select("owner_id")
      .eq("id", roomId)
      .single();

    if (!room || room.owner_id !== userId) {
      return res.status(403).json({ message: "Only the owner can kick participants" });
    }

    const { error: deleteError } = await supabase
      .from("room_participants")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", targetUserId);

    if (deleteError) throw deleteError;

    return res.status(200).json({ message: "Participant removed successfully" });
  } catch (error) {
    console.error("Kick participant error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
