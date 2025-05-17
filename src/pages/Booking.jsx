import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { fetchUserBookings, fetchBookingHistory, cancelBooking } from '../store/slices/parkingSlice';
import { format } from 'date-fns';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 20 }}>
    {value === index && children}
  </div>
);

const Booking = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userBookings, bookingHistory, loading, error } = useSelector((state) => state.parking);
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserBookings(user.id));
      dispatch(fetchBookingHistory(user.id));
    }
  }, [dispatch, user]);

  const handleCancelBooking = async () => {
    if (selectedBooking) {
      await dispatch(cancelBooking(selectedBooking.id));
      setOpenCancelDialog(false);
      setSelectedBooking(null);
    }
  };

  const renderBookingCard = (booking, isHistory = false) => (
    <Grid item xs={12} md={6} key={booking.id}>
      <Paper
        sx={{
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          borderLeft: (theme) => `6px solid ${
            booking.status === 'active'
              ? theme.palette.primary.main
              : booking.status === 'completed'
              ? theme.palette.success.main
              : theme.palette.error.main
          }`,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {booking.area_name} - Slot {booking.slot_number}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Start Time
            </Typography>
            <Typography>
              {format(new Date(booking.start_time), 'MMM dd, yyyy HH:mm')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              End Time
            </Typography>
            <Typography>
              {format(new Date(booking.end_time), 'MMM dd, yyyy HH:mm')}
            </Typography>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Vehicle Number
          </Typography>
          <Typography>{booking.vehicle_number}</Typography>
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary">
            ₹{booking.amount}
          </Typography>
          {!isHistory && booking.status === 'active' && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => {
                setSelectedBooking(booking);
                setOpenCancelDialog(true);
              }}
            >
              Cancel
            </Button>
          )}
          {isHistory && (
            <Box display="flex" alignItems="center">
              {booking.status === 'completed' ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
              <Typography
                variant="body2"
                color={booking.status === 'completed' ? 'success' : 'error'}
                sx={{ ml: 1 }}
              >
                {booking.status}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab
              label="Active Bookings"
              icon={<ScheduleIcon />}
              iconPosition="start"
            />
            <Tab
              label="Booking History"
              icon={<CheckCircleIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {userBookings.length > 0 ? (
                  userBookings.map((booking) => renderBookingCard(booking))
                ) : (
                  <Grid item xs={12}>
                    <Alert severity="info">No active bookings found.</Alert>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {bookingHistory.length > 0 ? (
                  bookingHistory.map((booking) => renderBookingCard(booking, true))
                ) : (
                  <Grid item xs={12}>
                    <Alert severity="info">No booking history found.</Alert>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
          </>
        )}
      </Box>

      {/* Cancel Booking Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>No, Keep</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Booking; 