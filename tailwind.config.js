/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./client/src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Source Code Pro"', "monospace"],
        bebas: ['"Bebas Neue"', "sans-serif"],
        jetbrains: ['"JetBrains Mono"', "monospace"],
        space: ['"Space Mono"', "monospace"],
        ibm: ['"IBM Plex Mono"', "monospace"],
        fira: ['"Fira Code"', "monospace"],
        inconsolata: ['"Inconsolata"', "monospace"],
        roboto: ['"Roboto Mono"', "monospace"],
        grotesk: ['"Space Grotesk"', "sans-serif"],
      },
      colors: {
        primary: "hsl(var(--color-primary) / <alpha-value>)",
        secondary: "hsl(var(--color-secondary) / <alpha-value>)",
        accent: "hsl(var(--color-accent) / <alpha-value>)",
        text: "hsl(var(--color-text) / <alpha-value>)",
        background: "hsl(var(--color-background) / <alpha-value>)",
        surface: "hsl(var(--color-surface) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
