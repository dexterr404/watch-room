import { HatGlasses, X } from "lucide-react"
import ToggleButton from "../ui/ToggleButton"
import { useState } from "react"
import { Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { createRoom } from "../../api/roomService"
import { uploadMuxVideo } from "../../services/muxService"
import { CheckCircle } from "lucide-react"
import { extractThumbnail } from "../../utils/extractThumbnail"
import type { MuxAsset } from "../../types/Mux"
import { deleteUploadedVideo } from "../../api/muxService"
import { toast } from "sonner"


type CreateRoomModalProps = {
    setShowCreateModal: (value: boolean) => void
}

export default function CreateRoomModal({setShowCreateModal}: CreateRoomModalProps) {
    const navigate = useNavigate();
    const [isPrivate, setIsPrivate] = useState(false);
    const [roomTitle, setRoomTitle] = useState("");
    const [uploadType, setUploadType] = useState<'link' | 'upload'>('link');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoLink, setVideoLink] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    // Store complete Mux asset data
    const [muxAsset, setMuxAsset] = useState<MuxAsset | null>(null);

    const handleUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setVideoFile(file);
        setIsUploading(true);
        
        try {
            const result = await uploadMuxVideo(file, (p) => setUploadProgress(p));
            if (muxAsset?.assetId) {
                await deleteUploadedVideo(muxAsset.assetId);
            }
            
            // Store all Mux data in state
            setMuxAsset({
                playbackId: result.playbackId,
                assetId: result.assetId,
                thumbnail: result.thumbnail
            });
            toast.success('Video uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error("Failed to upload video");
        } finally {
            setIsUploading(false);
        }
    }

    const handleCreateRoom = async () => {
        if (!roomTitle || (uploadType === 'link' && !videoLink) || (uploadType === 'upload' && !muxAsset)) {
            alert('Please fill in all fields');
            return;
        }
        
        setIsUploading(true);
        
        try {
            let videoUrl = '';
            let playbackId = '';
            let thumbnail = '';

            if (uploadType === 'upload' && muxAsset) {
                // Use stored Mux data
                playbackId = muxAsset.playbackId;
                thumbnail = muxAsset.thumbnail;
                videoUrl = `https://stream.mux.com/${playbackId}.m3u8`;
            } else if (uploadType === 'link' && videoLink) {
                videoUrl = videoLink;
                thumbnail = extractThumbnail(videoLink);
            }

            const res = await createRoom({title:roomTitle,video_url:videoUrl,playback_id:playbackId,asset_id:muxAsset?.assetId,thumbnail,is_private:isPrivate});
            toast.success("Room created successfully");
            
            setShowCreateModal(false);
            navigate(`/room/${res.room.id}`);
        } catch (error) {
            console.error('Error creating room:', error);
            toast.error('Failed to create room');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = async() => {
        if (muxAsset?.assetId) {
            await deleteUploadedVideo(muxAsset.assetId);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Create Room</h3>
                    <button 
                        onClick={() => {
                            handleClose();
                            setShowCreateModal(false);
                        }} 
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    {/* Room Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Room Title</label>
                        <input 
                            type="text" 
                            value={roomTitle} 
                            onChange={(e) => setRoomTitle(e.target.value)} 
                            placeholder="Enter room title..." 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" 
                        />
                    </div>

                    {/* Upload Type Toggle */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Video Source</label>
                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => setUploadType('link')}
                                disabled={isUploading || (uploadType === 'upload' && muxAsset !== null)}
                                className={`flex-1 py-2 rounded-lg transition-colors ${
                                    uploadType === 'link'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-400'
                                }
                                ${(uploadType === 'upload' && muxAsset === null) ? "hover:bg-gray-700" : ""}`}
                            >
                                Paste Link
                            </button>
                            <button
                                onClick={() => setUploadType('upload')}
                                disabled={isUploading || videoLink.trim() !== ''}
                                className={`flex-1 py-2 rounded-lg transition-colors ${
                                    uploadType === 'upload'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
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
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" 
                            />
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                    id="video-upload"
                                />
                                <label
                                    htmlFor="video-upload"
                                    className={`w-full bg-gray-800 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg px-4 py-8 text-center cursor-pointer transition-colors flex flex-col items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-8 h-8 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
                                            <span className="text-sm text-gray-400">Uploading... {Math.round(uploadProgress)}%</span>
                                        </>
                                    ) : muxAsset ? (
                                        <>
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                            <span className="text-sm text-green-400">{videoFile?.name}</span>
                                            <span className="text-xs text-gray-500">Click to change</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-500" />
                                            <span className="text-sm text-gray-400">Click to upload video</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Private Toggle */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Private Room</label>
                        <ToggleButton 
                            isToggled={isPrivate} 
                            onToggle={() => setIsPrivate(prev => !prev)} 
                            icon={HatGlasses} 
                        />
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={handleCreateRoom}
                        disabled={isUploading || !roomTitle || (uploadType === 'link' ? !videoLink : !muxAsset)}
                        className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Creating Room...</span>
                            </>
                        ) : (
                            'Create Room'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}