import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFC600',
    },
    secondary: {
      main: '#222222',
    },
    background: {
      default: '#111111',
      paper: '#222222',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#333',
            '& fieldset': {
              borderColor: '#444',
            },
            '&:hover fieldset': {
              borderColor: '#555',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFC600',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#888',
          },
          '& input': {
            color: '#fff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFC600',
          color: '#000',
          '&:hover': {
            backgroundColor: '#FFD700',
          },
        },
      },
    },
  },
});

export default theme;