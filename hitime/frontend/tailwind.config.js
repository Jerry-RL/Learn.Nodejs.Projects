module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
    './stories/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF', // macOS 蓝
        secondary: '#FF9500',
        success: '#34C759',
        warning: '#FFCC00',
        danger: '#FF3B30',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '2rem',
        '3xl': '2.5rem'
      },
      boxShadow: {
        neumorph: '8px 8px 24px #d1d9e6, -8px -8px 24px #ffffff'
      }
    }
  },
  plugins: []
}; 