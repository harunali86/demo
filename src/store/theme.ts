import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            toggleTheme: () => {
                const newTheme = get().theme === 'dark' ? 'light' : 'dark';
                set({ theme: newTheme });

                // Apply to document
                if (typeof window !== 'undefined') {
                    document.documentElement.classList.remove('dark', 'light');
                    document.documentElement.classList.add(newTheme);
                    document.documentElement.setAttribute('data-theme', newTheme);
                }
            },
            setTheme: (theme) => {
                set({ theme });
                if (typeof window !== 'undefined') {
                    document.documentElement.classList.remove('dark', 'light');
                    document.documentElement.classList.add(theme);
                    document.documentElement.setAttribute('data-theme', theme);
                }
            }
        }),
        {
            name: 'harun-store-theme',
            onRehydrateStorage: () => (state) => {
                // Apply theme on page load
                if (state && typeof window !== 'undefined') {
                    document.documentElement.classList.remove('dark', 'light');
                    document.documentElement.classList.add(state.theme);
                    document.documentElement.setAttribute('data-theme', state.theme);
                }
            }
        }
    )
);
