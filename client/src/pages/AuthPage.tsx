import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play,ArrowLeft } from "lucide-react"
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
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
            <Background />
            {/* Back Button */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Home</span>
            </button>

            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>

                {/* Main Card */}
                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">
                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
                            <Play className="w-8 h-8 text-white" fill="white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Welcome to WRoom
                        </h1>
                        <p className="text-gray-400">Watch together, anywhere</p>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900 text-gray-500">Sign in to continue</span>
                        </div>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="group w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl px-6 py-4 text-gray-900 font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

                    {/* Features List */}
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Create one watch room</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Join infinite watch rooms</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                            <span>Real-time chat with friends</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Free forever, no limits</span>
                        </div>
                    </div>

                    {/* Footer Text */}
                    <p className="text-center text-xs text-gray-500 mt-8">
                        By continuing, you agree to WRoom's{" "}
                        <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Terms of Service</span>
                        {" "}and{" "}
                        <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Privacy Policy</span>
                    </p>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute -z-10 top-0 left-1/4 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -z-10 bottom-0 right-1/4 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
        </div>
    );
}