const plugin = require('tailwindcss/plugin');  // <-- Add this line

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    fontFamily: {
      arabic: ['"Noto Sans Arabic"', 'sans-serif'],
    },
    extend: {
      screens: {
        'xsm': '320px',  // Extra small devices
        'sm': '640px',   // Small devices (default)
        'md': '768px',   // Medium devices (default)
        'lg': '1214px',  // Large devices (default)
        'xl': '1280px',  // Extra large devices (default)
        '2xl': '1536px', // 2X large devices (default)
        '3xl': '1600px', // Custom size for very large screens
        '4xl': '1920px', // Custom size for ultra-large screens
        '5xl': '2560px', // Custom size for 4K screens
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require("tailwindcss-rtl"),
    plugin(function ({ addBase ,theme }) {
      addBase({
        "html[dir='rtl'] body": {
          direction: "rtl",
          textAlign: "right",
          fontSize: '1.5rem', // Increase font size for Arabic
        },
        "html[dir='ltr'] body": {
          direction: "ltr",
          textAlign: "left",
        },
      });
    }),
  ],
};
