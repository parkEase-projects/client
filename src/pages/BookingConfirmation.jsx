import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    TextField
} from '@mui/material';
import { format } from 'date-fns';
import { createBooking, currentUser, getAreaById } from '../data/mockData';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const bookingDetails = location.state;

    const handleConfirmBooking = async () => {
        if (!vehicleNumber.trim()) {
            setError('Please enter a vehicle number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create booking using mock data
            const bookingData = {
                userId: currentUser.id,
                slotId: bookingDetails.selectedSlot,
                areaId: bookingDetails.selectedArea,
                startTime: bookingDetails.date + 'T' + bookingDetails.time,
                endTime: calculateEndTime(bookingDetails.date, bookingDetails.time, 2), // 2 hours duration
                vehicleNumber: vehicleNumber,
            };

            const newBooking = createBooking(bookingData);
            
            setSuccess(true);
            setTimeout(() => {
                navigate('/view-bookings', { 
                    state: { 
                        bookingConfirmed: true,
                        bookingId: newBooking.id 
                    } 
                });
            }, 2000);

        } catch (error) {
            setError('Failed to confirm booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateEndTime = (date, time, hours) => {
        const datetime = new Date(date + 'T' + time);
        datetime.setHours(datetime.getHours() + hours);
        return datetime.toISOString();
    };

    if (!bookingDetails) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">
                    No booking details found. Please start a new booking.
                </Alert>
            </Container>
        );
    }

    const parkingArea = getAreaById(bookingDetails.selectedArea);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Booking Confirmation
                </Typography>

                {success ? (
                    <Box sx={{ textAlign: 'center', my: 4 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Booking Confirmed Successfully!
                        </Typography>
                        <CircularProgress sx={{ mt: 2 }} />
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Redirecting to your bookings...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Booking Details
                                </Typography>
                                <Divider />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1">
                                    <strong>Parking Area:</strong> {parkingArea?.name}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1">
                                    <strong>Slot Number:</strong> {bookingDetails.selectedSlot}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1">
                                    <strong>Date:</strong> {format(new Date(bookingDetails.date), 'MMMM dd, yyyy')}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1">
                                    <strong>Time:</strong> {format(new Date(`2000-01-01T${bookingDetails.time}`), 'hh:mm a')}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Vehicle Number"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                    error={!!error && !vehicleNumber}
                                    helperText={!vehicleNumber && error}
                                    disabled={loading}
                                    sx={{ mt: 2 }}
                                />
                            </Grid>

                            {error && !success && (
                                <Grid item xs={12}>
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {error}
                                    </Alert>
                                </Grid>
                            )}

                            <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={handleConfirmBooking}
                                    disabled={loading}
                                    sx={{ minWidth: 200 }}
                                >
                                    {loading ? (
                                        <>
                                            <CircularProgress size={24} sx={{ mr: 1 }} />
                                            Confirming...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default BookingConfirmation; 