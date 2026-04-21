import { createTheme } from '@mui/material/styles';

// ── Design Tokens ────────────────────────────────────────────────────────────
const MAROON       = '#8B1D1D';
const MAROON_DARK  = '#6B1616';
const MAROON_LIGHT = '#A13D3D';
const MAROON_MUTED = '#F5ECEC';
const GREEN        = '#2E5225';
const GREEN_LIGHT  = '#EBF5E9';
const IVORY        = '#FCFBF7';
const IVORY_DARK   = '#F5F2E8';
const BORDER       = '#E5E1D1';
const BORDER_DARK  = '#D1CBB1';
const INK          = '#1A0D0D';
const INK_MUTED    = '#4B3F3F';
const INK_FAINT    = '#8A7D7D';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:         MAROON,
      dark:         MAROON_DARK,
      light:        MAROON_LIGHT,
      contrastText: '#ffffff',
    },
    secondary: {
      main:         GREEN,
      dark:         '#1E3618',
      light:        '#4A7A3C',
      contrastText: '#ffffff',
    },
    background: {
      default: IVORY,
      paper:   '#ffffff',
    },
    text: {
      primary:   INK,
      secondary: INK_MUTED,
      disabled:  INK_FAINT,
    },
    divider: BORDER,
    error:   { main: '#DC2626' },
    warning: { main: '#D97706' },
    success: { main: GREEN },
    info:    { main: '#2563EB' },
  },

  // ── Typography ──────────────────────────────────────────────────────────────
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    // Tighten the weight/size scale for consistency
    h1: { fontWeight: 800, fontSize: '2.5rem',  letterSpacing: '-1.5px', color: INK },
    h2: { fontWeight: 800, fontSize: '2rem',    letterSpacing: '-1px',   color: INK },
    h3: { fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-1px',   color: INK },
    h4: { fontWeight: 700, fontSize: '1.5rem',  letterSpacing: '-0.5px', color: INK },
    h5: { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.25px',color: INK },
    h6: { fontWeight: 600, fontSize: '1rem',    letterSpacing: '0px',    color: INK },
    subtitle1: { fontWeight: 600, fontSize: '0.9375rem', color: INK_MUTED },
    subtitle2: { fontWeight: 700, fontSize: '0.75rem',   letterSpacing: '0.6px', textTransform: 'uppercase', color: INK_FAINT },
    body1: { fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.65, color: INK },
    body2: { fontWeight: 400, fontSize: '0.875rem',  lineHeight: 1.6,  color: INK_MUTED },
    caption: { fontWeight: 500, fontSize: '0.75rem', letterSpacing: '0.4px', color: INK_FAINT },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.2px' },
    overline: { textTransform: 'uppercase', fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '1.2px', color: INK_FAINT },
  },

  shape: { borderRadius: 10 },

  // ── Shadows ─────────────────────────────────────────────────────────────────
  shadows: [
    'none',
    '0 1px 2px 0 rgba(26,13,13,0.06)',
    '0 1px 4px 0 rgba(26,13,13,0.08), 0 1px 2px -1px rgba(26,13,13,0.06)',
    '0 4px 6px -1px rgba(26,13,13,0.08), 0 2px 4px -2px rgba(26,13,13,0.05)',
    '0 8px 15px -3px rgba(26,13,13,0.08), 0 4px 6px -4px rgba(26,13,13,0.05)',
    '0 12px 24px -4px rgba(26,13,13,0.10), 0 6px 8px -4px rgba(26,13,13,0.05)',
    ...Array(19).fill('0 16px 32px -6px rgba(26,13,13,0.12)'),
  ],

  // ── Component Overrides ─────────────────────────────────────────────────────
  components: {

    // ─── AppBar ───────────────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: INK,
          borderBottom: `1px solid ${BORDER}`,
          boxShadow: 'none',
          backdropFilter: 'blur(8px)',
        },
      },
    },

    // ─── Button ───────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '9px 22px',
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '0.15px',
          transition: 'all 0.18s ease',
          boxShadow: 'none',
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        contained: {
          backgroundColor: MAROON,
          color: '#fff',
          '&:hover': {
            backgroundColor: MAROON_DARK,
            boxShadow: `0 4px 14px 0 rgba(139,29,29,0.30)`,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          borderColor: BORDER_DARK,
          color: INK,
          '&:hover': {
            borderColor: MAROON,
            color: MAROON,
            backgroundColor: MAROON_MUTED,
            borderWidth: '1.5px',
          },
        },
        text: {
          color: INK_MUTED,
          '&:hover': { color: MAROON, backgroundColor: MAROON_MUTED },
        },
        sizeLarge:  { padding: '11px 28px', fontSize: '0.9375rem' },
        sizeSmall:  { padding: '6px 14px',  fontSize: '0.8125rem' },
      },
    },

    // ─── IconButton ───────────────────────────────────────────────────────────
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: INK_MUTED,
          borderRadius: '8px',
          transition: 'all 0.18s ease',
          '&:hover': { color: MAROON, backgroundColor: MAROON_MUTED },
        },
      },
    },

    // ─── Paper ────────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          border: `1px solid ${BORDER}`,
        },
        elevation0: { boxShadow: 'none',   border: `1px solid ${BORDER}` },
        elevation1: { boxShadow: `0 1px 4px 0 rgba(26,13,13,0.08)`, border: `1px solid ${BORDER}` },
        elevation2: { boxShadow: `0 4px 6px -1px rgba(26,13,13,0.08)`, border: `1px solid ${BORDER}` },
        elevation4: { boxShadow: `0 8px 15px -3px rgba(26,13,13,0.10)`, border: `1px solid ${BORDER}` },
      },
    },

    // ─── Card ─────────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: `1px solid ${BORDER}`,
          boxShadow: '0 1px 2px 0 rgba(26,13,13,0.05)',
          backgroundImage: 'none',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            boxShadow: `0 8px 24px -4px rgba(139,29,29,0.12)`,
            borderColor: MAROON_LIGHT,
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: '24px', '&:last-child': { paddingBottom: '24px' } },
      },
    },

    // ─── TextField ────────────────────────────────────────────────────────────
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'medium' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            fontSize: '0.9375rem',
            backgroundColor: '#ffffff',
            '& fieldset':              { borderColor: BORDER,       borderWidth: '1.5px' },
            '&:hover fieldset':        { borderColor: BORDER_DARK },
            '&.Mui-focused fieldset':  { borderColor: MAROON,      borderWidth: '2px' },
            '&.Mui-error fieldset':    { borderColor: '#DC2626' },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.8rem',
            marginTop: '4px',
          },
        },
      },
    },

    // ─── Select ───────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER, borderWidth: '1.5px' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_DARK },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: MAROON, borderWidth: '2px' },
        },
      },
    },

    // ─── Chip ─────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          fontSize: '0.8rem',
          borderRadius: '8px',
          letterSpacing: '0.1px',
        },
        colorDefault: {
          backgroundColor: IVORY_DARK,
          color: INK_MUTED,
          border: `1px solid ${BORDER}`,
        },
        colorPrimary: {
          backgroundColor: MAROON_MUTED,
          color: MAROON,
          border: `1px solid rgba(139,29,29,0.2)`,
        },
        colorSuccess: {
          backgroundColor: GREEN_LIGHT,
          color: GREEN,
          border: `1px solid rgba(46,82,37,0.25)`,
        },
        colorError: {
          backgroundColor: '#FEF2F2',
          color: '#DC2626',
          border: '1px solid rgba(220,38,38,0.2)',
        },
      },
    },

    // ─── Stepper ──────────────────────────────────────────────────────────────
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 500,
          fontSize: '0.875rem',
          color: INK_MUTED,
          '&.Mui-active':    { fontWeight: 700, color: MAROON },
          '&.Mui-completed': { fontWeight: 600, color: GREEN  },
        },
        iconContainer: {
          '& .MuiStepIcon-root': {
            color: BORDER_DARK,
            '&.Mui-active':    { color: MAROON },
            '&.Mui-completed': { color: GREEN  },
          },
          '& .MuiStepIcon-text': {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: { borderColor: BORDER_DARK, borderTopWidth: '1.5px' },
      },
    },

    // ─── Tabs ─────────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '40px',
          borderBottom: `1px solid ${BORDER}`,
        },
        indicator: {
          backgroundColor: MAROON,
          height: '2.5px',
          borderRadius: '2px 2px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'none',
          letterSpacing: '0.1px',
          color: INK_MUTED,
          minHeight: '40px',
          padding: '8px 20px',
          '&.Mui-selected': { color: MAROON, fontWeight: 700 },
          '&:hover':        { color: MAROON, backgroundColor: MAROON_MUTED },
          borderRadius: '8px 8px 0 0',
          transition: 'all 0.15s ease',
        },
      },
    },

    // ─── Table ────────────────────────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: IVORY_DARK },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontSize: '0.875rem',
          color: INK,
          borderBottom: `1px solid ${BORDER}`,
          padding: '12px 16px',
        },
        head: {
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          color: INK_FAINT,
          backgroundColor: IVORY_DARK,
        },
      },
    },

    // ─── Alert ────────────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 500,
          fontSize: '0.875rem',
          border: '1px solid transparent',
        },
        standardSuccess: { backgroundColor: GREEN_LIGHT, color: GREEN,    border: `1px solid rgba(46,82,37,0.25)` },
        standardError:   { backgroundColor: '#FEF2F2',   color: '#DC2626', border: '1px solid rgba(220,38,38,0.2)' },
        standardWarning: { backgroundColor: '#FFFBEB',   color: '#92400E', border: '1px solid rgba(217,119,6,0.2)' },
        standardInfo:    { backgroundColor: '#EFF6FF',   color: '#1D4ED8', border: '1px solid rgba(37,99,235,0.2)' },
      },
    },

    // ─── Divider ──────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: BORDER },
      },
    },

    // ─── List ─────────────────────────────────────────────────────────────────
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&:hover': { backgroundColor: IVORY_DARK },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary:   { fontWeight: 500, fontSize: '0.9rem', color: INK },
        secondary: { fontSize: '0.8rem', color: INK_FAINT },
      },
    },

    // ─── Tooltip ──────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: '"Outfit", sans-serif',
          fontSize: '0.8rem',
          backgroundColor: INK,
          borderRadius: '6px',
          padding: '6px 10px',
        },
      },
    },

    // ─── CircularProgress ─────────────────────────────────────────────────────
    MuiCircularProgress: {
      defaultProps: { color: 'primary' },
    },

    // ─── Dialog ───────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          border: `1px solid ${BORDER}`,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 700,
          fontSize: '1.125rem',
          color: INK,
          padding: '20px 24px 16px',
        },
      },
    },

    // ─── Accordion ────────────────────────────────────────────────────────────
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: `1px solid ${BORDER}`,
          borderRadius: '12px !important',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: '8px 0' },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: INK,
          borderRadius: '12px',
          minHeight: '52px',
          '&.Mui-expanded': { minHeight: '52px' },
        },
      },
    },
  },
});

export default theme;
