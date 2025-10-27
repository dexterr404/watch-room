import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Users, MessageCircle, Sparkles, Video, Shield, Zap, ArrowRight } from "lucide-react";
import Background from "../components/layout/Background";

export default function LandingPage() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <Background />
            
            {/* Navigation */}
            <nav className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-white" fill="white" />
                    </div>
                    <span className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        WRoom
                    </span>
                </div>
                <button
                    onClick={() => navigate("/auth")}
                    className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-purple-500/50"
                >
                    Get Started
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative px-6 py-20 flex flex-col items-center text-center">
                <div className={`max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Watch Together, Stay Connected</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold leading-tight mb-6">
                        Your Personal
                        <span className="bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"> Watch Party </span>
                        Space
                    </h1>

                    <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-400 max-w-2xl mx-auto mb-10">
                        Create your own room, invite friends, and watch videos together with real-time chat. 
                        It's like having your own private cinema, but better.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate("/auth")}
                            className="group flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                        >
                            Start Watching Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => {
                                const element = document.getElementById('features');
                                if (element) {
                                    const offset = -60;
                                    const elementPosition = element.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                                    
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 cursor-pointer px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                        >
                            Learn More
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm">
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Real-time
                            </div>
                            <div className="text-gray-500">Live Chat</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Unlimited
                            </div>
                            <div className="text-gray-500">Rooms</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Free
                            </div>
                            <div className="text-gray-500">Forever</div>
                        </div>
                    </div>
                </div>

                {/* Floating Cards Animation */}
                <div className="relative mt-20 w-full max-w-3xl h-64 hidden md:block">
                    <div className="absolute top-0 left-1/4 w-48 h-32 bg-linear-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 animate-float shadow-xl">
                        <Video className="w-8 h-8 text-purple-400 mb-2" />
                        <p className="text-sm text-gray-300">Your Videos</p>
                    </div>
                    <div className="absolute top-16 right-1/4 w-48 h-32 bg-linear-to-br from-pink-600/20 to-red-600/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-4 animate-float-delayed shadow-xl">
                        <MessageCircle className="w-8 h-8 text-pink-400 mb-2" />
                        <p className="text-sm text-gray-300">Live Chat</p>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-linear-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 animate-float-slow shadow-xl">
                        <Users className="w-8 h-8 text-blue-400 mb-2" />
                        <p className="text-sm text-gray-300">Watch Together</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative px-6 py-20 bg-linear-to-b from-transparent to-gray-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Simple, powerful, and built for connection
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-linear-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
                            <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                                <Video className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Your Personal Room</h3>
                            <p className="text-gray-400">
                                Create your very own watch room and share with friends.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-linear-to-br from-pink-900/20 to-transparent border border-pink-500/20 rounded-2xl p-8 hover:border-pink-500/50 transition-all hover:transform hover:scale-105">
                            <div className="w-14 h-14 bg-linear-to-br from-pink-600 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-pink-500/50 transition-shadow">
                                <MessageCircle className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Real-time Chat</h3>
                            <p className="text-gray-400">
                                Chat instantly with everyone watching. React, discuss, and share the moment together.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-linear-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
                            <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Watch Together</h3>
                            <p className="text-gray-400">
                                See who's watching live. Connect with friends no matter where they are.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group bg-linear-to-br from-green-900/20 to-transparent border border-green-500/20 rounded-2xl p-8 hover:border-green-500/50 transition-all hover:transform hover:scale-105">
                            <div className="w-14 h-14 bg-linear-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                            <p className="text-gray-400">
                                Instant room creation, real-time updates, and smooth streaming experience.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group bg-linear-to-br from-yellow-900/20 to-transparent border border-yellow-500/20 rounded-2xl p-8 hover:border-yellow-500/50 transition-all hover:transform hover:scale-105">
                            <div className="w-14 h-14 bg-linear-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-yellow-500/50 transition-shadow">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Private & Secure</h3>
                            <p className="text-gray-400">
                                Your rooms, your rules. Control who joins and keep your watch parties private.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group bg-linear-to-br from-red-900/20 to-transparent border border-red-500/20 rounded-2xl p-8 hover:border-red-500/50 transition-all hover:transform hover:scale-105">
                            <div className="w-14 h-14 bg-linear-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-red-500/50 transition-shadow">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Always Free</h3>
                            <p className="text-gray-400">
                                No premium tiers, no hidden costs. Full features available to everyone, forever.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative px-6 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-linear-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-3xl p-12 backdrop-blur-sm">
                        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-6">
                            Ready to Start Watching?
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of people already enjoying watch parties. Create your first room in seconds.
                        </p>
                        <button
                            onClick={() => navigate("/auth")}
                            className="group inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer px-6 sm:px-10 py-3 sm:py-5 rounded-xl font-semibold transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                        >
                            <span className="text-base sm:text-lg md:text-xl">Get Started Free</span>
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-gray-800/50 px-6 py-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" fill="white" />
                        </div>
                        <span className="font-bold">WRoom</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2025 WRoom. Watch together, stay connected.
                    </p>
                </div>
            </footer>
        </div>
    );
}