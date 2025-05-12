import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import { getBookings, getAreaById } from '../data/mockData';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Load bookings from localStorage
        const userBookings = getBookings();
        setBookings(userBookings);

        // If we have a booking reference from navigation state, highlight that booking
        if (location.state?.bookingReference) {
            const highlightedBooking = userBookings.find(
                booking => booking.id === location.state.bookingReference
            );
            if (highlightedBooking) {
                setSelectedBooking(highlightedBooking);
                setOpenDialog(true);
            }
        }
    }, [location.state?.bookingReference]);

    const handleNewBooking = () => {
        navigate('/booking');
    };

    const handleDeleteBooking = (bookingId) => {
        // Remove booking from localStorage
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
        setOpenDialog(false);
    };

    const getStatusColor = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return 'info'; // Upcoming
        if (now >= start && now <= end) return 'success'; // Active
        return 'error'; // Expired
    };

    const getStatusText = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return 'Upcoming';
        if (now >= start && now <= end) return 'Active';
        return 'Expired';
    };

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Bookings
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNewBooking}
                >
                    New Booking
                </Button>
            </Box>

            {bookings.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No bookings found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You haven't made any parking bookings yet.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewBooking}
                    >
                        Book a Parking Slot
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {bookings.map((booking) => {
                        const area = getAreaById(booking.areaId);
                        const statusColor = getStatusColor(booking.startTime, booking.endTime);
                        const statusText = getStatusText(booking.startTime, booking.endTime);

                        return (
                            <Grid item xs={12} md={6} key={booking.id}>
                                <Card 
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 6 },
                                        border: selectedBooking?.id === booking.id ? 2 : 0,
                                        borderColor: 'primary.main'
                                    }}
                                    onClick={() => handleViewDetails(booking)}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    {area?.name} - Slot {booking.slotId}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Booking ID: {booking.id}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={statusText}
                                                color={statusColor}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Date: {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Time: {format(new Date(booking.startTime), 'hh:mm a')} - {format(new Date(booking.endTime), 'hh:mm a')}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Vehicle: {booking.vehicleNumber}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Booking Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                {selectedBooking && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Booking Details
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ py: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Booking Reference: {selectedBooking.id}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Parking Area: {getAreaById(selectedBooking.areaId)?.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Slot Number: {selectedBooking.slotId}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Vehicle Number: {selectedBooking.vehicleNumber}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Customer Name: {selectedBooking.customerName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Date: {format(new Date(selectedBooking.startTime), 'MMMM dd, yyyy')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Time: {format(new Date(selectedBooking.startTime), 'hh:mm a')} - {format(new Date(selectedBooking.endTime), 'hh:mm a')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Amount Paid: ₹{selectedBooking.amount}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Chip
                                            label={getStatusText(selectedBooking.startTime, selectedBooking.endTime)}
                                            color={getStatusColor(selectedBooking.startTime, selectedBooking.endTime)}
                                            sx={{ mt: 1 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default ViewBookings; 