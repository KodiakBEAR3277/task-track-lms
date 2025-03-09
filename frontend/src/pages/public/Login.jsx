import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageContainer,
  FormContainer,
  Title,
  Input,
  StyledButton,
  ErrorMessage,
  LinkText
} from '../../styles/AuthStyles'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formData, setFormData] = useState({ username: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!formData.username) newErrors.username = 'Username is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username: formData.username }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on user role
        switch (data.user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setErrors({ general: data.error });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    }
  }

  return (
    <PageContainer>
      <Title>Task Track</Title>
      <FormContainer onSubmit={handleSubmit}>
        <div>
          <Input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="Username"
            error={!!errors.username}
            helperText={errors.username}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </div>
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            hasError={errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </div>
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            hasError={errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </div>
        {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
        <StyledButton type="submit">Login</StyledButton>
        <LinkText>
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/signup')}>
            Sign up
          </button>
        </LinkText>
      </FormContainer>
    </PageContainer>
  )
}

export default Login