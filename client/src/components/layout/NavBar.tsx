import { useState } from "react";
import { LogOut, Play } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

import DropdownMenu from "../ui/DropdownMenu"
import DropdownMenuItem from "../ui/DropdownMenuItem"
import Modal from "../ui/Modal"
import type { User } from "../../types/User";

type NavBarProps = {
    user: User
}

export default function NavBar({user}: NavBarProps) {
    const navigate = useNavigate();
    const[isMenuOpen, setIsMenuOpen] = useState(false);
    const[isLogout, setIsLogout] = useState(false);
    const[isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // redirect to login page
        navigate("/auth", { replace: true });
        } catch (err) {
        console.error("Logout failed:", err);
        alert("Failed to logout. Please try again.");
        }
    };

    return (
        <div>
            <div className="relative border-b border-gray-800 bg-black/50 backdrop-blur-sm z-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5" fill="white" />
                        </div>
                        <h1 className="text-2xl font-bold">WRoom</h1>
                    </div>

                    {/* User Profile */}
                    <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex relative items-center gap-3 bg-gray-900 rounded-full px-4 py-2 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                        <img src={user.avatar_url} className="w-8 h-8 rounded-full"/>
                        <span className="text-sm font-medium sm:block hidden">{user.username}</span>
                        <DropdownMenu isOpen={isMenuOpen} className="top-full p-0 mt-2 right-0 w-48 z-100">
                            <DropdownMenuItem icon={LogOut} onClick={() => setIsLogout(true)}>Logout</DropdownMenuItem>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {isLogout && (
                <Modal onClose={() => setIsLogout(false)} title="Confirm Logout">
                    {isLoggingOut ? (
                        // Loading state
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
                            <p className="text-gray-300">Logging out...</p>
                        </div>
                    ) : (
                        // Normal state
                        <>
                            <p className="mb-4 text-gray-300">Are you sure you want to logout?</p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsLogout(false)} 
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 cursor-pointer rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleLogout} 
                                    className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-2 cursor-pointer rounded-lg transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </Modal>
            )}
        </div>
    )
}