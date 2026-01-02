'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

// DEMO MODE - Hardcoded admin credentials
const DEMO_ADMIN = {
    email: 'admin@harunstore.com',
    password: 'admin123'
};

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // DEMO: Simple credential check
        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
            // Store admin session in localStorage for demo
            localStorage.setItem('admin_session', JSON.stringify({ email, isAdmin: true }));
            router.push('/admin');
        } else {
            setError('Invalid credentials. Use admin@harunstore.com / admin123');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center mb-4 text-white shadow-lg shadow-orange-500/20">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <p className="text-gray-400 mt-1">Enter admin credentials to continue</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-6 space-y-4 shadow-xl shadow-black/50">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Admin Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@harunstore.com"
                                className="w-full pl-12 pr-4 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-xl text-white placeholder:text-gray-600 focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-xl text-white placeholder:text-gray-600 focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                Login to Admin Panel
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Store */}
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 mt-6 text-gray-500 hover:text-orange-500 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </Link>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-blue-400 text-sm font-medium mb-1">🎯 Demo Credentials:</p>
                    <p className="text-gray-300 text-sm font-mono">
                        Email: admin@harunstore.com<br />
                        Password: admin123
                    </p>
                </div>
            </div>
        </div>
    );
}
