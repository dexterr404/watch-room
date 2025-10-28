import { useState,useEffect,useRef } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useQuery,useQueryClient } from '@tanstack/react-query';
import { getRoomById } from '../api/roomService';
import { useWatchRoom } from '../hooks/useWatchRoom';
import { kickParticipant } from '../api/roomService';
import { Users, Send, Settings, ArrowLeftToLine } from 'lucide-react';
import { toast } from 'sonner';
import formatDate from '../utils/formatDate';
import WatchRoomSettings from '../components/room/WatchRoomSettings';
import ReactPlayer from 'react-player';
import type { User } from '../types/User';
import Modal from '../components/ui/Modal';

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

type WatchRoomPageProps = {
  user: User
}

export default function WatchRoomPage({user}: WatchRoomPageProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { messages,participants,sendMessage } = useWatchRoom(roomId!);
  const [isKickUser, setIsKickUser] = useState(false);
  const [isKicking, setIsKicking] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: roomData } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomById(roomId!),
    enabled: !!roomId,
  });

  const room = roomData?.room;
  const roomParticipants = roomData?.participants;

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevMessageCount = useRef(messages.length);
  const [showChat, setShowChat] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isAutoScroll = room?.auto_scroll || false;

  const handleSendMessage = async() => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

   const handleKickUser = async () => {
      if (!room?.id || !selectedUser) return;
  
      setIsKicking(true);
      try {
        await kickParticipant(room.id, selectedUser.id);
        toast.success(`${selectedUser.username} was removed successfully!`);
  
        // Refresh the room participants list
        queryClient.invalidateQueries({ queryKey: ["room", room.id] });
  
        setIsKickUser(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error kicking participant:", error);
        toast.error("Failed to remove participant.");
      } finally {
        setIsKicking(false);
      }
    };

  useEffect(() => {
    if (isAutoScroll && messages.length > prevMessageCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCount.current = messages.length;
  }, [messages, isAutoScroll]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className='flex gap-2 items-start'>
            <button onClick={() => navigate('/room')} className=' cursor-pointer'>
              <ArrowLeftToLine className='w-4 h-4 mt-1.5'/>
            </button>
            <div>
                <h1 className="text-[clamp(1rem,2vw+0.5rem,1.5rem)] font-bold">{room?.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Users className="w-4 h-4" />
                    <span>{participants.length} watching</span>
                </div>
            </div>
          </div>
          {room?.owner_id === user?.id && (
            <button
              onClick={() => setIsSettingsOpen(prev => !prev)}
              className="cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Video Section */}
        <div className="flex-1 flex flex-col bg-black">
          {/* Video Player */}
          <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
            <ReactPlayer
              src={room?.video_url}
              controls
              width="100%"
              height="100%"
            />
            
          </div>

          {/* Participants Bar */}
          <div className="hidden md:block bg-gray-900/50 border-t border-gray-800 px-6 py-3">
            <div className="flex items-center flex-wrap gap-3">
              <span className="text-sm text-gray-400 whitespace-nowrap">Watching now:</span>
              {participants?.map((participant) => (
                <div
                  key={participant?.user_id}
                  className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 whitespace-nowrap"
                >
                  <img src={participant?.avatar_url} className="w-8 h-8 rounded-full shrink-0"/>
                  <span className="text-sm">{participant?.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-full md:w-80 border-l border-gray-800 bg-gray-900/30 backdrop-blur-sm flex flex-col">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold">Live Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 max-h-[40vh] sm:max-h-[60vh] md:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-auto-hide p-4 space-y-4">
              {messages?.map((msg) => {
                const isMe = msg.user_id === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Avatar for others only */}
                    {!isMe && (
                      <img
                        src={msg?.user?.avatar_url}
                        className="w-8 h-8 rounded-full shrink-0 self-end"
                      />
                    )}

                    {/* Message bubble */}
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-gray-800 text-gray-100 rounded-bl-none'
                      }`}
                    >
                      {/* Username (only for others) */}
                      {!isMe && (
                        <div className="font-semibold text-xs text-gray-400 mb-1">
                          {msg?.user?.username}
                        </div>
                      )}
                      <p className="wrap-break-word">{msg.content}</p>
                      <div
                        className={`text-[10px] mt-1 ${
                          isMe ? 'text-purple-200 text-right' : 'text-gray-500'
                        }`}
                      >
                        {formatDate(msg.created_at)}
                      </div>
                    </div>

                    {/* Spacer for my messages */}
                    {isMe && <div className="w-8" />}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>


            {/* Message Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer p-2 rounded-lg transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Participants Bar */}
            <div className="block md:hidden bg-gray-900/50 border-t border-gray-800 px-6 py-3">
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="text-sm text-gray-400 whitespace-nowrap">Watching now:</span>
                {participants?.map((participant) => (
                  <div
                    key={participant?.user_id}
                    className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 whitespace-nowrap overflow-hidden"
                  >
                    <img src={participant?.avatar_url} className="w-8 h-8 rounded-full shrink-0"/>
                    <span className="text-sm truncate">{participant?.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Show Chat Button */}
        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            className="fixed right-6 bottom-6 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all z-50"
          >
            <Users className="w-6 h-6" />
          </button>
        )}
        {isSettingsOpen && (
          <WatchRoomSettings
          room={room} 
          roomParticipants={roomParticipants} 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onKickUser={(participant) => {
            setSelectedUser({
              id: participant.user_id,
              username: participant.profiles?.username || "Unknown",
              avatar_url: participant.profiles?.avatar_url || "",
            });
            setIsKickUser(true);
          }}/>
        )
        }
      </div>

      {isKickUser && (
        <Modal onClose={() => setIsKickUser(false)} title="Confirm Kick">
          {isKicking ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin"></div>
              <p className="text-gray-300">Removing user...</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-gray-300">
                Are you sure you want to remove{" "}
                <span className="text-red-400 font-semibold">{selectedUser?.username}</span> from the room?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsKickUser(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 cursor-pointer rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleKickUser}
                  className="flex-1 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 py-2 cursor-pointer rounded-lg transition-all"
                >
                  Kick User
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}