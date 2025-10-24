import { HatGlasses, X } from "lucide-react"
import ToggleButton from "../ui/ToggleButton"
import { useState } from "react"

type CreateRoomModalProps = {
    setShowCreateModal: (value: boolean) => void
}

export default function CreateRoomModal({setShowCreateModal}: CreateRoomModalProps) {
    const [isPrivate, setIsPrivate] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Create Room</h3>
                <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                </div>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Room Title</label>
                    <input
                    type="text"
                    placeholder="Enter room title..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Mux Video Link or Upload</label>
                    <input
                    type="text"
                    placeholder="Paste Mux link or click to upload..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Private</label>
                    <ToggleButton isToggled={isPrivate} onToggle={() => setIsPrivate(prev => !prev)} icon={HatGlasses} />
                </div>
                    <button className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold transition-all mt-6">
                        Create Room
                    </button>
                </div>
            </div>
            
        </div>
    )
}