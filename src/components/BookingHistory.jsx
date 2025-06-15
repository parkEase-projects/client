import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import { Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const BookingHistory = ({ userRole, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    search: '',
  });

  useEffect(() => {
    fetchBookings();
  }, [userRole, userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const endpoint = userRole === 'admin' 
        ? `${API_URL}/api/parking/bookings/history`
        : `${API_URL}/api/parking/bookings/history/${userId}`;
      
      const response = await axios.get(endpoint);
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch booking history');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = !filters.status || booking.booking_status === filters.status;
    const matchesSearch = !filters.search || 
      booking.vehicle_number.toLowerCase().includes(filters.search.toLowerCase()) ||
      booking.area_name.toLowerCase().includes(filters.search.toLowerCase());
    
    if (filters.dateRange) {
      const bookingDate = new Date(booking.start_time);
      const today = new Date();
      const lastWeek = new Date(today.setDate(today.getDate() - 7));
      const lastMonth = new Date(today.setDate(today.getDate() - 30));
      
      switch (filters.dateRange) {
        case 'week':
          return bookingDate >= lastWeek;
        case 'month':
          return bookingDate >= lastMonth;
        default:
          return true;
      }
    }
    
    return matchesStatus && matchesSearch;
  });

  const handleDownloadReport = async () => {
    try {
      const endpoint = userRole === 'admin'
        ? `${API_URL}/bookings/report`
        : `${API_URL}/bookings/report/${userId}`;
      
      const response = await axios.get(endpoint, {
        responseType: 'blob',
        params: filters
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'booking-history-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report');
    }
  };

  if (loading) {
    return <Typography>Loading booking history...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Booking Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Date Range"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by vehicle or area..."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Download Report">
            <IconButton
              color="primary"
              onClick={handleDownloadReport}
              sx={{ mt: 1 }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Actual End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.area_name}</TableCell>
                <TableCell>{booking.slot_id}</TableCell>
                <TableCell>{booking.vehicle_number}</TableCell>
                <TableCell>{format(new Date(booking.start_time), 'MMM dd, yyyy HH:mm')}</TableCell>
                <TableCell>{format(new Date(booking.end_time), 'MMM dd, yyyy HH:mm')}</TableCell>
                <TableCell>
                  {booking.actual_end_time
                    ? format(new Date(booking.actual_end_time), 'MMM dd, yyyy HH:mm')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: 
                        booking.booking_status === 'completed' ? 'success.light' :
                        booking.booking_status === 'cancelled' ? 'error.light' :
                        'warning.light',
                      color: 
                        booking.booking_status === 'completed' ? 'success.dark' :
                        booking.booking_status === 'cancelled' ? 'error.dark' :
                        'warning.dark',
                    }}
                  >
                    {booking.booking_status}
                  </Box>
                </TableCell>
                <TableCell>₹{booking.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingHistory; 