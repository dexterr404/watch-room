import { useState } from "react";
import { Plus,Search,Users,User} from "lucide-react";
import NavBar from "../components/layout/NavBar";
import Background from "../components/layout/Background";
import JoinRoomModal from "../components/room/JoinRoomModal";
import CreateRoomModal from "../components/room/CreateRoomModal";
import RoomCard from "../components/room/RoomCard";

export default function LobbyPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomCode, setRoomCode] = useState('');

    // Mock data for public rooms
    const publicRooms = [
        {
        id: 1,
        title: 'Interstellar Watch Party',
        participants: 12,
        thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=225&fit=crop'
        },
        {
        id: 2,
        title: 'Anime Marathon Night',
        participants: 8,
        thumbnail: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=225&fit=crop'
        },
        {
        id: 3,
        title: 'Documentary Series',
        participants: 5,
        thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop'
        },
        {
        id: 4,
        title: 'Classic Movies Collection',
        participants: 15,
        thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop'
        }
    ];

    const filteredRooms = publicRooms.filter(room =>
        room.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white">
        {/* Stars background effect */}
        <Background />
        <NavBar />
        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-6 py-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
            <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/50 z-20"
            >
                <Plus className="w-5 h-5" />
                Create Room
            </button>
            <button
                onClick={() => setShowJoinModal(true)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 px-6 py-3 cursor-pointer rounded-lg font-semibold transition-all z-20"
            >
                <Users className="w-5 h-5" />
                Join Room
            </button>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search public rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            {/* My Rooms Section */ }
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    My Rooms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        filteredRooms.length < 0 ? (
                            <h1>No Rooms</h1>
                        ) : (
                            filteredRooms.map((room) => (
                                <RoomCard key={room.id} room={room}/>
                            ))
                        )
                    }
                </div>
            </div>
            
            {/* Public Rooms Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-4">
                    <Users className="w-5 h-5 text-purple-400" />
                    Public Rooms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredRooms.map((room) => (
                        <RoomCard key={room.id} room={room}/>
                    ))}
                </div>
            </div>
        </main>

        {/* Create Room Modal */}
        {showCreateModal && (
            <CreateRoomModal setShowCreateModal={setShowCreateModal} />
        )}

        {/* Join Room Modal */}
        {showJoinModal && (
            <JoinRoomModal setRoomCode={setRoomCode} roomCode={roomCode} setShowJoinModal={setShowJoinModal}/>
        )}
        </div>
    );
}