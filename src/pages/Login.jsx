import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import BackgroundLogo from '../images/bg-img.png';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle backend error messages
  useEffect(() => {
    if (error) {
      if (error.toLowerCase().includes('user not found') || error.toLowerCase().includes('no user')) {
        setFormErrors(prev => ({
          ...prev,
          email: 'User not found. Please check your email or register.',
          password: ''
        }));
      } else if (error.toLowerCase().includes('invalid credentials') || error.toLowerCase().includes('incorrect')) {
        setFormErrors(prev => ({
          ...prev,
          password: 'Incorrect password. Please try again.',
          email: ''
        }));
      }
    }
  }, [error]);

  const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Clear the general error when user starts typing
    if (error) {
      dispatch(clearError());
    }

    // Validate email format while typing
    if (name === 'email') {
      const emailError = validateEmail(value);
      setFormErrors(prev => ({
        ...prev,
        email: emailError
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setFormErrors(prev => ({
        ...prev,
        email: emailError
      }));
      return;
    }

    dispatch(login(formData));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5'
      }}
    >
      {/* Left side - Background Image */}
      <Box
        sx={{
          flex: 1,
          height: '50vh',
          backgroundImage: `url(${BackgroundLogo})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Right side - Login Form */}
      <Container 
        component="main" 
        maxWidth="xs"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              backgroundColor: 'white',
            }}
          >
            <Typography component="h1" variant="h5">
              Sign in to ParkEase
            </Typography>
            {(formErrors.email || formErrors.password) && (
              <Alert
                severity="error"
                sx={{ width: '100%', mt: 2 }}
                onClose={() => setFormErrors({ email: '', password: '' })}
              >
                {formErrors.email || formErrors.password}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !!formErrors.email}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
                <Box mt={1}>
                  <Link component={RouterLink} to="/forgot-password" variant="body2">
                    Forgot Password?
                  </Link>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login; 