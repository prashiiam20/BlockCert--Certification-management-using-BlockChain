import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8B1D1D', // Institutional Maroon
      dark: '#6B1616',
      light: '#A13D3D',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2E5225', // Forest Green
      dark: '#1E3618',
      light: '#4A7A3C',
    },
    background: {
      default: '#FCFBF7', // Institutional Ivory/Cream
      paper: '#ffffff',
    },
    text: {
      primary: '#1A0D0D', // Deep Maroon-Black for readability
      secondary: '#4B3F3F', // Warm Medium Gray
    },
    divider: '#E5E1D1',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: { fontWeight: 800, color: '#1A0D0D' },
    h2: { fontWeight: 800, color: '#1A0D0D' },
    h3: { fontWeight: 800, color: '#1A0D0D' },
    h4: { fontWeight: 700, letterSpacing: '-0.5px', color: '#1A0D0D' },
    h5: { fontWeight: 700, color: '#1A0D0D' },
    h6: { fontWeight: 600, letterSpacing: '0.1px', color: '#1A0D0D' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.2px' },
    body1: { lineHeight: 1.6, color: '#1A0D0D' },
    body2: { lineHeight: 1.6, color: '#4B3F3F' },
  },
  shape: { borderRadius: 12 }, // More professional/standard radius
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 24px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(139, 29, 29, 0.15)',
          },
        },
        contained: {
          backgroundColor: '#8B1D1D',
          '&:hover': {
            backgroundColor: '#6B1616',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#8B1D1D',
          color: '#8B1D1D',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: '#FCFBF7',
            borderColor: '#6B1616',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid #E5E1D1',
          transition: 'all 0.25s ease',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgb(139, 29, 29, 0.1), 0 8px 10px -6px rgb(139, 29, 29, 0.05)',
            borderColor: '#A13D3D',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1A0D0D',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': { borderColor: '#E5E1D1' },
            '&:hover fieldset': { borderColor: '#A13D3D' },
            '&.Mui-focused fieldset': { borderColor: '#8B1D1D' },
          },
        },
      },
    },
  },
});

export default theme;
