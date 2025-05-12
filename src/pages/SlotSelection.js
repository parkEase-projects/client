import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    Snackbar
} from '@mui/material';
import { format } from 'date-fns';
import { 
    getSlotsByArea, 
    getAreaById, 
    processPayment, 
    calculateBookingAmount,
    createBooking,
    updateSlotStatus 
} from '../data/mockData';

const SlotSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    const bookingDetails = location.state;
    const parkingArea = bookingDetails ? getAreaById(bookingDetails.selectedArea) : null;
    const slots = bookingDetails ? getSlotsByArea(bookingDetails.selectedArea) : [];

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setShowPaymentDialog(true);
    };

    const handlePaymentConfirm = async () => {
        setProcessingPayment(true);
        setError('');

        try {
            const startTime = bookingDetails.date + 'T' + bookingDetails.time;
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 2); // 2 hours duration

            const amount = calculateBookingAmount(startTime, endTime.toISOString());
            
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create local booking
            const bookingData = {
                id: Date.now(), // Generate unique ID
                userId: 'user123', // You can get this from your auth context
                areaId: bookingDetails.selectedArea,
                slotId: selectedSlot.id,
                startTime: startTime,
                endTime: endTime.toISOString(),
                amount: amount,
                status: 'confirmed'
            };

            // Store booking in local storage
            const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            existingBookings.push(bookingData);
            localStorage.setItem('bookings', JSON.stringify(existingBookings));

            // Update slot status locally
            updateSlotStatus(selectedSlot.id, 'booked');

            // Navigate to booking confirmation
            navigate('/booking-confirmation', {
                state: {
                    ...bookingDetails,
                    selectedSlot: selectedSlot.id,
                    bookingId: bookingData.id,
                    amount: amount
                }
            });

        } catch (error) {
            setError('Booking failed. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };

    if (!bookingDetails || !parkingArea) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">
                    Invalid booking details. Please start a new booking.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Select Parking Slot
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Booking Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Area:</strong> {parkingArea.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Date:</strong> {format(new Date(bookingDetails.date), 'MMMM dd, yyyy')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Time:</strong> {format(new Date(`2000-01-01T${bookingDetails.time}`), 'hh:mm a')}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2}>
                {slots.map((slot) => (
                    <Grid item xs={6} sm={4} md={3} key={slot.id}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                cursor: slot.status === 'available' ? 'pointer' : 'not-allowed',
                                bgcolor: slot.status === 'available' 
                                    ? 'background.paper'
                                    : '#f5f5f5',
                                '&:hover': slot.status === 'available' 
                                    ? { bgcolor: '#e3f2fd' }
                                    : {}
                            }}
                            onClick={() => slot.status === 'available' && handleSlotSelect(slot)}
                        >
                            <Typography variant="h6">
                                Slot {slot.slotNumber}
                            </Typography>
                            <Typography
                                color={slot.status === 'available' ? 'success.main' : 'error.main'}
                            >
                                {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onClose={() => !processingPayment && setShowPaymentDialog(false)}>
                <DialogTitle>Confirm and Pay</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Parking Area"
                                secondary={parkingArea.name}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Slot Number"
                                secondary={selectedSlot ? `Slot ${selectedSlot.slotNumber}` : ''}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Date"
                                secondary={format(new Date(bookingDetails.date), 'MMMM dd, yyyy')}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Time"
                                secondary={format(new Date(`2000-01-01T${bookingDetails.time}`), 'hh:mm a')}
                            />
                        </ListItem>
                        <Divider sx={{ my: 1 }} />
                        <ListItem>
                            <ListItemText
                                primary="Duration"
                                secondary="2 hours"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Amount"
                                secondary="₹100"
                            />
                        </ListItem>
                    </List>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setShowPaymentDialog(false)} 
                        disabled={processingPayment}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePaymentConfirm}
                        variant="contained"
                        color="primary"
                        disabled={processingPayment}
                        startIcon={processingPayment && <CircularProgress size={20} />}
                    >
                        {processingPayment ? 'Processing...' : 'Confirm & Pay'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SlotSelection; 