'use client';

import Navbar from '@/components/ui/Navbar';
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
                        prompt: 'select_account', // Always show account picker
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
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
            <Navbar />

            <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    {/* Decorative Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />

                    <h1 className="text-3xl font-bold mb-2 text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="text-gray-400 text-center mb-8 text-sm">
                        {isLogin ? 'Sign in to access your account' : 'Join us for exclusive offers'}
                    </p>

                    {error && (
                        <div className={`mb-4 p-3 rounded-xl text-sm text-center ${error.includes('created') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 mb-6 active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-xs text-gray-500 uppercase">Or use email</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <form className="space-y-4" onSubmit={handleEmailAuth}>
                        {!isLogin && (
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-70"
                        >
                            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
                        </button>

                        {isLogin && (
                            <div className="text-center">
                                <a href="/forgot-password" className="text-sm text-gray-400 hover:text-primary transition">
                                    Forgot Password?
                                </a>
                            </div>
                        )}
                    </form>

                    <button
                        onClick={handleGuestLogin}
                        className="w-full mt-4 py-3 text-sm text-gray-400 hover:text-white border border-white/10 rounded-xl hover:border-white/30 transition-all"
                    >
                        Continue as Guest
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-white font-bold hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
