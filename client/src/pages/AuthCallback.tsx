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
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-red-500">
            <div className="flex flex-col items-center gap-4">
                {/* Spinning circle with logo */}
                <div className="relative">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-10 h-10 text-white" fill="white" />
                    </div>
                    <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                
                {/* Text */}
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-1">Authenticating</h2>
                    <p className="text-white/80 text-sm">Please wait...</p>
                </div>
            </div>
        </div>
        </>
    )
}
