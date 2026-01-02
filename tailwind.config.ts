import type { Config } from "tailwindcss";

export default {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Color - Orange
                primary: {
                    DEFAULT: "#f97316",
                    dark: "#ea580c",
                    light: "#fb923c",
                },
                // Background colors
                background: "#0a0a0f",
                card: "#12121a",
                elevated: "#1a1a24",
                // Semantic colors
                deal: "#ef4444",
                rating: "#fbbf24",
                success: "#10b981",
                warning: "#f59e0b",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config;
