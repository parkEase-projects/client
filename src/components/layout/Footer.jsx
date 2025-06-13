import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              ParkEase
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Smart Parking Solutions for a Better Future
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Link
              component={RouterLink}
              to="/about-us"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              About Us
            </Link>
            <Link
              component={RouterLink}
              to="/contact-us"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Contact Us
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link
              component={RouterLink}
              to="/privacy-policy"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms-of-service"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Terms of Service
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              123, ParkEase Lane
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Bengaluru, India
            </Typography>
            <Typography variant="body2" color="text.secondary">
              support@parkease.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} ParkEase. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 