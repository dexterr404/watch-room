import { useState } from "react";
import { X, ChevronDown, ChevronUp, Video, Lock, MessageSquare, Info, Shield,Loader,Upload, RefreshCcw } from "lucide-react";
import type { Room } from "../../types/Room";
import type { MuxAsset } from "../../types/Mux";
import { extractThumbnail } from "../../utils/extractThumbnail";
import { uploadMuxVideo } from "../../services/muxService";
import { deleteUploadedVideo } from "../../api/muxService";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { changeRoomKey, kickParticipant, updateRoom } from "../../api/roomService";
import { toast } from "sonner";

export type Participant = {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  left_at?: string | null;
  profiles?: {
    username?: string;
    avatar_url?: string;
  };
};

type WatchRoomSettingsProps = {
    room: Room;
    isOpen: boolean;
    onClose: () => void;
    roomParticipants: Participant[];
}

export default function WatchRoomSettings({ room, isOpen, onClose, roomParticipants }: WatchRoomSettingsProps) {
  const queryClient = useQueryClient();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [roomTitle, setRoomTitle] = useState<string>(room.title);
  const [isPrivate, setIsPrivate] = useState<boolean>(room.is_private || false);
  const [uploadType, setUploadType] = useState<'link' | 'upload'>('link');
  const [videoLink, setVideoLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [chatAutoScroll, setChatAutoScroll] = useState<boolean>(room.auto_scroll || false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newMuxAsset, setNewMuxAsset] = useState<MuxAsset | null>(null); // NEW video uploaded
  
  // Store the ORIGINAL room's Mux asset to delete later
  const originalAssetId = room.asset_id || null;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const updateRoomMutation = useMutation({
    mutationFn: ({ roomId, update }: { roomId: string; update: Partial<Room> }) =>
      updateRoom(roomId, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", room.id] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Delete previously uploaded NEW video if user re-uploads
      if (newMuxAsset?.assetId) {
        await deleteUploadedVideo(newMuxAsset.assetId);
      }

      if (originalAssetId && originalAssetId !== newMuxAsset?.assetId) {
        console.log("Deleting original Mux video:", originalAssetId);
        try {
          await deleteUploadedVideo(originalAssetId);
        } catch (err) {
          console.error("Failed to delete old video:", err);
        }
      }

      // Upload the new video to Mux
      const result = await uploadMuxVideo(file, (p) => setUploadProgress(p));

      setNewMuxAsset({
        playbackId: result.playbackId,
        assetId: result.assetId,
        thumbnail: result.thumbnail
      });
      toast.success('File attached successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.success('Failed to attach file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadVideo = async () => {
    setIsUploading(true);

    try {
      let videoUrl = '';
      let playbackId = '';
      let thumbnail = '';
      let assetId = '';

      if (uploadType === 'upload' && newMuxAsset) {
        // Using newly uploaded video
        playbackId = newMuxAsset.playbackId;
        assetId = newMuxAsset.assetId;
        thumbnail = newMuxAsset.thumbnail;
        videoUrl = `https://stream.mux.com/${playbackId}.m3u8`;
      } else if (uploadType === 'link' && videoLink) {
        // Using link
        videoUrl = videoLink;
        thumbnail = extractThumbnail(videoLink);
        playbackId = '';
        assetId = '';
      } else {
        alert('Please provide a video');
        return;
      }

      // Update room in database
      await updateRoomMutation.mutateAsync({
        roomId: room.id,
        update: {
          video_url: videoUrl,
          playback_id: playbackId,
          thumbnail,
          asset_id: assetId,
          title: roomTitle,
          is_private: isPrivate,
        },
      });

      // Delete the ORIGINAL Mux video after successful save
      // Only if it exists AND it's different from the new one
      if (originalAssetId && originalAssetId !== assetId) {
        console.log("Deleting original Mux video:", originalAssetId);
        try {
          await deleteUploadedVideo(originalAssetId);
        } catch (err) {
          console.error("Failed to delete old video:", err);
          // Don't fail the whole operation
        }
      }

      // Reset form
      setVideoLink('');
      setNewMuxAsset(null);
      setUploadProgress(0);
      setOpenSection(null);

      toast.success('Video uploaded successfully!');
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSwitchToLink = async() => {
    if (newMuxAsset?.assetId) {
      try {
        await deleteUploadedVideo(newMuxAsset.assetId);
        console.log("Deleted unsaved new Mux video:", newMuxAsset.assetId);
      } catch (err) {
        console.error("Failed to delete unsaved video:", err);
      }
    }
    setNewMuxAsset(null);
    setUploadProgress(0);
    setUploadType('link');
  };

  const handleSwitchToUpload = () => {
    setVideoLink('');
    setUploadType('upload');
  };

  const handleSaveChanges = async () => {
    setIsUploading(true);

    try {
      // Update room in database
      await updateRoomMutation.mutateAsync({
        roomId: room.id,
        update: {
          title: roomTitle,
          is_private: isPrivate,
          auto_scroll: chatAutoScroll,
        },
      });
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error("Failed to save changes");
    } finally {
      setIsUploading(false);
      onClose();
    }
  };

  const handleChangeRoomKey = async () => {
    if (!room?.id) return;
    try {
      await changeRoomKey(room.id);
      toast.success("Room key updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["room", room.id] });
    } catch (error) {
      toast.error("Failed to update room key");
    }
  }

  const handleKickParticipant = async (targetUserId: string) => {
    if (!room?.id) return;
    const confirmKick = confirm("Are you sure you want to remove this participant?");
    if (!confirmKick) return;

    try {
      await kickParticipant(room.id, targetUserId);
      toast.success("Participant removed successfully!");

      queryClient.invalidateQueries({ queryKey: ["room", room.id] });
    } catch (error) {
      console.error("Error kicking participant:", error);
      toast.error("Failed to remove participant.");
    }
  }

  const handleClose = async () => {
    // If user uploaded a new video but didn't save
    if (newMuxAsset?.assetId) {
      try {
        await deleteUploadedVideo(newMuxAsset.assetId);
        console.log("Deleted unsaved new Mux video:", newMuxAsset.assetId);
      } catch (err) {
        console.error("Failed to delete unsaved video:", err);
      }
    }

    // Reset local state
    setNewMuxAsset(null);
    setVideoLink('');
    setUploadProgress(0);
    setOpenSection(null);

    // Call the parent onClose
    onClose();
  };

  return (
    <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
            isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
        {/* Background overlay */}
        <div
            onClick={handleClose}
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
                isOpen ? "opacity-100" : "opacity-0"
            }`}
        ></div>

        {/* Drawer */}
        <div
            className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-gray-900 border-l border-gray-800 shadow-xl transform transition-transform duration-300 flex flex-col ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
                <h2 className="text-lg font-semibold">Room Settings</h2>
                <button onClick={handleClose} className="text-gray-400 cursor-pointer hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
                {/* General Info */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                    <button
                        onClick={() => toggleSection("general")}
                        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">General Settings</span>
                        </div>
                        {openSection === "general" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {openSection === "general" && (
                        <div className="pt-2 pb-4 px-4 space-y-3">
                            <label className="block">
                                <span className="text-sm text-gray-400">Room Name</span>
                                <input 
                                    onChange={(e) => setRoomTitle(e.target.value)} 
                                    value={roomTitle} 
                                    type="text" 
                                    className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" 
                                />
                            </label>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Room Code: {room.room_key}</span>
                                <button onClick={handleChangeRoomKey} className="cursor-pointer">
                                  <RefreshCcw className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Section */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                    <button
                        onClick={() => toggleSection("video")}
                        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Video className="w-5 h-5 text-purple-400" />
                            <span className="font-medium">Video Settings</span>
                        </div>
                        {openSection === "video" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {openSection === "video" && (
                        <div className="pt-1 px-4 pb-4 text-sm text-gray-300 space-y-3">
                            {/* Current Video Info */}
                            <div className="bg-gray-900/50 rounded p-3 border border-gray-700">
                                <p className="text-xs text-gray-400 mb-1">Current Video</p>
                                <p className="text-xs text-gray-300 truncate">{room.video_url}</p>
                            </div>

                            {/* Upload Type Toggle */}
                            <div>
                                <label className="block text-gray-400 mb-2">New Video Source</label>
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={handleSwitchToLink}
                                        disabled={isUploading}
                                        className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                                            uploadType === 'link'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Paste Link
                                    </button>
                                    <button
                                        onClick={handleSwitchToUpload}
                                        disabled={isUploading}
                                        className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                                            uploadType === 'upload'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Upload File
                                    </button>
                                </div>

                                {/* Conditional Input */}
                                {uploadType === 'link' ? (
                                    <input
                                        type="text"
                                        value={videoLink}
                                        onChange={(e) => setVideoLink(e.target.value)}
                                        placeholder="Paste YouTube, Vimeo, or video URL..."
                                        disabled={isUploading}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none disabled:opacity-50"
                                    />
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                            className="hidden"
                                            id="video-settings-upload"
                                        />
                                        <label
                                            htmlFor="video-settings-upload"
                                            className={`w-full bg-gray-900 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg px-4 py-6 text-center cursor-pointer transition-colors flex flex-col items-center gap-2 ${
                                                isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                                            }`}
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader className="w-6 h-6 text-purple-500 animate-spin" />
                                                    <span className="text-xs text-gray-400">
                                                        Uploading... {Math.round(uploadProgress)}%
                                                    </span>
                                                </>
                                            ) : newMuxAsset ? (
                                                <>
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs">✓</span>
                                                    </div>
                                                    <span className="text-xs text-green-400">Video uploaded</span>
                                                    <span className="text-xs text-gray-500">Click to change</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-6 h-6 text-gray-500" />
                                                    <span className="text-xs text-gray-400">Click to upload</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Upload Button */}
                            <button
                                onClick={handleUploadVideo}
                                disabled={isUploading || (uploadType === 'link' ? !videoLink : !newMuxAsset)}
                                className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Upload Video'
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Privacy Section */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                    <button
                        onClick={() => toggleSection("privacy")}
                        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">Privacy Settings</span>
                        </div>
                        {openSection === "privacy" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {openSection === "privacy" && (
                        <div className="px-4 pb-4 text-sm text-gray-300 space-y-3">
                            <div className="flex items-center justify-between pt-2">
                                <span>Room Visibility</span>
                                <select
                                    value={isPrivate ? 'private' : 'public'}
                                    onChange={(e) => setIsPrivate(e.target.value === 'private')}
                                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-purple-500 outline-none"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Section */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                    <button
                        onClick={() => toggleSection("chat")}
                        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-pink-400" />
                            <span className="font-medium">Chat Settings</span>
                        </div>
                        {openSection === "chat" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {openSection === "chat" && (
                        <div className="px-4 pb-4 text-sm text-gray-300 space-y-3">
                            <div className="flex pt-2 items-center justify-between">
                                <span>Auto-scroll Messages</span>
                                <input 
                                    onChange={() => setChatAutoScroll(prev => !prev)} 
                                    checked={chatAutoScroll} 
                                    type="checkbox" 
                                    className="accent-purple-500 w-4 h-4 cursor-pointer" 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Moderation */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                    <button
                        onClick={() => toggleSection("moderation")}
                        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-400" />
                            <span className="font-medium">Moderation</span>
                        </div>
                        {openSection === "moderation" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {openSection === "moderation" && (
                        <div className="pt-2 pb-4 px-4 space-y-3">
                            {roomParticipants.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center">No participants in this room.</p>
                            ) : (
                                roomParticipants.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                          <img src={p?.profiles?.avatar_url} className="w-8 h-8 rounded-full shrink-0"/>
                                            <span className="text-sm font-medium">{p?.profiles?.username}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-xs text-red-400 hover:text-red-500 border border-red-500/30 px-2 py-1 rounded-lg transition"
                                                onClick={() => handleKickParticipant(p?.user_id)}
                                            >
                                                Kick
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button - Fixed at bottom */}
            <div className="border-t border-gray-800 p-4 shrink-0 bg-gray-900">
                <button
                    onClick={handleSaveChanges}
                    disabled={isUploading}
                    className="w-full px-6 py-3 bg-linear-to-br from-purple-600 to-pink-600 cursor-pointer hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    </div>  
  );
}