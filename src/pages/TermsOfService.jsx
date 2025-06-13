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
  Divider,
  useTheme,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  Update as UpdateIcon,
  AccountCircle as UserIcon,
} from '@mui/icons-material';

const TermsOfService = () => {
  const theme = useTheme();

  const terms = [
    {
      icon: <UserIcon color="primary" />,
      title: 'Account Responsibility',
      description: 'You are responsible for maintaining the confidentiality of your login credentials.',
    },
    {
      icon: <WarningIcon color="primary" />,
      title: 'Prohibited Activities',
      description: 'Misuse of the platform (including fraudulent bookings or tampering with data) may result in account suspension.',
    },
    {
      icon: <UpdateIcon color="primary" />,
      title: 'Service Changes',
      description: 'Parking availability and rates are subject to change.',
    },
    {
      icon: <SecurityIcon color="primary" />,
      title: 'Liability',
      description: 'ParkEase is not liable for any loss or damage caused by third-party service interruptions or misuse.',
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
          <GavelIcon sx={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Terms of Service
        </Typography>
        <Typography variant="h5" align="center">
          Welcome to ParkEase!
        </Typography>
      </Paper>

      {/* Introduction */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Agreement to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using ParkEase. If you do not agree to all the terms and conditions, you must not use our service.
        </Typography>
      </Paper>

      {/* Terms List */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <List>
          {terms.map((term, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  {term.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="primary" gutterBottom>
                      {term.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" color="text.secondary">
                      {term.description}
                    </Typography>
                  }
                />
              </ListItem>
              {index < terms.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Updates Section */}
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Updates to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          We may update these terms from time to time to reflect changes in our services or for legal and regulatory reasons. Continued use of the platform after any changes implies acceptance of the latest terms.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          It is your responsibility to review these terms periodically for any updates or changes.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsOfService; 