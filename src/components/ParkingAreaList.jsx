import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

const ParkingAreaList = ({ areas, loading, error }) => {
  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        Error loading parking areas: {error}
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {areas.map((area) => (
        <Grid item xs={12} sm={6} md={4} key={area.id}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.02)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalParkingIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="div">
                  {area.name}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {area.description}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Slots:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {area.total_slots}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Available:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {area.available_slots}
                  </Typography>
                </Box>

                <Chip 
                  label={area.status}
                  color={area.status === 'active' ? 'success' : 'warning'}
                  size="small"
                  sx={{ width: '100%' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ParkingAreaList; 