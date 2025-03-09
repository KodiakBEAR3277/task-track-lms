import { styled as muiStyled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';

const colors = {
  primary: '#FFC600',
  secondary: '#222222',
  text: '#FFFFFF',
  textDark: '#000000',
  error: '#FF3B3B',
  containerBg: 'rgba(255, 255, 255, 0.95)',
  hover: '#FFE333'
};

export const PageContainer = muiStyled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#111111'
});

export const FormContainer = muiStyled('form')({
  backgroundColor: '#222222',  // Changed from white to dark
  padding: '2rem',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid #333'  // Added border for better visibility
});

export const Title = muiStyled('h1')({
  color: colors.primary,
  fontSize: '2.5rem',
  marginBottom: '2rem',
  textAlign: 'center'
});

export const Input = muiStyled(TextField)({
  width: '100%',
  marginBottom: '1rem',
  '& .MuiOutlinedInput-root': {
    color: colors.text,
    backgroundColor: '#333',
    '& fieldset': {
      borderColor: '#333'
    },
    '&:hover fieldset': {
      borderColor: '#444'
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary
    }
  },
  '& .MuiInputLabel-root': {
    color: '#888'
  }
});

export const Select = muiStyled('select')({
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  border: '1px solid #333',
  borderRadius: '4px',
  backgroundColor: '#333',
  color: colors.text,
  '&:focus': {
    outline: 'none',
    borderColor: colors.primary
  },
  '& option': {
    backgroundColor: '#222222',
    color: colors.text
  }
});

export const StyledButton = muiStyled(Button)({
  width: '100%',
  padding: '0.75rem',
  backgroundColor: colors.primary,
  color: colors.textDark,
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: colors.hover
  }
});

export const ErrorMessage = muiStyled('span')({
  color: colors.error,
  fontSize: '0.875rem',
  marginTop: '-0.5rem',
  marginBottom: '0.5rem',
  display: 'block'
});

export const LinkText = muiStyled('p')({
  textAlign: 'center',
  marginTop: '1rem',
  color: '#888',
  '& button': {
    color: colors.primary,
    background: 'none',
    border: 'none',
    padding: 0,
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      color: colors.hover
    }
  }
});