import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#343a40',
      light: '#495057',
      dark: '#212529',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0052cc',
      light: '#4c9aff',
      dark: '#0747a6',
    },
    background: {
      default: '#1a1d21',
      paper: '#252931',
    },
    text: {
      primary: '#d4d5d9',
      secondary: '#9fadbc',
    },
    divider: '#383c44',
    success: {
      main: '#00875a',
      light: '#36b37e',
    },
    error: {
      main: '#de350b',
      light: '#ff5630',
    },
    warning: {
      main: '#ff991f',
      light: '#ffab00',
    },
    info: {
      main: '#0065ff',
      light: '#4c9aff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.8125rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          },
          '&:active': {
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiTouchRipple: {
      styleOverrides: {
        root: {
          color: 'rgba(76, 154, 255, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
          border: '1px solid #383c44',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: '#495057',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            transition: 'all 0.2s',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#495057',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            transition: 'background-color 0.2s',
          },
        },
      },
    },
    MuiListItemButton: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 4,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '&:active': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '& .MuiTouchRipple-root': {
            color: 'rgba(76, 154, 255, 0.3)',
          },
        },
      },
    },
  },
})

export default theme
