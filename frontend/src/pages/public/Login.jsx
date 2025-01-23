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
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validation logic here
    // API call will be added later
  }

  return (
    <PageContainer>
      <Title>Task Track</Title>
      <FormContainer onSubmit={handleSubmit}>
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