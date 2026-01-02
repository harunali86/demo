'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { login, logout } = useAuthStore();

    useEffect(() => {
        // Check active session on mount
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session?.user) {
                login({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                });
            } else if (error) {
                // If there's an error (like invalid refresh token), ensure we are logged out locally
                console.warn('Auth session error, logging out:', error.message);
                logout();
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                login({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                });
            } else if (event === 'SIGNED_OUT') {
                logout();
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                // Update user if needed (e.g. metadata changed)
                login({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [login, logout]);

    return <>{children}</>;
}
