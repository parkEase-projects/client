import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { getBookings, getAreaById } from '../data/mockData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const Reports = () => {
  const [bookings, setBookings] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [areaUsageData, setAreaUsageData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const allBookings = getBookings();
    setBookings(allBookings);

    // Process data for different charts
    processMonthlyData(allBookings);
    processAreaUsageData(allBookings);
    processRevenueData(allBookings);
  }, []);

  const processMonthlyData = (bookings) => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const dailyBookings = daysInMonth.map(day => {
      const count = bookings.filter(booking => {
        const bookingDate = new Date(booking.startTime);
        return format(bookingDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      }).length;

      return {
        date: format(day, 'dd MMM'),
        bookings: count,
      };
    });

    setMonthlyData(dailyBookings);
  };

  const processAreaUsageData = (bookings) => {
    const areaUsage = {};
    bookings.forEach(booking => {
      const areaName = getAreaById(booking.areaId)?.name || 'Unknown';
      areaUsage[areaName] = (areaUsage[areaName] || 0) + 1;
    });

    const data = Object.entries(areaUsage).map(([name, value]) => ({
      name,
      value,
    }));

    setAreaUsageData(data);
  };

  const processRevenueData = (bookings) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const data = last7Days.map(date => {
      const dayRevenue = bookings
        .filter(booking => format(new Date(booking.startTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
        .reduce((total, booking) => total + (booking.amount || 0), 0);

      return {
        date: format(date, 'dd MMM'),
        revenue: dayRevenue,
      };
    });

    setRevenueData(data);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const calculateStats = () => {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
    const averageBookingValue = totalBookings ? (totalRevenue / totalBookings).toFixed(2) : 0;

    return {
      totalBookings,
      totalRevenue,
      averageBookingValue,
      activeUsers: Math.floor(totalBookings * 0.7), // Mock active users calculation
    };
  };

  const stats = calculateStats();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Analytics & Reports
      </Typography>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h4">
                {stats.totalBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ₹{stats.totalRevenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Booking Value
              </Typography>
              <Typography variant="h4">
                ₹{stats.averageBookingValue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4">
                {stats.activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Monthly Bookings Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Bookings Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Parking Area Usage Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Area Usage Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={areaUsageData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {areaUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Trend (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports; 