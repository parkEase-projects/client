import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Breadcrumbs,
  Link,
  Divider,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';
import {
  fetchParkingSlots,
  fetchAvailableSlots,
  preBookSlot,
  processWalkIn,
  selectSlot,
  clearSelectedSlot,
} from '../store/slices/parkingSlice';

const ParkingMap = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { slots, availableSlots, selectedSlot, loading, error, areas } = useSelector(
    (state) => state.parking
  );
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingType, setBookingType] = useState('pre-booking');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [vehicleId, setVehicleId] = useState('');

  // Get parameters from both URL and state
  const searchParams = new URLSearchParams(location.search);
  const urlAreaId = searchParams.get('area');
  const urlDate = searchParams.get('date');
  const urlTime = searchParams.get('time');
  
  const { areaName, date: formattedDate, time: formattedTime } = location.state || {};

  // If no parameters are present, redirect back to home
  useEffect(() => {
    if (!urlAreaId || !urlDate || !urlTime) {
      navigate('/');
      return;
    }

    // If we don't have state (e.g., page refresh), format the display values
    if (!location.state) {
      const dateObj = new Date(urlDate);
      const [hours, minutes] = urlTime.split(':');
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours), parseInt(minutes));

      // Update the state with formatted values
      navigate(location.pathname + location.search, {
        replace: true,
        state: {
          areaName: areas.find(a => a.id === parseInt(urlAreaId))?.name || 'Loading...',
          areaId: urlAreaId,
          date: format(dateObj, 'MMMM dd, yyyy'),
          time: format(timeObj, 'h:mm a'),
          rawDate: urlDate,
          rawTime: urlTime
        }
      });
    }
  }, [urlAreaId, urlDate, urlTime, location.state, navigate, areas]);

  useEffect(() => {
    if (urlAreaId && urlDate && urlTime) {
      dispatch(fetchParkingSlots(urlAreaId));
      dispatch(fetchAvailableSlots({ 
        areaId: urlAreaId, 
        date: urlDate, 
        time: urlTime 
      }));
    }
  }, [dispatch, urlAreaId, urlDate, urlTime]);

  const handleSlotClick = (slot) => {
    dispatch(selectSlot(slot));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    dispatch(clearSelectedSlot());
  };

  const handleBooking = async () => {
    if (bookingType === 'pre-booking') {
      await dispatch(
        preBookSlot({
          slotId: selectedSlot._id,
          startTime,
          endTime,
          vehicleId,
        })
      );
    } else {
      await dispatch(
        processWalkIn({
          slotId: selectedSlot._id,
          vehicleId,
        })
      );
    }
    handleCloseDialog();
  };

  const renderSlot = (slot) => {
    const isAvailable = slot.status === 'available' && !slot.isPreBooked;
    const isSelected = selectedSlot?._id === slot._id;

    return (
      <Grid item xs={4} sm={3} md={2} key={slot._id}>
        <Paper
          elevation={isSelected ? 4 : 2}
          sx={{
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isAvailable
              ? '#4caf50'
              : slot.isPreBooked
              ? '#ff9800'
              : '#f44336',
            color: 'white',
            '&:hover': {
              backgroundColor: isAvailable
                ? '#388e3c'
                : slot.isPreBooked
                ? '#f57c00'
                : '#d32f2f',
            },
          }}
          onClick={() => isAvailable && handleSlotClick(slot)}
        >
          <Typography variant="subtitle1">{slot.slotNumber}</Typography>
          <Typography variant="caption" display="block">
            {slot.slotType}
          </Typography>
        </Paper>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Home
          </Link>
          <Typography color="text.primary">{areaName || 'Loading...'}</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom>
          {areaName || 'Loading...'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip
            icon={<CalendarTodayIcon />}
            label={formattedDate || 'Loading...'}
            variant="outlined"
            color="primary"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={formattedTime || 'Loading...'}
            variant="outlined"
            color="primary"
          />
        </Box>

        <Divider sx={{ my: 2 }} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2}>
              {slots.map(renderSlot)}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Book Parking Slot</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Booking Type</InputLabel>
              <Select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
                label="Booking Type"
              >
                <MenuItem value="pre-booking">Pre-booking</MenuItem>
                <MenuItem value="walk-in">Walk-in</MenuItem>
              </Select>
            </FormControl>

            {bookingType === 'pre-booking' && (
              <>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={setStartTime}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth sx={{ mb: 2 }} />
                    )}
                  />
                  <DateTimePicker
                    label="End Time"
                    value={endTime}
                    onChange={setEndTime}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth sx={{ mb: 2 }} />
                    )}
                  />
                </LocalizationProvider>
              </>
            )}

            <TextField
              fullWidth
              label="Vehicle ID"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary">
              Selected Slot: {selectedSlot?.slotNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {selectedSlot?.slotType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price per hour: ${selectedSlot?.pricePerHour}
            </Typography>
            {bookingType === 'pre-booking' && (
              <Typography variant="body2" color="text.secondary">
                Pre-booking fee: ${selectedSlot?.preBookingFee}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleBooking}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ParkingMap; 