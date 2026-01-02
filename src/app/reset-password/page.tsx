'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setSuccess(true);

            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    {success ? (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Password Reset!</h1>
                            <p className="text-gray-400 mb-6">
                                Your password has been successfully updated. Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                                <p className="text-gray-400">Enter your new password</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-sm text-gray-400 mt-6">
                                <Link href="/login" className="text-primary hover:underline">
                                    Back to Login
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
