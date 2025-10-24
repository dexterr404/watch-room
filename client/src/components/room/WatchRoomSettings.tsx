import { useState } from "react";
import { X, ChevronDown, ChevronUp, Video, Lock, MessageSquare, Info, Shield } from "lucide-react";

type WatchRoomSettingsProps = {
    isOpen: boolean;
    onClose: () => void;
}

export default function WatchRoomSettings({ isOpen, onClose }: WatchRoomSettingsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

    const participants = [
    { id: 1, name: 'Alice', avatar: 'A', color: 'from-blue-500 to-purple-500' },
    { id: 2, name: 'Bob', avatar: 'B', color: 'from-green-500 to-teal-500' },
    { id: 3, name: 'Charlie', avatar: 'C', color: 'from-pink-500 to-red-500' },
    ];


  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Background overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-gray-900 border-l border-gray-800 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Room Settings</h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sections */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-70px)]">
        {/* General Info */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <button
              onClick={() => toggleSection("general")}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                <span className="font-medium">General Settings</span>
              </div>
              {openSection === "general" ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSection === "general" && (
            <div className="pt-2 pb-4 px-4 space-y-3">
                <label className="block">
                <span className="text-sm text-gray-400">Room Name</span>
                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" />
                </label>

                <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Room Code: 9FGT2</span>
                <button className="text-blue-400 text-sm hover:underline">Copy</button>
                </div>

                <label className="block">
                <span className="text-sm text-gray-400">Room Type</span>
                <select className="w-full bg-gray-800 rounded p-2 mt-1">
                    <option>Public</option>
                    <option>Private</option>
                </select>
                </label>
            </div>
            )}
        </div>
        {/* Video Section */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <button
            onClick={() => toggleSection("video")}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg"
            >
            <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Video Settings</span>
            </div>
            {openSection === "video" ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSection === "video" && (
            <div className="pt-1 px-4 pb-4 text-sm text-gray-300 space-y-3 animate-fadeIn">
                <div>
                <label className="block text-gray-400 mb-1">Change Video URL</label>
                <input
                    type="text"
                    placeholder="Paste new video link..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none"
                />
                </div>
                <div>
                <label className="block text-gray-400 mb-1">Upload Video</label>
                <input
                    type="file"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
                </div>
                <button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm px-4 py-2 rounded-lg">
                Save Changes
                </button>
            </div>
            )}
          </div>

          {/* Privacy Section */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <button
              onClick={() => toggleSection("privacy")}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Privacy Settings</span>
              </div>
              {openSection === "privacy" ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSection === "privacy" && (
              <div className="px-4 pb-4 text-sm text-gray-300 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pt-2">
                  <span>Room Visibility</span>
                  <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-purple-500">
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <button
              onClick={() => toggleSection("chat")}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-400" />
                <span className="font-medium">Chat Settings</span>
              </div>
              {openSection === "chat" ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSection === "chat" && (
              <div className="px-4 pb-4 text-sm text-gray-300 space-y-3 animate-fadeIn">
                <div className="flex pt-2 items-center justify-between">
                  <span>Auto-scroll Messages</span>
                  <input type="checkbox" className="accent-purple-500 w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Moderation */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <button
                onClick={() => toggleSection("moderation")}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg"
            >
                <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="font-medium">Moderation</span>
                </div>
                {openSection === "moderation" ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSection === "moderation" && (
                <div className="pt-2 pb-4 px-4 space-y-3">
                {participants.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center">No participants in this room.</p>
                ) : (
                    participants.map((p) => (
                    <div
                        key={p.id}
                        className="flex items-center justify-between bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2"
                    >
                        <div className="flex items-center gap-2">
                        <div
                            className={`w-6 h-6 bg-linear-to-br ${p.color} rounded-full flex items-center justify-center text-xs font-semibold`}
                        >
                            {p.avatar}
                        </div>
                        <span className="text-sm font-medium">{p.name}</span>
                        </div>
                        <div className="flex gap-2">
                        <button
                            className="text-xs text-red-400 hover:text-red-500 border border-red-500/30 px-2 py-1 rounded-lg transition"
                            onClick={() => console.log("player banned")}
                        >
                            Ban
                        </button>
                        </div>
                    </div>
                    ))
                )}
                </div>
            )}
            </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
             onClick={onClose}
             className="px-6 py-2 bg-linear-to-br from-purple-600 to-pink-600 cursor-pointer hover:from-purple-700 hover:to-pink-700 text-white rounded-lg">
            Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}