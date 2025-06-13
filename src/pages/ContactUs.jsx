import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Link,
  useTheme,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

const ContactUs = () => {
  const theme = useTheme();

  const contactInfo = [
    {
      icon: <EmailIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: 'Email',
      content: 'support@parkease.com',
      link: 'mailto:support@parkease.com',
    },
    {
      icon: <PhoneIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: 'Phone',
      content: '+91 98765 43210',
      link: 'tel:+919876543210',
    },
    {
      icon: <LocationIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: 'Location',
      content: '123, ParkEase Lane, Bengaluru, India',
      link: null,
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <SupportIcon sx={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Contact Us
        </Typography>
        <Typography variant="h5" align="center">
          Have questions or need support? We're here to help!
        </Typography>
      </Paper>

      {/* Contact Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {contactInfo.map((info, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              p: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out',
              },
            }}>
              <Box sx={{ p: 2 }}>
                {info.icon}
              </Box>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {info.title}
                </Typography>
                {info.link ? (
                  <Link href={info.link} color="primary" underline="hover">
                    {info.content}
                  </Link>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {info.content}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Information */}
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Get in Touch
        </Typography>
        <Typography variant="body1" paragraph>
          For technical issues, feature requests, or general feedback, feel free to drop us a message anytime! Our support team is available 24/7 to assist you with any queries or concerns you may have.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We typically respond within 24 hours during business days.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ContactUs; 