import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  EmojiObjects as InnovationIcon,
} from '@mui/icons-material';

const AboutUs = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <BusinessIcon fontSize="large" color="primary" />,
      title: 'Professional Service',
      description: 'Dedicated to providing reliable and user-centric parking solutions.',
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Secure Platform',
      description: 'Advanced security measures to protect your data and transactions.',
    },
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: 'Real-time Monitoring',
      description: 'Live updates and instant notifications for seamless parking management.',
    },
    {
      icon: <InnovationIcon fontSize="large" color="primary" />,
      title: 'Innovation Driven',
      description: 'Continuously evolving with modern technology and smart solutions.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 6, 
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          About Us
        </Typography>
        <Typography variant="h5" align="center" sx={{ mb: 4 }}>
          Welcome to ParkEase – Smart Parking Solutions!
        </Typography>
      </Paper>

      {/* Mission Statement */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Our Mission
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary">
          Make parking smarter, safer, and stress-free.
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <Typography variant="body1" paragraph>
          At ParkEase, we believe in making parking hassle-free, secure, and efficient. Our goal is to help users find, book, and manage parking spaces with ease using modern technology. Whether you're a parking space owner, a security officer, or a user, our platform brings everyone together for a smarter experience.
        </Typography>
        <Typography variant="body1" paragraph>
          We are passionate about innovation and dedicated to providing a reliable and user-centric service. With real-time monitoring, data-driven analytics, and secure access, ParkEase transforms traditional parking into a streamlined digital experience.
        </Typography>
      </Paper>

      {/* Features Grid */}
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <Box sx={{ p: 2 }}>
                {feature.icon}
              </Box>
              <CardContent>
                <Typography variant="h6" component="h3" align="center" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AboutUs; 