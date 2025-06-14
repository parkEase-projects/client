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
  Map,
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

  // Determine how many quick action buttons to show
  const quickActions = [
    {
      label: 'Book Parking',
      icon: <DirectionsCar />,
      color: 'primary',
      onClick: () => navigate('/booking'),
      show: true,
    },
    {
      label: 'View Bookings',
      icon: <AccessTime />,
      color: 'secondary',
      onClick: () => navigate('/view-bookings'),
      show: true,
    },
    {
      label: 'Camera Views',
      icon: <Videocam />,
      color: 'info',
      onClick: () => navigate('/camera-view'),
      show: user?.role === 'admin' || user?.role === 'security',
    },
    {
      label: 'Manage Security Staff',
      icon: <Security />,
      color: 'success',
      onClick: () => navigate('/security-management'),
      show: user?.role === 'admin',
    },
  ];
  const visibleActions = quickActions.filter(action => action.show);
  let gridMd = 3;
  if (visibleActions.length === 2) gridMd = 6;
  else if (visibleActions.length === 3) gridMd = 4;

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
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

        {/* Quick Stats - Grouped in a single responsive row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                  transition: 'transform 0.2s',
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
                    variant="outlined"
                    onClick={() => navigate('/view-bookings', { state: { bookingType: 'past' } })}
                    sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2 }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                  transition: 'transform 0.2s',
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
                    variant="outlined"
                    onClick={() => navigate('/view-bookings', { state: { bookingType: 'upcoming' } })}
                    sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2 }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                  transition: 'transform 0.2s',
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
          </Grid>
        </Grid>

        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Active Bookings */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)'
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

        </Grid>

        {/* Right Column: Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)'
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

        {/* Bottom Row: Quick Actions (full width, colored buttons) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {visibleActions.map((action, idx) => (
                <Grid item xs={12} sm={6} md={gridMd} key={action.label}>
                  <Button
                    fullWidth
                    variant="contained"
                    color={action.color}
                    startIcon={action.icon}
                    onClick={action.onClick}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 500,
                      boxShadow:
                        action.color === 'primary'
                          ? '0 2px 8px rgba(25, 118, 210, 0.08)'
                          : action.color === 'secondary'
                          ? '0 2px 8px rgba(220, 0, 78, 0.08)'
                          : action.color === 'info'
                          ? '0 2px 8px rgba(1, 192, 255, 0.08)'
                          : action.color === 'success'
                          ? '0 2px 8px rgba(46, 125, 50, 0.08)'
                          : undefined,
                      transition: 'box-shadow 0.2s, background 0.2s',
                      '&:hover': {
                        boxShadow:
                          action.color === 'primary'
                            ? '0 6px 16px rgba(25, 118, 210, 0.13)'
                            : action.color === 'secondary'
                            ? '0 6px 16px rgba(220, 0, 78, 0.13)'
                            : action.color === 'info'
                            ? '0 6px 16px rgba(1, 192, 255, 0.13)'
                            : action.color === 'success'
                            ? '0 6px 16px rgba(46, 125, 50, 0.13)'
                            : undefined,
                        backgroundColor: theme => theme.palette[action.color].dark,
                      },
                    }}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 