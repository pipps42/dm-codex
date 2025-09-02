const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Steel Blue & Slate Dark Theme
        background: '#0a0a0a',     // Deep black
        foreground: '#ffffff',     // Pure white text
        
        card: {
          DEFAULT: '#262626',      // Charcoal cards
          foreground: '#e5e7eb',   // Light grey text
        },
        
        popover: {
          DEFAULT: '#262626',      // Same as cards
          foreground: '#e5e7eb',   // Light grey
        },
        
        primary: {
          DEFAULT: '#3b82f6',      // Steel Blue 500
          foreground: '#ffffff',   // White text on blue
        },
        
        secondary: {
          DEFAULT: '#374151',      // Slate 600
          foreground: '#f9fafb',   // Very light text
        },
        
        muted: {
          DEFAULT: '#374151',      // Slate 600
          foreground: '#9ca3af',   // Grey 400
        },
        
        accent: {
          DEFAULT: '#60a5fa',      // Steel Blue 400 (lighter)
          foreground: '#0f172a',   // Dark slate
        },
        
        destructive: {
          DEFAULT: '#dc2626',      // Red 600
          foreground: '#ffffff',   // White text
        },
        
        border: '#374151',         // Slate 600 borders
        input: '#1f2937',          // Darker input bg
        ring: '#3b82f6',           // Steel Blue focus ring
      },
      fontFamily: {
        'fantasy': ['Cinzel', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [],
}