import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { Videocam } from '@mui/icons-material';

const CameraView = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Videocam sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Camera Integration Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            The real-time camera feed feature is currently under development. This page will display live camera feeds from parking areas once the integration is complete.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CameraView; 