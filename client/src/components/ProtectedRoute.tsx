import { Navigate } from "react-router-dom"
import { Play } from 'lucide-react';
import type { User } from "../types/User"

type ProtectedRouteProps = {
    user: User,
    children: React.ReactNode
    loading: boolean;
}

export default function ProtectedRoute({user, children, loading}: ProtectedRouteProps) {
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    {/* Animated Logo */}
                    <div className="relative">
                        <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse">
                            <Play className="w-8 h-8 text-white" fill="white" />
                        </div>
                        {/* Spinning ring */}
                        <div className="absolute inset-0 border-4 border-purple-500/30 border-t-purple-500 rounded-2xl animate-spin"></div>
                    </div>
                    
                    {/* Text */}
                    <div className="text-center">
                        <p className="text-white font-semibold">WRoom</p>
                        <p className="text-gray-400 text-sm mt-1">Checking session...</p>
                    </div>
                </div>
            </div>
        );
    }

    if(!user) {
        return <Navigate to='/login' replace />
    }
        
    return children
}