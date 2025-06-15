import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, TextField, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const statusColors = {
  available: '#fff',
  selected: '#4caf50',
  booked: '#f06292',
  reserved: '#3f51b5',
  broken: '#8d6e63'  
};

const statusLabels = {
  available: 'Available',
  selected: 'Selected by You',
  booked: 'Booked',
  reserved: 'Reserved',
  broken: 'Broken',
  handicap: 'Handicap',
  not_available: 'Not Available',
};

const HOURLY_RATE = 50; // Base rate per hour in rupees

const calculateBookingAmount = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const hours = (end - start) / (1000 * 60 * 60);
  return Math.ceil(hours * HOURLY_RATE);
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ParkingSlots = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQuery();
  
  // Get data from location state or URL parameters
  const area = location.state?.areaName || query.get('area');
  const date = location.state?.rawDate || query.get('date');
  const time = location.state?.rawTime || query.get('time');
  const areaId = location.state?.areaId || 1; // Default to 1 if not provided

  console.log('ParkingSlots - Received params:', { area, date, time, areaId }); // Debug log

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [parkingHours, setParkingHours] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [parkingFee, setParkingFee] = useState(0);
  const [cardType, setCardType] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const startTime = new Date(date + 'T' + time);
        const endTime = new Date(startTime.getTime() + (parseInt(parkingHours || 1) * 60 * 60 * 1000));
        const slotsResponse = await axios.get(
          `${API_URL}/api/parking/areas/${areaId}/slots`, {
            params: {
              start_time: startTime.toISOString(),
              end_time: endTime.toISOString()
            }
          }
        );
        setSlots(slotsResponse.data);
      } catch (error) {
        setErrorMessage('Failed to load parking slots. Please try again.');
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [areaId, date, time, parkingHours]);

  const handleParkingHoursChange = (e) => {
    const hours = e.target.value;
    setParkingHours(hours);
    if (hours > 0) {
      const startTime = new Date(date + 'T' + time);
      const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);
      const fee = calculateBookingAmount(startTime, endTime);
      setParkingFee(fee);
    } else {
      setParkingFee(0);
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
    }
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      setErrorMessage('Please select a parking slot');
      setShowError(true);
      return;
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleBookingConfirm = async () => {
    try {
      if (!vehicleNumber || !parkingHours || !name) {
        setErrorMessage('Please fill in all required fields');
        setShowError(true);
        return;
      }

      const startDateTime = new Date(date + 'T' + time);
      const endDateTime = new Date(startDateTime.getTime() + (parseInt(parkingHours) * 60 * 60 * 1000));
      
      const bookingData = {
        slot_id: selectedSlot.id,
        area_id: areaId,
        vehicle_number: vehicleNumber,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        amount: parkingFee
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/parking/book`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 201) {
        // Update local state
        const updatedSlots = slots.map(slot => 
          slot.id === selectedSlot.id ? { ...slot, status: 'booked' } : slot
        );
        setSlots(updatedSlots);
        
        setBookingReference(response.data.id);
        setOpenDialog(false);
        setSuccessDialogOpen(true);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to complete booking. Please try again.');
      setShowError(true);
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
    // Reset form fields
    setVehicleNumber('');
    setParkingHours('');
    setParkingFee(0);
    setName('');
    setSelectedSlot(null);
    setBookingReference('');
    // Navigate back to home
    navigate('/');
  };

  const handleCardTypeChange = (event, newCardType) => {
    if (newCardType !== null) {
      setCardType(newCardType);
    }
  };

  const handleViewBookings = () => {
    setSuccessDialogOpen(false);
    navigate('/view-bookings', {
      state: {
        bookingReference: bookingReference
      }
    });
  };

  const displaySlots = slots.map(slot =>
    slot.id === selectedSlot?.id ? { ...slot, status: 'selected' } : slot
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 8, mb: 8 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Parking Slots for {area} on {date} at {time}
      </Typography>

      {/* Error Snackbar */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} direction="column" alignItems="center">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid item container spacing={2} justifyContent="center" sx={{ mb: 3, mt: 2 }}>
              {displaySlots.map((slot) => (
                <Grid item key={slot.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title={statusLabels[slot.status] + (slot.user ? ` (${slot.user})` : '')}>
                    <Box
                      sx={{
                        width: 50,
                        height: 70,
                        bgcolor:
                          slot.id === selectedSlot?.id
                            ? '#4caf50' // Green for selected
                            : slot.status === 'booked'
                            ? '#f06292' // Pink for booked
                            : '#fff',   // White for available
                        color: slot.status === 'available' || slot.id === selectedSlot?.id ? '#3f51b5' : '#fff',
                        border: '2px solid #3f51b5',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                        cursor: slot.status === 'available' ? 'pointer' : 'not-allowed',
                        opacity: slot.status === 'not_available' ? 0.5 : 1,
                      }}
                      onClick={() => handleSlotClick(slot)}
                    >
                      {slot.slot_number}
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Paper>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Legend:</Typography>
        <Grid container spacing={1} alignItems="center">
          {Object.entries(statusColors).map(([key, color]) => (
            <Grid item key={key} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Box sx={{ width: 24, height: 24, bgcolor: color, border: '1px solid #3f51b5', borderRadius: 1, mr: 1 }} />
              <Typography variant="body2">{statusLabels[key]}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Vehicle Details Section */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Vehicle Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter vehicle number"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Parking Hours"
              type="number"
              value={parkingHours}
              onChange={handleParkingHoursChange}
              placeholder="Enter number of hours"
              variant="outlined"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
        </Grid>

        {/* Parking Fee Display */}
        {parkingHours > 0 && (
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1,
            border: '1px solid #e0e0e0'
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Parking Fee Breakdown:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Rate per hour: Rs. {HOURLY_RATE}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Number of hours: {parkingHours}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 1,
                  pt: 2,
                  borderTop: '1px dashed #bdbdbd'
                }}>
                  <Typography variant="h6">
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Rs. {parkingFee}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Payment Section */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Billing Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </Grid>          
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
              Select Card Type
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={cardType === 'amex' ? 'contained' : 'outlined'}
                onClick={() => handleCardTypeChange(null, 'amex')}
                sx={{
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: cardType === 'amex' ? '#f5f5f5' : 'transparent',
                  borderColor: '#e0e0e0',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    borderColor: '#e0e0e0'
                  }
                }}
              >
                <Box 
                  component="img"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAXsK18fdDeWueVbQ9nygEUk-TuX98Gm1dDJxCVjtXwG_XtAyDFPKiHT8zM-COMSyG2J8&usqp=CAU"
                  sx={{ 
                    width: 40, 
                    height: 25, 
                    borderRadius: 0.5,
                    objectFit: 'contain'
                  }}
                  alt="Amex"
                />
                <Typography>Amex</Typography>
              </Button>

              <Button
                variant={cardType === 'visa' ? 'contained' : 'outlined'}
                onClick={() => handleCardTypeChange(null, 'visa')}
                sx={{
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: cardType === 'visa' ? '#f5f5f5' : 'transparent',
                  borderColor: '#e0e0e0',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    borderColor: '#e0e0e0'
                  }
                }}
              >
                <Box 
                  component="img"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                  sx={{ 
                    width: 40, 
                    height: 25, 
                    borderRadius: 0.5,
                    objectFit: 'contain'
                  }}
                  alt="Visa"
                />
                <Typography>Visa</Typography>
              </Button>

              <Button
                variant={cardType === 'mastercard' ? 'contained' : 'outlined'}
                onClick={() => handleCardTypeChange(null, 'mastercard')}
                sx={{
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: cardType === 'mastercard' ? '#f5f5f5' : 'transparent',
                  borderColor: '#e0e0e0',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    borderColor: '#e0e0e0'
                  }
                }}
              >
                <Box 
                  component="img"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXnXkBmw2uSAI7UPnfI8ZWleOP_9jguz46rQ&s"
                  sx={{ 
                    width: 40, 
                    height: 25, 
                    borderRadius: 0.5,
                    objectFit: 'contain'
                  }}
                  alt="Mastercard"
                />
                <Typography>Mastercard</Typography>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              variant="outlined"
              inputProps={{ maxLength: 16 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              variant="outlined"
              inputProps={{ maxLength: 5 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CVC"
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              variant="outlined"
              inputProps={{ maxLength: 3 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Update the Confirm Booking button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedSlot || !vehicleNumber || !parkingHours || !name || !cardNumber || !cardholderName || !expiryDate || !cvv}
          onClick={handleConfirm}
          size="large"
          sx={{ px: 4, py: 1.5 }}
        >
          Confirm Booking
        </Button>
      </Box>

      
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Parking Area: <b>{area}</b>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Selected Slot: <b>{selectedSlot?.id}</b>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Vehicle Number: <b>{vehicleNumber}</b>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Date: <b>{date}</b>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Time: <b>{time}</b>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Duration: <b>{parkingHours} hours</b>
            </Typography>
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              border: '1px solid #e0e0e0' 
            }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Payment Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Rate per hour:</Typography>
                <Typography>Rs. {HOURLY_RATE}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Duration:</Typography>
                <Typography>{parkingHours} hours</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 2,
                pt: 2,
                borderTop: '1px dashed #bdbdbd'
              }}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6" color="primary">Rs. {parkingFee}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleBookingConfirm} color="primary" variant="contained">
            Confirm & Pay Rs. {parkingFee}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog 
        open={successDialogOpen} 
        onClose={handleSuccessClose}
        maxWidth="sm" 
        fullWidth
      >
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: '#f5f5f5'
        }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: '#4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 3
          }}>
            <Box component="svg" viewBox="0 0 24 24" sx={{ width: 50, height: 50, color: 'white' }}>
              <path 
                fill="currentColor" 
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            Booking Successful!
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 3, color: '#666' }}>
            Your parking slot has been successfully booked
          </Typography>

          <Box sx={{ 
            bgcolor: 'white', 
            p: 3, 
            borderRadius: 2,
            border: '1px dashed #4caf50',
            mb: 3
          }}>
            <Typography variant="body1" gutterBottom>
              Booking Reference Number:
            </Typography>
            <Typography variant="h6" sx={{ color: '#1976d2', letterSpacing: 1 }}>
              {bookingReference}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Please save your booking reference number: {bookingReference}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can use this reference number to view your booking details later.
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={handleViewBookings}
            >
              View My Bookings
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSuccessClose}
              color="primary"
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ParkingSlots; 