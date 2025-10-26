import { X } from "lucide-react"
import { joinRoomByKey } from "../../api/roomService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type JoinRoomModalProps = {
    setShowJoinModal: (value: boolean) => void;
    roomCode: string,
    setRoomCode: (value: string) => void;
}

export default function JoinRoomModal({setShowJoinModal,roomCode,setRoomCode}: JoinRoomModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleJoin = async() => {
        setIsLoading(true)
        try {
            const res = await joinRoomByKey(roomCode);
            toast.success("Room joined successfully");
            navigate(`${res.roomId}`)
        } catch (error) {
            console.log('Error in joining a room by key', error);
            toast.error("Failed to join room");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Join Room</h3>
                <button
                    onClick={() => setShowJoinModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                </div>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Room Code</label>
                    <input
                    type="text"
                    placeholder="Enter 12-digit room code..."
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-center text-2xl tracking-widest"
                    maxLength={12}
                    />
                </div>
                <button onClick={handleJoin} disabled={isLoading} className={`w-full bg-linear-to-r from-purple-600 to-pink-600 ${isLoading ? "hover:from-purple-700 hover:to-pink-700" : ""} py-3 rounded-lg font-semibold transition-all mt-6`}>
                    Join Room
                </button>
                </div>
            </div>
        </div>
    )
}