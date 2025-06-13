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
  CircularProgress,
  Alert
} from '@mui/material';
import {
  DirectionsCar,
  AccessTime,
  Payment,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    active_bookings: 0,
    total_bookings: 0,
    total_spent: 0,
    recent_bookings: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/booking/dashboard/stats`);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

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

        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Bookings</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {dashboardData.total_bookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Active Bookings</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {dashboardData.active_bookings}
              </Typography>
            </CardContent>
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
                Rs. {dashboardData.total_spent}
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
              {dashboardData.active_bookings > 0 ? (
                dashboardData.recent_bookings
                  .filter(booking => booking.status === 'active')
                  .map((booking) => (
                    <React.Fragment key={booking.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${booking.area_name} - Slot ${booking.slot_number}`}
                          secondary={`${format(new Date(booking.start_time), 'MMM dd, yyyy hh:mm a')} - ${format(new Date(booking.end_time), 'hh:mm a')}`}
                        />
                        <Typography variant="body2" color="success.main">
                          Active Now
                        </Typography>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
              ) : (
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
                startIcon={<Assessment />}
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
              {dashboardData.recent_bookings.length > 0 ? (
                dashboardData.recent_bookings.map((booking) => (
                  <React.Fragment key={booking.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${booking.area_name} - Slot ${booking.slot_number}`}
                        secondary={`${format(new Date(booking.start_time), 'MMM dd, yyyy hh:mm a')}`}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Rs. {booking.amount}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
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