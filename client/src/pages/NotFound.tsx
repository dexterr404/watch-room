import { useNavigate } from 'react-router-dom';
import { Play, Home, Search } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated stars background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: Math.random() * 0.5 + 0.3
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-md">
                {/* 404 with floating effect */}
                <div className="mb-8 animate-bounce">
                    <h1 className="text-8xl md:text-9xl font-bold bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        404
                    </h1>
                </div>

                {/* Sad TV icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 bg-gray-900 border-4 border-gray-800 rounded-2xl flex items-center justify-center relative">
                        <Play className="w-12 h-12 text-gray-700" fill="currentColor" />
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Room Not Found</h2>
                <p className="text-gray-400 mb-8">
                    Oops! This watch room doesn't exist or has been removed.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                        <Search className="w-5 h-5" />
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/room')}
                        className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 cursor-pointer hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/50"
                    >
                        <Home className="w-5 h-5" />
                        Go to Rooms
                    </button>
                </div>

                {/* Easter egg text */}
                <p className="text-gray-600 text-sm mt-12 animate-pulse">
                    Lost in the digital void... 🌌
                </p>
            </div>
        </div>
    );
}