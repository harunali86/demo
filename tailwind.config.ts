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
                // Primary Brand (Flipkart Blue style but vibrant)
                primary: {
                    DEFAULT: "#2874f0", // The iconic blue
                    dark: "#1e5bbf",
                    light: "#5c92f5",
                },
                // Secondary (Action/Highlight - Yellow)
                secondary: {
                    DEFAULT: "#ffe500", // The iconic yellow
                    dark: "#e6ce00",
                },
                // Backgrounds (Clean Light Mode)
                background: "#f1f3f6", // Light gray background common in e-commerce
                surface: "#ffffff",    // Pure white for cards/sections

                // Semantic
                text: {
                    primary: "#212121",   // Nearly black
                    secondary: "#878787", // Gray text
                    muted: "#c2c2c2",     // Disabled/Placeholder
                },
                success: "#388e3c", // Green for offers/stock
                warning: "#ff9f00", // Orange for limited time
                error: "#ff6161",
                border: "#f0f0f0",  // Very subtle border
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config;
