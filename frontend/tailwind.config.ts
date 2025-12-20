import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            animation: {
                "shimmer-slide": "shimmer-slide 3s ease-in-out infinite alternate",
                "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                slide: "slide var(--speed) ease-in-out infinite alternate",
                flip: "flip 6s infinite steps(2, end)",
                rotate: "rotate 3s linear infinite both",
            },
            keyframes: {
                "spin-around": {
                    "0%": { transform: "translateZ(0) rotate(0)" },
                    "15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
                    "65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
                    "100%": { transform: "translateZ(0) rotate(360deg)" },
                },
                "shimmer-slide": {
                    to: { transform: "translate(calc(100cqw - 100%), 0)" },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                slide: {
                    to: {
                        transform: "translate(calc(100cqw - 100%), 0)",
                    },
                },
                flip: {
                    to: { transform: "rotate(360deg)" },
                },
                rotate: {
                    to: { transform: "rotate(90deg)" },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
