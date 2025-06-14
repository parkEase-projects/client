import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

const CameraView = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  // Check if user has permission to view cameras
  if (!user || (user.role !== 'admin' && user.role !== 'security')) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          You don't have permission to access this page.
        </Alert>
      </Container>
    );
  }

  // Mock camera locations - in a real app, this would come from the backend
  const cameraLocations = [
    { id: 1, name: 'Main Entrance', status: 'offline' },
    { id: 2, name: 'Parking Level 1', status: 'offline' },
    { id: 3, name: 'Parking Level 2', status: 'offline' },
    { id: 4, name: 'Exit Gate', status: 'offline' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Camera Monitoring
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        Camera integration is currently in development. This is a placeholder view.
      </Alert>

      <Grid container spacing={3}>
        {cameraLocations.map((camera) => (
          <Grid item xs={12} md={6} key={camera.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box sx={{ 
                height: 300, 
                bgcolor: 'grey.200', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}>
                <VideocamOffIcon sx={{ fontSize: 60, color: 'grey.500', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {camera.name}
                </Typography>
                <Typography color="text.secondary">
                  Camera {camera.status}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CameraView; 