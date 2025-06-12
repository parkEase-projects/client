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
  MenuItem,
  Snackbar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError, logout } from '../store/slices/authSlice';
import BackgroundLogo from '../images/bg-img.png';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'parker',
  });
  const [passwordError, setPasswordError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    phoneNumber: ''
  });

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
  // Phone number validation regex
  const phoneRegex = /^\d{10}$/;

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phoneNumber':
        if (!phoneRegex.test(value)) {
          error = 'Phone number must be exactly 10 digits';
        }
        break;
      default:
        break;
    }
    return error;
  };

  useEffect(() => {
    if (isAuthenticated) {
      setSuccessOpen(true);
      setTimeout(() => {
        dispatch(logout()); // Logout after registration
        navigate('/login');
      }, 2000);
    }
  }, [isAuthenticated, navigate, dispatch]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      // Check for specific error messages from backend
      if (error.toLowerCase().includes('user already exists')) {
        setFormErrors(prev => ({
          ...prev,
          username: 'This username is already taken. Please choose another.'
        }));
      } else if (error.toLowerCase().includes('email')) {
        setFormErrors(prev => ({
          ...prev,
          email: error
        }));
      }
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear the specific field error when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Clear the general error when user starts typing
    if (error) {
      dispatch(clearError());
    }
    
    setFormData({ ...formData, [name]: value });

    // Password match validation only if both passwords have been entered
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        // Only check match if confirmPassword has a value
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
          } else {
            setPasswordError('');
          }
        }
      } else if (name === 'confirmPassword') {
        // Only check match if both passwords have values
        if (value && formData.password) {
          if (value !== formData.password) {
            setPasswordError('Passwords do not match');
          } else {
            setPasswordError('');
          }
        }
      }
    }

    // Field-specific validation
    const fieldError = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const emailError = validateField('email', formData.email);
    const phoneError = validateField('phoneNumber', formData.phoneNumber);

    // Check password match on submission
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setFormErrors({
      ...formErrors,
      email: emailError,
      phoneNumber: phoneError
    });

    if (emailError || phoneError || passwordError) {
      return;
    }

    dispatch(register(formData));
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
      {/* Right side - Background Image */}
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
      {/* Left side - Registration Form */}
      <Container 
        component="main"        
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
              width: '80%',
              backgroundColor: 'white',
            }}
          >
            <Typography component="h1" variant="h5">
              Register for ParkEase
            </Typography>
            {error && !formErrors.username && !formErrors.email && (
              <Alert
                severity="error"
                sx={{ width: '100%', mt: 2 }}
                onClose={() => dispatch(clearError())}
              >
                {error}
              </Alert>
            )}
            {(formErrors.username || formErrors.email) && (
              <Alert
                severity="error"
                sx={{ width: '100%', mt: 2 }}
              >
                {formErrors.username || formErrors.email}
              </Alert>
            )}
            {passwordError && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {passwordError}
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
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !!passwordError}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Box>
            </Box>
          </Paper>
          <Snackbar open={successOpen} autoHideDuration={2000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
              Registration successful!
            </Alert>
          </Snackbar>
        </Box>
      </Container>

      
    </Box>
  );
};

export default Register; 