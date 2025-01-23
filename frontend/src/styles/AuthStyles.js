import { styled } from '@mui/material/styles';

const colors = {
  primary: '#FFC600',
  secondary: '#222222',
  text: '#FFFFFF',
  textDark: '#000000',
  error: '#FF3B3B',
  containerBg: 'rgba(255, 255, 255, 0.95)',
  hover: '#FFE333'
};

export const PageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#222222',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  margin: 0,
  boxSizing: 'border-box',
  overflowX: 'hidden',
});

export const FormContainer = styled('form')({
  width: '100%',
  maxWidth: '400px',
  padding: '2rem',
  backgroundColor: colors.containerBg,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  margin: '0 auto',
  boxSizing: 'border-box',
  '@media (max-width: 480px)': {
    padding: '1.5rem',
    maxWidth: '90%',
  }
});

export const Title = styled('h1')({
  fontFamily: 'Inter, sans-serif',
  fontSize: '2.5rem',
  fontWeight: 700,
  color: colors.primary,
  marginBottom: '2rem',
  textAlign: 'center',
  '@media (max-width: 480px)': {
    fontSize: '2rem',
  }
});

export const Input = styled('input')(({ hasError }) => ({
  width: '100%',
  padding: '12px',
  border: hasError ? `1px solid ${colors.error}` : '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '16px',
  backgroundColor: 'white',
  '&:focus': {
    outline: 'none',
    borderColor: hasError ? colors.error : colors.primary,
    boxShadow: `0 0 0 2px ${hasError ? 'rgba(255, 59, 59, 0.2)' : 'rgba(255, 198, 0, 0.2)'}`,
  }
}));

export const StyledButton = styled('button')({
  width: '100%',
  padding: '12px',
  backgroundColor: colors.primary,
  color: colors.textDark,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: colors.hover,
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  }
});

export const ErrorMessage = styled('span')({
  color: colors.error,
  fontSize: '12px',
  marginTop: '4px',
  fontWeight: 500,
});

export const LinkText = styled('div')({
  marginTop: '1rem',
  textAlign: 'center',
  color: colors.textDark,
  fontSize: '0.875rem',
  '& button': {
    background: 'none',
    border: 'none',
    color: colors.primary,
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    transition: 'color 0.2s ease',
    '&:hover': {
      color: colors.hover,
    }
  }
});

export const Select = styled('select')({
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '16px',
  backgroundColor: 'white',
  color: '#000000',
  cursor: 'pointer',
  appearance: 'auto',
  '&:focus': {
    outline: 'none',
    borderColor: colors.primary,
    boxShadow: '0 0 0 2px rgba(255, 198, 0, 0.2)',
  },
  '& option': {
    backgroundColor: 'white',
    color: '#000000',
  }
}); 