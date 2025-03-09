import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  FormContainer,
  Title,
  Input,
  StyledButton,
  ErrorMessage,
  LinkText
} from '../../styles/AuthStyles';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student' // Default role, no need for selection
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setErrors({ general: data.error });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    }
  };

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
        </div>
        <div>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Email"
            hasError={errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </div>
        <div>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Password"
            hasError={errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </div>
        <StyledButton type="submit">Sign Up</StyledButton>
        <LinkText>
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')}>
            Login
          </button>
        </LinkText>
      </FormContainer>
    </PageContainer>
  );
}

export default Signup;