import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  useTheme,
} from '@mui/material';
import {
  DirectionsCar,
  AccessTime,
  Payment,
  Videocam,
  Security,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getBookings, getAreaById } from '../data/mockData';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [bookings, setBookings] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const allBookings = getBookings();
    setBookings(allBookings);
  }, []);

  const getActiveBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
      return now >= startTime && now <= endTime;
    });
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const startTime = new Date(booking.startTime);
      return now < startTime;
    });
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const endTime = new Date(booking.endTime);
      return now > endTime;
    });
  };

  const getTotalSpent = () => {
    return bookings.reduce((total, booking) => total + (booking.amount || 0), 0);
  };

  const getRecentBookings = () => {
    return [...bookings]
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 3);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* Role-specific action buttons */}
      {(user?.role === 'admin' || user?.role === 'security') && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 6,
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center">
            {/* Camera Views - Available for admin and security */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<Videocam />}
              onClick={() => navigate('/camera-view')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                }
              }}
            >
              Camera Views
            </Button>
            
            {/* Admin specific buttons */}
            {user?.role === 'admin' && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Security />}
                  onClick={() => navigate('/security-management')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  Manage Security Staff
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<Assessment />}
                  onClick={() => navigate('/reports')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  View Reports
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      )}

      <Grid container spacing={4}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 4, 
              mb: 2,
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Welcome to ParkEase!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Here's an overview of your parking activities
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsCar sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Past Bookings</Typography>
              </Box>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700, mb: 2 }}>
                {getPastBookings().length}
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                size="small"
                onClick={() => navigate('/view-bookings', { state: { bookingType: 'past' } })}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime sx={{ mr: 2, color: 'success.main', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Upcoming Bookings</Typography>
              </Box>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 700, mb: 2 }}>
                {getUpcomingBookings().length}
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                size="small"
                onClick={() => navigate('/view-bookings', { state: { bookingType: 'upcoming' } })}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment sx={{ mr: 2, color: 'secondary.main', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Spent</Typography>
              </Box>
              <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 700, mb: 2 }}>
                Rs. {getTotalSpent()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Active Bookings */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 4,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              Active Bookings
            </Typography>
            <List sx={{ p: 0 }}>
              {getActiveBookings().map((booking) => (
                <React.Fragment key={booking.id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {getAreaById(booking.areaId)?.name} - Slot {booking.slotId}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(booking.startTime), 'MMM dd, yyyy hh:mm a')} - {format(new Date(booking.endTime), 'hh:mm a')}
                        </Typography>
                      }
                    />
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                      Active Now
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {getActiveBookings().length === 0 && (
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemText primary="No active bookings" />
                </ListItem>
              )}
            </List>
          </Paper>

          {/* Quick Actions */}
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<DirectionsCar />}
                onClick={() => navigate('/booking')}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  }
                }}
              >
                Book Parking
              </Button>
              <Button
                variant="outlined"
                startIcon={<AccessTime />}
                onClick={() => navigate('/view-bookings')}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                View Bookings
              </Button>
              <Button
                variant="outlined"
                startIcon={<AccessTime />}
                onClick={() => navigate('/reports')}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                View Reports
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              Recent Bookings
            </Typography>
            <List sx={{ p: 0 }}>
              {getRecentBookings().map((booking) => (
                <React.Fragment key={booking.id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {getAreaById(booking.areaId)?.name} - Slot {booking.slotId}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(booking.startTime), 'MMM dd, yyyy hh:mm a')}
                        </Typography>
                      }
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Rs. {booking.amount}
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {getRecentBookings().length === 0 && (
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemText primary="No recent bookings" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 