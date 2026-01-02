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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2874f0] flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/20">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-gray-500 mt-1">Enter admin credentials to continue</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-xl shadow-gray-200/50">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@harunstore.com"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#2874f0] text-white font-bold rounded-xl hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
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
                    className="flex items-center justify-center gap-2 mt-8 text-sm font-medium text-gray-500 hover:text-[#2874f0] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </Link>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-blue-700 text-sm font-bold mb-1">🎯 Demo Credentials:</p>
                    <p className="text-blue-600/80 text-sm font-mono leading-relaxed">
                        Email: admin@harunstore.com<br />
                        Password: admin123
                    </p>
                </div>
            </div>
        </div>
    );
}
