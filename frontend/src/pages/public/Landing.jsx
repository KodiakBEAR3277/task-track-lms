import { useNavigate } from 'react-router-dom';
import hero from '../../assets/images/hero.jpg';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const PageContainer = styled('div')({
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#111111',
  color: 'white',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
});
  
const Header = styled('header')({
  width: '100%',
  backgroundColor: '#222222',
  padding: '1rem 5%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 20,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  boxSizing: 'border-box',
});

const Logo = styled('span')({
  color: '#FFC600',
  fontWeight: 'bold',
  fontSize: '1.5rem',
});

const HeroSection = styled('section')({
  position: 'relative',
  minHeight: '80vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${hero})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '0 5%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});

const HeroContent = styled('div')({
  position: 'relative',
  zIndex: 10,
  textAlign: 'center',
  maxWidth: '800px',
  width: '90%',
  margin: '0 auto',
});

const Title = styled('h1')({
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  color: '#FFC600',
});

const Subtitle = styled('p')({
  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
  color: '#e0e0e0',
  marginBottom: '2rem',
  lineHeight: 1.5,
});

const StyledButton = styled(Button)({
  backgroundColor: '#FFC600',
  color: '#000000',
  padding: '0.75rem 2rem',
  fontSize: '1.125rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#FFE333',
  }
});

const FeaturesSection = styled('section')({
  width: '100%',
  padding: '5rem 5%',
  backgroundColor: '#222222',
});

const FeaturesGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
});

const FeatureCard = styled('div')({
  backgroundColor: '#333333',
  padding: '2rem',
  borderRadius: '8px',
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

function Landing() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Header>
        <Logo>Task Track</Logo>
        <div>
          <StyledButton
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ marginRight: '1rem' }}
          >
            Login
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </StyledButton>
        </div>
      </Header>

      <HeroSection>
        <HeroContent>
          <Title>Welcome to Task Track</Title>
          <Subtitle>
            A modern learning management system designed to enhance your educational experience
          </Subtitle>
          <StyledButton
            variant="contained"
            onClick={() => navigate('/signup')}
            size="large"
          >
            Get Started
          </StyledButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <h3 style={{ color: '#FFC600', fontSize: '1.5rem', marginBottom: '1rem' }}>
              For Students
            </h3>
            <p>Access your classes, track assignments, and collaborate with peers</p>
          </FeatureCard>
          <FeatureCard>
            <h3 style={{ color: '#FFC600', fontSize: '1.5rem', marginBottom: '1rem' }}>
              For Teachers
            </h3>
            <p>Manage your classes, create assignments, and monitor student progress</p>
          </FeatureCard>
          <FeatureCard>
            <h3 style={{ color: '#FFC600', fontSize: '1.5rem', marginBottom: '1rem' }}>
              For Admins
            </h3>
            <p>Oversee the entire system, manage users, and maintain platform integrity</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </PageContainer>
  );
}

export default Landing;