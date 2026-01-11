/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern SaaS Palette - Refined with proper contrast and readability
        'primary': {
          25: '#fdfbff',   // Almost white lavender
          50: '#faf8ff',   // Lightest lavender
          100: '#f5f3ff',  // Very light lavender
          200: '#ede9ff',  // Light lavender
          300: '#ddd5ff',  // Soft lavender
          400: '#c9b5ff',  // Muted lavender
          500: '#a88fff',  // Medium lavender
          600: '#9370db',  // Thistle primary
          700: '#7d45c6',  // Deep thistle
          800: '#6d28d9',  // Rich violet
          900: '#5b21b6',  // Darkest violet
        },
        'secondary': {
          50: '#f9fafb',   // Off-white
          100: '#f3f4f6',  // Light gray
          200: '#e5e7eb',  // Medium light gray
          300: '#d1d5db',  // Medium gray
          400: '#9ca3af',  // Gray
          500: '#6b7280',  // Dark gray
          600: '#4b5563',  // Darker gray
          700: '#374151',  // Very dark gray
          800: '#1f2937',  // Near black
          900: '#111827',  // Black
        },
        'accent': {
          'blue': '#3b82f6',     // Accent blue
          'violet': '#a78bfa',   // Soft violet
          'pink': '#f472b6',     // Soft pink
          'green': '#34d399',    // Mint green
          'amber': '#fcd34d',    // Soft amber
        },
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.8)',
        'glass-dark': 'rgba(245, 243, 255, 0.5)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #9370db 0%, #7d45c6 100%)',
        'gradient-primary-light': 'linear-gradient(135deg, #c9b5ff 0%, #a88fff 100%)',
        'gradient-accent': 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
        'gradient-soft': 'linear-gradient(135deg, #f9fafb 0%, #faf8ff 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #f5f3ff 0%, #faf8ff 100%)',
      },
      backdropBlur: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'large': '0 10px 24px rgba(0, 0, 0, 0.12)',
        'card': '0 4px 16px rgba(157, 115, 219, 0.1)',
        'elevation': '0 2px 8px rgba(147, 112, 219, 0.12)',
      },
      borderRadius: {
        'pill': '9999px',
        'lg-custom': '16px',
      },
      fontSize: {
        'heading-xl': ['32px', { lineHeight: '40px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'heading-lg': ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.01em' }],
        'heading-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-sm': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '21px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '20px', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.02em' }],
      },
      spacing: {
        'sidebar-width': '280px',
        'sidebar-width-collapsed': '80px',
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
        '85': '0.85',
      },
    },
  },
  plugins: [],
}
