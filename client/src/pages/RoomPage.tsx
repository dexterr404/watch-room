import { useState } from "react";
import { Plus,Search,Users,User as UserIcon, Globe} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import NavBar from "../components/layout/NavBar";
import Background from "../components/layout/Background";
import JoinRoomModal from "../components/room/JoinRoomModal";
import CreateRoomModal from "../components/room/CreateRoomModal";
import RoomCard from "../components/room/RoomCard";
import { getMyRoom, getPublicRooms } from "../api/roomService";
import type{ User } from "../types/User";
import type { Room } from "../types/Room";

type RoomPageProps = {
  user: User;
};

export default function LobbyPage({ user }: RoomPageProps){
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomCode, setRoomCode] = useState('');

    const { data: roomData } = useQuery({
        queryKey: ["myRoom"],
        queryFn: getMyRoom,
        enabled: !!user.id,
    });

    const { data: publicRooms = [] } = useQuery<Room[]>({
        queryKey: ["publicRooms"],
        queryFn: getPublicRooms,
        enabled: !!user.id,
    })

    const myRoom = roomData?.myRoom;
    const joinedRooms = roomData?.joinedRooms || [];

    return (
        <div className="min-h-screen bg-black text-white">
        {/* Stars background effect */}
        <Background />
        <NavBar user={user}/>
        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-6 py-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
            <button
            disabled={!!myRoom}
            onClick={() => !myRoom && setShowCreateModal(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg z-20
                ${
                myRoom
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer hover:shadow-purple-500/50"
                }
            `}
            >
            <Plus className="w-5 h-5" />
            {myRoom ? "Room Created" : "Create Room"}
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
                    <UserIcon className="w-5 h-5 text-purple-400" />
                    My Room
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {myRoom ? (
                    <RoomCard room={myRoom} />
                    ) : (
                    <p>No active room found</p>
                    )}
                </div>
            </div>
            {/* Joined Rooms */}
            <section>
            <h2 className="text-xl font-semibold mt-4 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Joined Rooms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {joinedRooms.length > 0 ? (
                joinedRooms.map((r:Room) => <RoomCard key={r.id} room={r} />)
                ) : (
                <p>You haven’t joined any room yet.</p>
                )}
            </div>
            </section>
            
            {/* Public Rooms Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center  gap-2 mt-4">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Public Rooms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        publicRooms.length > 0 ? (
                        publicRooms.map((room) => (
                            <RoomCard key={room.id} room={room}/>
                        ))
                        ) : (
                            <p>No public rooms found</p>
                        )
                    
                    }
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