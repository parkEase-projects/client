import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Storage as StorageIcon,
  Lock as LockIcon,
  DataUsage as DataUsageIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

const PrivacyPolicy = () => {
  const theme = useTheme();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const privacyPoints = [
    {
      icon: <DataUsageIcon color="primary" />,
      title: 'Data Collection',
      description: 'We collect only the data necessary to provide and improve our parking services.',
    },
    {
      icon: <StorageIcon color="primary" />,
      title: 'Data Storage',
      description: 'Your data is stored securely and never shared with third parties without consent.',
    },
    {
      icon: <LockIcon color="primary" />,
      title: 'Security Measures',
      description: 'We use encryption and secure protocols to safeguard all sensitive information.',
    },
    {
      icon: <SecurityIcon color="primary" />,
      title: 'Data Control',
      description: 'You can access, modify, or delete your data by contacting our support team.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
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
          <ShieldIcon sx={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Privacy Policy
        </Typography>
        <Typography variant="h6" align="center">
          Effective Date: {currentDate}
        </Typography>
      </Paper>

      {/* Introduction */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Our Commitment to Privacy
        </Typography>
        <Typography variant="body1" paragraph>
          At ParkEase, we respect your privacy and are committed to protecting the personal information you share with us. This privacy policy outlines how we collect, use, and safeguard your data while providing you with our parking services.
        </Typography>
      </Paper>

      {/* Privacy Points */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <List>
          {privacyPoints.map((point, index) => (
            <ListItem key={index} sx={{ py: 2 }}>
              <ListItemIcon>
                {point.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" color="primary" gutterBottom>
                    {point.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" color="text.secondary">
                    {point.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Agreement Section */}
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Your Agreement
        </Typography>
        <Typography variant="body1" paragraph>
          By using our services, you agree to the collection and use of your information in accordance with this policy. We may update this policy from time to time, and we will notify you of any changes by posting the new policy on this page.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          If you have any questions about our Privacy Policy, please contact our support team.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy; 