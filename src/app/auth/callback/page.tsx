'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

import { Suspense } from 'react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Processing login...');
    const { login } = useAuthStore();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Check for error in URL
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (error) {
                    console.error('OAuth error:', error, errorDescription);
                    setStatus('Login failed. Redirecting...');
                    setTimeout(() => router.push('/login?error=' + error), 1500);
                    return;
                }

                setStatus('Verifying authentication...');

                // Exchange the code for a session
                // Supabase handles this automatically via the URL hash
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    setStatus('Session error. Redirecting...');
                    setTimeout(() => router.push('/login?error=session_failed'), 1500);
                    return;
                }

                if (session) {
                    setStatus('Login successful! Redirecting...');

                    // Update auth store with user info
                    login({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    });

                    // Small delay for user to see success message
                    setTimeout(() => router.push('/'), 500);
                } else {
                    // Try to refresh the auth state
                    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

                    if (refreshData?.session) {
                        setStatus('Login successful! Redirecting...');
                        login({
                            id: refreshData.session.user.id,
                            email: refreshData.session.user.email || '',
                            name: refreshData.session.user.user_metadata?.full_name || 'User',
                        });
                        setTimeout(() => router.push('/'), 500);
                    } else {
                        console.error('No session found after refresh:', refreshError);
                        setStatus('No session found. Redirecting to login...');
                        setTimeout(() => router.push('/login'), 1500);
                    }
                }
            } catch (err) {
                console.error('Auth callback exception:', err);
                setStatus('An error occurred. Redirecting...');
                setTimeout(() => router.push('/login?error=exception'), 1500);
            }
        };

        // Small delay to ensure URL hash is available
        setTimeout(handleAuthCallback, 100);
    }, [router, searchParams, login]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-white text-xl font-semibold">{status}</p>
                <p className="text-gray-400 text-sm mt-3">Please wait...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
