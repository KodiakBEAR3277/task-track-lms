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
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic here
    // API call will be added later
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
            hasError={errors.username}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
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