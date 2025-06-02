module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {
      // Add vendor prefixes for better browser compatibility
      flexbox: 'no-2009',
      grid: 'autoplace',
    },
    'postcss-focus-visible': {
      // Polyfill for :focus-visible
      replaceWith: '[data-focus-visible-added]',
    },
    'postcss-custom-properties': {
      // Ensure CSS custom properties work in older browsers
      preserve: false,
      importFrom: [
        {
          customProperties: {
            '--focus-ring-color': '#2196F3',
            '--focus-ring-width': '3px',
            '--focus-ring-offset': '2px',
          },
        },
      ],
    },
  },
}; 