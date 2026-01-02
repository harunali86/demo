'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center mb-4 text-white shadow-lg shadow-primary/20">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Enter your email to receive recovery instructions</p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-none">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Check your email</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                We have sent password reset instructions to <strong>{email}</strong>
                            </p>
                            <Link
                                href="/admin/login"
                                className="inline-block w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/25 mt-4"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@harunstore.com"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary outline-none focus:ring-1 focus:ring-primary/50"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Back to Login */}
                {!success && (
                    <Link
                        href="/admin/login"
                        className="flex items-center justify-center gap-2 mt-6 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                )}
            </div>
        </div>
    );
}
