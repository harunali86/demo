'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useThemeStore((state) => state.theme);
    const [mounted, setMounted] = useState(false);

    // Apply theme when it changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
        root.setAttribute('data-theme', theme);

        document.body.classList.remove('dark', 'light');
        document.body.classList.add(theme);
    }, [theme]);

    // Initial mount - default to dark
    useEffect(() => {
        setMounted(true);

        try {
            const storedTheme = localStorage.getItem('harun-store-theme');
            if (storedTheme) {
                const parsed = JSON.parse(storedTheme);
                const savedTheme = parsed?.state?.theme || 'dark';

                document.documentElement.classList.remove('dark', 'light');
                document.documentElement.classList.add(savedTheme);
                document.body.classList.remove('dark', 'light');
                document.body.classList.add(savedTheme);
            } else {
                // Default to DARK
                document.documentElement.classList.add('dark');
                document.body.classList.add('dark');
            }
        } catch (e) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        }
    }, []);

    if (!mounted) {
        // Show dark mode by default during SSR
        return <div className="dark">{children}</div>;
    }

    return <>{children}</>;
}
