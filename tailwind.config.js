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
                    bg: "#FAF7F2",
                    "bg-alt": "#F5EFEB",
                    "bg-card": "#FDFBF7",
                    cream: "#EFE7DE",
                    rose: "#6B2135",
                    "rose-dark": "#4A1523",
                    "rose-light": "#7A283E",
                    blush: "#E8D5D8",
                    "blush-hover": "#D9B4B8",
                    gold: "#C5A059",
                    "gold-light": "#E5D4AA",
                    charcoal: "#2A2424",
                    taupe: "#6E6564",
                    "muted-border": "#E5DCD3",
                },
            },
            fontFamily: {
                serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "serif"],
                sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
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
