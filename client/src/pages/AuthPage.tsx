import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react"
import { supabase } from "../config/supabaseClient";
import Background from "../components/layout/Background";

export default function AuthPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            navigate("/room");
        }
        };
        checkSession();
    }, [navigate]);

    const handleGoogleSignIn = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
        redirectTo: `${window.location.origin}/auth/callback`, // frontend callback page
        },
    });

    if (error) {
        console.error(error);
        alert("Failed to sign in with Google");
        setIsLoading(false);
    }
    };

    {/*
    async function handleSignUp() {
        setLoading(true);
        setMessage("");
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
        setMessage(error.message);
        } else if (data.user) {
        await registerUser();
        setUser(data.user);
        setMessage("Signed up and profile created!");
        }
        setLoading(false);
    }*/}
    
    return(
        <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <Background />
            {/* Auth Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl mb-4 shadow-lg">
                    <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">WRoom</h1>
                    <p className="text-gray-600">Watch together, anywhere</p>
                </div>

                {/* Divider */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Sign in to continue</span>
                    </div>
                </div>

                {/* Google Sign In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-xl px-6 py-4 text-gray-700 font-semibold cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    ) : (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                        </svg>
                        <span>Continue with Google</span>
                    </>
                    )}
                </button>

                {/* Footer Text */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    By continuing, you agree to WRoom's Terms of Service and Privacy Policy
                </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 top-4 left-4 right-4 h-full bg-linear-to-br from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-50"></div>
            </div>
        </div>
    )
}