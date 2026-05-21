import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#944555",
          container: "#f191a1",
          on: "#ffffff",
          "on-container": "#6f2838",
          fixed: "#ffd9dd",
          "fixed-dim": "#ffb2bd",
        },
        secondary: {
          DEFAULT: "#575d78",
          container: "#d8defe",
          on: "#ffffff",
          "on-container": "#5b617d",
          fixed: "#dce1ff",
          "fixed-dim": "#bfc5e4",
        },
        tertiary: {
          DEFAULT: "#605e5e",
          container: "#b0acac",
          on: "#ffffff",
          "on-container": "#424040",
          fixed: "#e6e1e1",
          "fixed-dim": "#cac5c6",
        },
        surface: {
          DEFAULT: "#f9f9f9",
          dim: "#dadada",
          bright: "#f9f9f9",
          container: {
            lowest: "#ffffff",
            low: "#f3f3f3",
            DEFAULT: "#eeeeee",
            high: "#e8e8e8",
            highest: "#e2e2e2",
          },
          "on-variant": "#534345",
          variant: "#e2e2e2",
          on: "#1a1c1c",
        },
        background: "#f9f9f9",
        "on-background": "#1a1c1c",
        outline: "#867274",
        "outline-variant": "#d9c1c3",
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          on: "#ffffff",
          "on-container": "#93000a",
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
        serif: ["Cormorant Garamond", "ui-serif", "Georgia"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      spacing: {
        unit: "8px",
        gutter: "24px",
        "element-gap": "16px",
        "section-padding": "120px",
        "container-max": "1280px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
