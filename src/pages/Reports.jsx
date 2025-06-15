import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import BookingHistory from '../components/BookingHistory';

const Reports = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {user?.role === 'admin' ? 'System Reports' : 'My Booking History'}
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <BookingHistory userRole={user?.role} userId={user?.id} />
      </Box>
    </Container>
  );
};

export default Reports; 