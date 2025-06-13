import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Tooltip,
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
        bgcolor: '#f5f5f5',
        color: 'text.primary',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid #ddd',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand Info and Social Icons */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              ParkEase
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Smart Parking Solutions for a Better Future
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Tooltip title="Facebook - Coming Soon">
                <IconButton sx={{ color: '#3b5998' }}>
                  <Facebook />
                </IconButton>
              </Tooltip>
              <Tooltip title="Twitter - Coming Soon">
                <IconButton sx={{ color: '#1DA1F2' }}>
                  <Twitter />
                </IconButton>
              </Tooltip>
              <Tooltip title="Instagram - Coming Soon">
                <IconButton
                  sx={{
                    color: '#E1306C',
                    '&:hover': {
                      color: '#C13584',
                    },
                  }}
                >
                  <Instagram />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                component={RouterLink}
                to="/about-us"
                color="text.secondary"
                sx={{ textDecoration: 'none', mb: 1, '&:hover': { color: 'primary.main' } }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact-us"
                color="text.secondary"
                sx={{ textDecoration: 'none', mb: 1, '&:hover': { color: 'primary.main' } }}
              >
                Contact Us
              </Link>
            </Box>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                component={RouterLink}
                to="/privacy-policy"
                color="text.secondary"
                sx={{ textDecoration: 'none', mb: 1, '&:hover': { color: 'primary.main' } }}
              >
                Privacy Policy
              </Link>
              <Link
                component={RouterLink}
                to="/terms-of-service"
                color="text.secondary"
                sx={{ textDecoration: 'none', mb: 1, '&:hover': { color: 'primary.main' } }}
              >
                Terms of Service
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                123, ParkEase Lane, Colombo
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                +1 234 567 890
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                support@parkease.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} ParkEase. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
