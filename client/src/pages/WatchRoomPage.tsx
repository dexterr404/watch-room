import { useState,useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Send, Settings, ArrowLeftToLine } from 'lucide-react';
import WatchRoomSettings from '../components/room/WatchRoomSettings';
import ReactPlayer from 'react-player';

export default function RoomPage() {
  const navigate = useNavigate();
  const messages = [
    { id: 1, user: 'Alice', avatar: 'A', message: 'This scene is amazing!', time: '10:23 PM' },
    { id: 2, user: 'Bob', avatar: 'B', message: 'I know right! 🔥', time: '10:24 PM' },
    { id: 3, user: 'Charlie', avatar: 'C', message: 'Best movie ever', time: '10:25 PM' },
  ];

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevMessageCount = useRef(messages.length);
  const [showChat, setShowChat] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const room = {
    id: 1,
    title: 'Garp vs Aokiji ',
    participants: 12,
    videoUrl: 'https://www.youtube.com/watch?v=39pVcYU5Oo4'
  };

 

  const participants = [
    { id: 1, name: 'Alice', avatar: 'A', color: 'from-blue-500 to-purple-500' },
    { id: 2, name: 'Bob', avatar: 'B', color: 'from-green-500 to-teal-500' },
    { id: 3, name: 'Charlie', avatar: 'C', color: 'from-pink-500 to-red-500' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
                <h1 className="text-[clamp(1rem,2vw+0.5rem,1.5rem)] font-bold">{room.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Users className="w-4 h-4" />
                    <span>{room.participants} watching</span>
                </div>
            </div>
          </div>
          <button
           onClick={() => setIsSettingsOpen(prev => !prev)}
           className="cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Video Section */}
        <div className="flex-1 flex flex-col bg-black">
          {/* Video Player */}
          <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
            <ReactPlayer
              src={room.videoUrl}
              controls
              width="100%"
              height="100%"
            />
            
          </div>

          {/* Participants Bar */}
          <div className="hidden md:block bg-gray-900/50 border-t border-gray-800 px-6 py-3">
            <div className="flex items-center flex-wrap gap-3">
              <span className="text-sm text-gray-400 whitespace-nowrap">Watching now:</span>
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 whitespace-nowrap"
                >
                  <div className={`w-6 h-6 bg-linear-to-br ${participant.color} rounded-full flex items-center justify-center text-xs font-semibold`}>
                    {participant.avatar}
                  </div>
                  <span className="text-sm">{participant.name}</span>
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
            <div className="flex-1 min-h-[200px] max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-auto-hide p-4 space-y-4">
              {messages.map((msg) => (
                <div ref={messagesEndRef} key={msg.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1 wrap-break-words">{msg.message}</p>
                  </div>
                </div>
              ))}
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
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 whitespace-nowrap"
                  >
                    <div className={`w-6 h-6 bg-linear-to-br ${participant.color} rounded-full flex items-center justify-center text-xs font-semibold`}>
                      {participant.avatar}
                    </div>
                    <span className="text-sm">{participant.name}</span>
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
          <WatchRoomSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}/>
        )
        }
      </div>
    </div>
  );
}