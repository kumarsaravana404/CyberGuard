/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional dark theme palette
        brand: {
          dark: '#0f172a',    // Background
          card: '#1e293b',    // Card bg
          accent: '#3b82f6',  // Primary Blue
          success: '#10b981', // Green
          warning: '#f59e0b', // Yellow
          danger: '#ef4444',  // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
