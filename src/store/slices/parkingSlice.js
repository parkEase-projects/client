import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { parkingAreas, getSlotsByArea } from '../../data/mockData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async Thunks
export const fetchParkingAreas = createAsyncThunk(
  'parking/fetchAreas',
  async () => {
    const response = await axios.get(`${API_URL}/api/parking/areas`);
    return response.data;
  }
);

export const createParkingArea = createAsyncThunk(
  'parking/createArea',
  async (areaData) => {
    const response = await axios.post(`${API_URL}/api/parking/areas`, areaData);
    return response.data;
  }
);

export const updateParkingArea = createAsyncThunk(
  'parking/updateArea',
  async ({ id, ...areaData }) => {
    const response = await axios.put(`${API_URL}/api/parking/areas/${id}`, areaData);
    return response.data;
  }
);

export const deleteParkingArea = createAsyncThunk(
  'parking/deleteArea',
  async (id) => {
    await axios.delete(`${API_URL}/api/parking/areas/${id}`);
    return id;
  }
);

export const fetchAreaSlots = createAsyncThunk(
  'parking/fetchAreaSlots',
  async (areaId, { rejectWithValue }) => {
    try {
      // Use mock data instead of API call
      return getSlotsByArea(areaId);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'parking/fetchAvailableSlots',
  async ({ startTime, endTime, areaId }, { rejectWithValue }) => {
    try {
      // Use mock data instead of API call
      return getSlotsByArea(areaId);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const bookSlot = createAsyncThunk(
  'parking/bookSlot',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/book`, bookingData);
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
      const response = await axios.get(`${API_URL}/bookings/user/${userId}`);
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
      const response = await axios.post(`${API_URL}/bookings/${bookingId}/cancel`);
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
      const response = await axios.get(`${API_URL}/slots`);
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
      const response = await axios.post(`${API_URL}/book/pre`, bookingData);
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
      const response = await axios.post(`${API_URL}/book/walkin`, bookingData);
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
      // Fetch areas
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
        state.error = action.error.message;
      })
      // Create area
      .addCase(createParkingArea.fulfilled, (state, action) => {
        state.areas.push(action.payload);
      })
      // Update area
      .addCase(updateParkingArea.fulfilled, (state, action) => {
        const index = state.areas.findIndex(area => area.id === action.payload.id);
        if (index !== -1) {
          state.areas[index] = action.payload;
        }
      })
      // Delete area
      .addCase(deleteParkingArea.fulfilled, (state, action) => {
        state.areas = state.areas.filter(area => area.id !== action.payload);
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