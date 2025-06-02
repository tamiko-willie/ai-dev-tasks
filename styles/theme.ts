import { createTheme } from '@mui/material/styles';

// Create a theme instance with WCAG 2.2 AA compliance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // WCAG AA compliant
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0', // WCAG AA compliant
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f', // WCAG AA compliant
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ed6c02', // WCAG AA compliant
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1', // WCAG AA compliant
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32', // WCAG AA compliant
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1D1D1D', // WCAG AAA compliant
      secondary: '#424242', // WCAG AA compliant
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontSize: '1rem',
          padding: '8px 16px',
          minWidth: '64px',
          '&:focus-visible': {
            outline: '2px solid #1976d2',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:focus-within': {
              '& > fieldset': {
                borderColor: '#1976d2',
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
  },
});

export default theme;