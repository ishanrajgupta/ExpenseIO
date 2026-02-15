/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          purple: '#a78bfa',
          pink: '#f472b6',
          cyan: '#22d3ee',
          teal: '#2dd4bf',
          green: '#4ade80',
          orange: '#fb923c',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-success': 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
        'gradient-danger': 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
        'gradient-warning': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-info': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        'gradient-purple': 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
        'gradient-teal': 'linear-gradient(135deg, #5eead4 0%, #14b8a6 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
