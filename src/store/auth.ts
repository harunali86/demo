import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthState {
    user: User | null;
    isGuest: boolean;
    isAuthenticated: boolean;
    login: (user: User) => void;
    loginGuest: () => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isGuest: false,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true, isGuest: false }),
            loginGuest: () => set({
                user: { id: 'guest', email: 'guest@harunstore.com', name: 'Guest User' },
                isAuthenticated: true,
                isGuest: true
            }),
            logout: () => set({ user: null, isAuthenticated: false, isGuest: false }),
            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),
        }),
        {
            name: 'auth-storage',
        }
    )
);
