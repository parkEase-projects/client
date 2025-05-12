import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunks
export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/user`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBookingHistory = createAsyncThunk(
  'booking/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/history`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const extendBooking = createAsyncThunk(
  'booking/extend',
  async ({ bookingId, newEndTime }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/bookings/${bookingId}/extend`, {
        newEndTime,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  currentBookings: [],
  bookingHistory: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bookings';
      })
      // Fetch booking history
      .addCase(fetchBookingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingHistory = action.payload;
      })
      .addCase(fetchBookingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch booking history';
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBookings = state.currentBookings.filter(
          (booking) => booking._id !== action.payload.bookingId
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to cancel booking';
      })
      // Extend booking
      .addCase(extendBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extendBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currentBookings.findIndex(
          (booking) => booking._id === action.payload.bookingId
        );
        if (index !== -1) {
          state.currentBookings[index] = {
            ...state.currentBookings[index],
            ...action.payload.updatedBooking,
          };
        }
      })
      .addCase(extendBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to extend booking';
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer; 