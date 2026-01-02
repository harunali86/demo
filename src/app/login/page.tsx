'use client';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const { loginGuest } = useAuthStore();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setError('Account created! Check your email to verify.');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        prompt: 'select_account',
                    },
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Google login failed');
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        loginGuest();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans">
            <Navbar />

            <div className="pt-8 pb-16 px-4 flex items-center justify-center">
                <div className="bg-white rounded-[2px] shadow-md flex flex-col md:flex-row max-w-[850px] w-full min-h-[528px] overflow-hidden">
                    {/* Left Banner */}
                    <div className="bg-[#2874f0] text-white p-10 md:w-[40%] flex flex-col justify-between bg-[url('https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png')] bg-no-repeat bg-[center_bottom_3rem]">
                        <div>
                            <h2 className="text-[28px] font-medium mb-4">{isLogin ? 'Login' : 'Looks like you\'re new here!'}</h2>
                            <p className="text-[#dbdbdb] text-[18px] leading-7">
                                {isLogin ? 'Get access to your Orders, Wishlist and Recommendations' : 'Sign up with your mobile number to get started'}
                            </p>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="p-10 md:w-[60%] flex flex-col justify-between">
                        <div className="flex-1">
                            <form className="space-y-6" onSubmit={handleEmailAuth}>
                                {!isLogin && (
                                    <div className="group">
                                        <input
                                            type="text"
                                            placeholder="Enter First Name"
                                            className="w-full border-b border-gray-300 py-2 focus:border-[#2874f0] outline-none text-gray-700 transition"
                                        />
                                    </div>
                                )}

                                <div className="group">
                                    <input
                                        type="email"
                                        placeholder="Enter Email/Mobile number"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full border-b border-gray-300 py-2 focus:border-[#2874f0] outline-none text-gray-700 transition"
                                    />
                                </div>

                                <div className="group">
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full border-b border-gray-300 py-2 focus:border-[#2874f0] outline-none text-gray-700 transition"
                                    />
                                </div>

                                {error && (
                                    <div className={`p-2 text-xs rounded ${error.includes('created') ? 'text-green-600' : 'text-red-500'}`}>
                                        {error}
                                    </div>
                                )}

                                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                                    By continuing, you agree to Flipkart's <a href="#" className="text-[#2874f0]">Terms of Use</a> and <a href="#" className="text-[#2874f0]">Privacy Policy</a>.
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#fb641b] text-white font-medium py-3 rounded-[2px] shadow-sm hover:shadow-md transition uppercase tracking-wide disabled:opacity-70 mt-4"
                                >
                                    {loading ? 'Please wait...' : isLogin ? 'Login' : 'Continue'}
                                </button>

                                {isLogin && (
                                    <div className="text-center mt-2">
                                        <span className="text-xs text-gray-500">OR</span>
                                    </div>
                                )}

                                {isLogin && (
                                    <button
                                        type="button"
                                        className="w-full bg-white text-[#2874f0] font-medium py-3 rounded-[2px] shadow-sm border border-gray-200 mt-2 hover:shadow-md transition"
                                    >
                                        Request OTP
                                    </button>
                                )}
                            </form>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-[#2874f0] font-medium text-sm hover:underline"
                                >
                                    {isLogin ? 'New to Flipkart? Create an account' : 'Existing User? Log in'}
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <button
                                    onClick={handleGuestLogin}
                                    className="text-gray-500 font-medium text-sm hover:underline"
                                >
                                    Skip & Continue as Guest
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
