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
import PasswordField from '../components/PasswordField';
import { validateForm, validateEmail, validatePhone, validatePassword, validatePasswordMatch, validateUsername } from '../utils/validation';

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
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Run validation
    const errors = {};
    errors.username = validateUsername(formData.username);
    errors.email = validateEmail(formData.email);
    errors.phoneNumber = validatePhone(formData.phoneNumber);
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validatePasswordMatch(formData.password, formData.confirmPassword);
    setFormErrors(errors);
    // If no errors, proceed
    if (!Object.values(errors).some(Boolean)) {
      dispatch(register(formData));
    }
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
                value={formData.username}
                onChange={handleChange}
                error={submitted && !!formErrors.username}
                helperText={submitted ? formErrors.username : ''}
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
                error={submitted && !!formErrors.email}
                helperText={submitted ? formErrors.email : ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={submitted && !!formErrors.phoneNumber}
                helperText={submitted ? formErrors.phoneNumber : ''}
              />
              <PasswordField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                error={submitted && !!formErrors.password}
                helperText={submitted ? formErrors.password : ''}
              />
              <PasswordField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={submitted && !!formErrors.confirmPassword}
                helperText={submitted ? formErrors.confirmPassword : ''}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        message="Registration successful! Redirecting to login..."
      />
    </Box>
  );
};

export default Register; 