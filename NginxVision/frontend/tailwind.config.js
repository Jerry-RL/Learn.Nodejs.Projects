module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // 蓝色主色
          light: '#3b82f6',
          dark: '#1e40af',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
