import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css,ts}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        surfaceMuted: "hsl(var(--surface-muted) / <alpha-value>)",
        surfaceContrast: "hsl(var(--surface-contrast) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        accentSoft: "hsl(var(--accent-soft) / <alpha-value>)",
        accentStrong: "hsl(var(--accent-strong) / <alpha-value>)",
        successAccent: "hsl(var(--success) / <alpha-value>)",
        dangerAccent: "hsl(var(--danger) / <alpha-value>)",
        warningAccent: "hsl(var(--warning) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
      },
      boxShadow: {
        floating: "0px 28px 65px -40px rgba(9, 23, 42, 0.55)",
        soft: "0px 24px 45px -38px rgba(15, 23, 42, 0.45)",
        hero: "0px 35px 85px -50px rgba(8, 14, 40, 0.75)",
      },
      borderRadius: {
        hero: "2.5rem",
      },
      transitionTimingFunction: {
        'soft-bounce': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [nextui()],
};
export default config;
