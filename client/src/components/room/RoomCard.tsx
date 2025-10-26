import { Users,Play } from "lucide-react"
import type { Room } from "../../types/Room"
import { useNavigate } from "react-router-dom"
import  defaultMovieThumbnail  from "../../assets/movie_default.svg"

type RoomCardProps = {
    room: Room
}

export default function RoomCard({room}: RoomCardProps) {
    const navigate = useNavigate();

    return (
        <div
            key={room.id}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-purple-500 transition-all group"
        >
            <div className="relative aspect-video bg-gray-800 overflow-hidden">
                {room.thumbnail ? (
                    <img
                        src={room.thumbnail}
                        alt={room.title}
                        onError={(e) => e.currentTarget.src = defaultMovieThumbnail}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Play className="w-16 h-16 text-gray-600" />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {room.participants}
                    </div>
                </div>
                <div className="p-4">
                <h3 className="font-semibold mb-3 line-clamp-1">{room.title}</h3>
                <button
                 onClick={() => navigate(`/room/${room.id}`)}
                 className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer py-2 rounded-lg font-medium transition-colors">
                    Watch Room
                </button>
            </div>
        </div>
    )
}