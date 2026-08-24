/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                boutique: {
                    // Cream / ivory base
                    bg: "#F7F4EE",
                    "bg-alt": "#EFEBE3",
                    "bg-card": "#FCFAF5",
                    cream: "#EAE4D9",
                    // Primary accent: remapped from maroon -> deep emerald (luxury editorial)
                    rose: "#1F4A3B",
                    "rose-dark": "#123026",
                    "rose-light": "#2E6350",
                    // Soft sage tint (was blush)
                    blush: "#DDE7DE",
                    "blush-hover": "#C4D5C7",
                    // Muted warm gold accent
                    gold: "#B08C4F",
                    "gold-light": "#E1D2AC",
                    // Near-black ink
                    charcoal: "#1A1917",
                    taupe: "#6B655E",
                    "muted-border": "#E3DCD1",
                },
            },
            fontFamily: {
                serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "serif"],
                sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
                script: ["var(--font-script)", "Alex Brush", "cursive"],
            },
            animation: {
                "float-slow": "float 6s ease-in-out infinite",
                "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                pulseSubtle: {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.8 },
                },
            },
        },
    },
    plugins: [],
};
