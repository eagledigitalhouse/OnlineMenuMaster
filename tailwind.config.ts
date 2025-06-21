import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        // Cores FENUI
        "fenui-red": {
          50: "var(--fenui-red-50)",
          100: "var(--fenui-red-100)",
          DEFAULT: "var(--fenui-red-500)",
          500: "var(--fenui-red-500)",
          600: "var(--fenui-red-600)",
          700: "var(--fenui-red-700)",
        },
        "fenui-yellow": {
          50: "var(--fenui-yellow-50)",
          100: "var(--fenui-yellow-100)",
          DEFAULT: "var(--fenui-yellow-500)",
          500: "var(--fenui-yellow-500)",
          600: "var(--fenui-yellow-600)",
          700: "var(--fenui-yellow-700)",
        },
        "fenui-green": {
          50: "var(--fenui-green-50)",
          100: "var(--fenui-green-100)",
          DEFAULT: "var(--fenui-green-500)",
          500: "var(--fenui-green-500)",
          600: "var(--fenui-green-600)",
          700: "var(--fenui-green-700)",
        },
        "fenui-blue": {
          50: "var(--fenui-blue-50)",
          100: "var(--fenui-blue-100)",
          DEFAULT: "var(--fenui-blue-500)",
          500: "var(--fenui-blue-500)",
          600: "var(--fenui-blue-600)",
          700: "var(--fenui-blue-700)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;