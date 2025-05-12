import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async Thunks
export const fetchParkingAreas = createAsyncThunk(
  'parking/fetchAreas',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/parking/areas`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAreaSlots = createAsyncThunk(
  'parking/fetchAreaSlots',
  async (areaId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/parking/areas/${areaId}/slots`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'parking/fetchAvailableSlots',
  async ({ startTime, endTime, areaId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/parking/slots/available?start_time=${startTime}&end_time=${endTime}&area_id=${areaId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const bookSlot = createAsyncThunk(
  'parking/bookSlot',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/parking/book`, bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'parking/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/parking/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBookingHistory = createAsyncThunk(
  'parking/fetchBookingHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/parking/bookings/history/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'parking/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/parking/bookings/${bookingId}/cancel`);
      return { ...response.data, bookingId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchParkingSlots = createAsyncThunk(
  'parking/fetchParkingSlots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/parking/slots`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const preBookSlot = createAsyncThunk(
  'parking/preBookSlot',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/parking/book/pre`, bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const processWalkIn = createAsyncThunk(
  'parking/processWalkIn',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/parking/book/walkin`, bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  areas: [],
  selectedArea: null,
  slots: [],
  selectedSlot: null,
  availableSlots: [],
  userBookings: [],
  bookingHistory: [],
  loading: false,
  error: null,
};

const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    setSelectedArea: (state, action) => {
      state.selectedArea = action.payload;
    },
    selectSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    clearSelectedSlot: (state) => {
      state.selectedSlot = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Parking Areas
      .addCase(fetchParkingAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkingAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.areas = action.payload;
      })
      .addCase(fetchParkingAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch parking areas';
      })

      // Fetch Area Slots
      .addCase(fetchAreaSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAreaSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchAreaSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch slots';
      })

      // Fetch Available Slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch available slots';
      })

      // Book Slot
      .addCase(bookSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookSlot.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bookSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to book slot';
      })

      // Fetch User Bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch bookings';
      })

      // Fetch Booking History
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
        state.error = action.payload?.error || 'Failed to fetch booking history';
      })

      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = state.userBookings.filter(
          booking => booking.id !== action.payload.bookingId
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to cancel booking';
      })

      // Fetch Parking Slots
      .addCase(fetchParkingSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkingSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchParkingSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch parking slots';
      })

      // Pre-book Slot
      .addCase(preBookSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(preBookSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = state.slots.map(slot =>
          slot._id === action.payload.slotId
            ? { ...slot, isPreBooked: true }
            : slot
        );
      })
      .addCase(preBookSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to pre-book slot';
      })

      // Process Walk-in
      .addCase(processWalkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processWalkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = state.slots.map(slot =>
          slot._id === action.payload.slotId
            ? { ...slot, status: 'occupied' }
            : slot
        );
      })
      .addCase(processWalkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to process walk-in';
      });
  },
});

export const { setSelectedArea, selectSlot, clearSelectedSlot, clearError } = parkingSlice.actions;
export default parkingSlice.reducer; 