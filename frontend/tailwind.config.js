/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // High contrast colors for better accessibility
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3', // Base color
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336', // Base color
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
      },
      spacing: {
        // Larger touch targets for better accessibility
        'touch-min': '44px',
        'touch-lg': '48px',
      },
      fontSize: {
        // Minimum font sizes for readability
        'min-readable': '16px',
        'min-heading': '20px',
      },
      borderRadius: {
        // Consistent border radius for interactive elements
        'interactive': '4px',
      },
      outline: {
        // High visibility focus outline
        'focus-visible': '3px solid #2196F3',
      },
    },
  },
  plugins: [
    // Custom utilities for accessibility
    function({ addUtilities }) {
      const newUtilities = {
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
        '.sr-only-focusable': {
          '&:not(:focus)': {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: '0',
          },
        },
        '.focus-outline': {
          '&:focus-visible': {
            outline: '3px solid #2196F3',
            outlineOffset: '2px',
          },
        },
        '.motion-safe': {
          '@media (prefers-reduced-motion: no-preference)': {
            '&': {
              transition: 'all 0.3s ease-in-out',
            },
          },
        },
        '.motion-reduce': {
          '@media (prefers-reduced-motion: reduce)': {
            '&': {
              transition: 'none',
              animation: 'none',
            },
          },
        },
        '.high-contrast': {
          '@media (forced-colors: active)': {
            '&': {
              forcedColorAdjust: 'auto',
            },
          },
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover', 'focus']);
    },
  ],
}; 