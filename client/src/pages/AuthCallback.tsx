import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { registerUser } from "../api/authService";
import { Play } from "lucide-react";

export default function AuthCallback() {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const handleAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            console.log("Session:", session);

            if (session) {
            console.log("Registering user...");
            await registerUser();
            navigate("/room");
            } else {
            navigate("/login");
            }
        } catch (err) {
            console.error("Error:", err);
        }
        };

        handleAuth();
    }, [navigate]);


    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-950 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                    {/* Spinning circles with logo */}
                    <div className="relative">
                        {/* Outer spinning ring */}
                        <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin"></div>
                        
                        {/* Middle spinning ring (opposite direction) */}
                        <div className="absolute inset-2 w-20 h-20 border-4 border-transparent border-b-pink-500 border-l-purple-500 rounded-full animate-spin-reverse"></div>
                        
                        {/* Logo container */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse-slow">
                                <Play className="w-7 h-7 text-white" fill="white" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Text with fade animation */}
                    <div className="text-center animate-fade-in">
                        <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Authenticating
                        </h2>
                        <p className="text-gray-400 text-sm">Securing your session...</p>
                    </div>

                    {/* Loading dots */}
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </>
    )
}
