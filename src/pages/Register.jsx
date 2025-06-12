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
import { register, clearError } from '../store/slices/authSlice';
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

  useEffect(() => {
    if (isAuthenticated) {
      setSuccessOpen(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      if (
        (e.target.name === 'password' && e.target.value !== formData.confirmPassword) ||
        (e.target.name === 'confirmPassword' && e.target.value !== formData.password)
      ) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
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
            {error && (
              <Alert
                severity="error"
                sx={{ width: '100%', mt: 2 }}
                onClose={() => dispatch(clearError())}
              >
                {error}
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