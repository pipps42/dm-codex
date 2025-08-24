const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Steel Blue & Slate Palette - Plugin injection
        border: "#374151",         // Slate 600
        input: "#1f2937",          // Gray 800  
        ring: "#3b82f6",           // Blue 500
        background: "#0a0a0a",     // Deep black - PLUGIN FORCED
        foreground: "#ffffff",     // Pure white
        primary: {
          DEFAULT: "#3b82f6",      // Steel Blue 500
          foreground: "#ffffff",   // White
        },
        secondary: {
          DEFAULT: "#374151",      // Slate 600
          foreground: "#f9fafb",   // Very light
        },
        destructive: {
          DEFAULT: "#dc2626",      // Red 600
          foreground: "#ffffff",   // White
        },
        muted: {
          DEFAULT: "#374151",      // Slate 600
          foreground: "#9ca3af",   // Gray 400
        },
        accent: {
          DEFAULT: "#60a5fa",      // Steel Blue 400 (lighter)
          foreground: "#0f172a",   // Dark slate
        },
        popover: {
          DEFAULT: "#262626",      // Charcoal
          foreground: "#e5e7eb",   // Light grey
        },
        card: {
          DEFAULT: "#262626",      // Charcoal - PLUGIN FORCED
          foreground: "#e5e7eb",   // Light grey
        },
      },
      fontFamily: {
        'fantasy': ['Cinzel', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        shimmer: {
          '0%': { 
            backgroundPosition: '-200px 0' 
          },
          '100%': { 
            backgroundPosition: 'calc(200px + 100%) 0' 
          }
        }
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    // Plugin per forzare i colori Steel Blue & Slate
    plugin(function({ addBase, addUtilities }) {
      // Inietta CSS base con !important
      addBase({
        'body': {
          'background-color': '#0a0a0a !important',
          'color': '#ffffff !important',
        },
        // Forza i colori delle utility classes
        '.bg-background': {
          'background-color': '#0a0a0a !important',
        },
        '.bg-card': {
          'background-color': '#262626 !important',
        },
        '.bg-primary': {
          'background-color': '#3b82f6 !important',
        },
        '.text-foreground': {
          'color': '#ffffff !important',
        },
        '.text-card-foreground': {
          'color': '#e5e7eb !important',
        },
      })
      
      // Utility classes aggiuntive se necessario
      addUtilities({
        '.debug-bg': {
          'background-color': '#ff0000 !important', // Rosso per debug
        }
      })
    })
  ],
}
