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
} from '@mui/material';
import {
  DirectionsCar,
  AccessTime,
  Payment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getBookings, getAreaById } from '../data/mockData';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to ParkEase!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's an overview of your parking activities
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Past Bookings</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {getPastBookings().length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/view-bookings', { state: { bookingType: 'past' } })}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Upcoming Bookings</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {getUpcomingBookings().length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/view-bookings', { state: { bookingType: 'upcoming' } })}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Total Spent</Typography>
              </Box>
              <Typography variant="h3" color="secondary.main">
                ₹{getTotalSpent()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Active Bookings */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Active Bookings
            </Typography>
            <List>
              {getActiveBookings().map((booking) => (
                <React.Fragment key={booking.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${getAreaById(booking.areaId)?.name} - Slot ${booking.slotId}`}
                      secondary={`${format(new Date(booking.startTime), 'MMM dd, yyyy hh:mm a')} - ${format(new Date(booking.endTime), 'hh:mm a')}`}
                    />
                    <Typography variant="body2" color="success.main">
                      Active Now
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {getActiveBookings().length === 0 && (
                <ListItem>
                  <ListItemText primary="No active bookings" />
                </ListItem>
              )}
            </List>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<DirectionsCar />}
                onClick={() => navigate('/booking')}
              >
                BOOK PARKING
              </Button>
              <Button
                variant="outlined"
                startIcon={<AccessTime />}
                onClick={() => navigate('/view-bookings')}
              >
                VIEW BOOKINGS
              </Button>
              <Button
                variant="outlined"
                startIcon={<AccessTime />}
                onClick={() => navigate('/reports')}
              >
                VIEW REPORTS
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Recent Bookings
            </Typography>
            <List>
              {getRecentBookings().map((booking) => (
                <React.Fragment key={booking.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${getAreaById(booking.areaId)?.name} - Slot ${booking.slotId}`}
                      secondary={`${format(new Date(booking.startTime), 'MMM dd, yyyy hh:mm a')}`}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ₹{booking.amount}
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {getRecentBookings().length === 0 && (
                <ListItem>
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