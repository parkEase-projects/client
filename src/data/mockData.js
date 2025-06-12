// Mock data for parking areas and slots
export const parkingAreas = [
    {
        id: 1,
        name: 'Main Entrance',
        totalSlots: 20,
        description: 'Near the main building entrance',
        status: 'active',
        available_slots: 18
    },
    {
        id: 2,
        name: 'Side Parking',
        totalSlots: 20,
        description: 'Next to the side entrance',
        status: 'active',
        available_slots: 16
    }
];

// Generate parking slots for each area
let parkingSlots = [];

// Initialize slots with default data
const initializeDefaultSlots = () => {
    parkingSlots = [];
    // Generate slots for each area with some random statuses
    parkingAreas.forEach(area => {
        for (let i = 1; i <= area.totalSlots; i++) {
            const randomStatus = Math.random() < 0.2 ? 'booked' : 'available';
            parkingSlots.push({
                id: parkingSlots.length + 1,
                slotNumber: i,
                areaId: area.id,
                status: randomStatus
            });
        }
    });
    // Store in localStorage
    localStorage.setItem('parkingSlots', JSON.stringify(parkingSlots));
};

// Helper function to get slots for a specific area
export const getSlotsByArea = (areaId) => {
    // Try to get slots from localStorage first
    const storedSlots = localStorage.getItem('parkingSlots');
    if (storedSlots) {
        const allSlots = JSON.parse(storedSlots);
        return allSlots.filter(slot => slot.areaId === parseInt(areaId));
    }
    // If no stored slots, initialize and return
    initializeDefaultSlots();
    return parkingSlots.filter(slot => slot.areaId === parseInt(areaId));
};

// Helper function to get area by ID
export const getAreaById = (areaId) => {
    return parkingAreas.find(area => area.id === parseInt(areaId));
};

// Helper function to update slot status
export const updateSlotStatus = (slotId, newStatus) => {
    const storedSlots = localStorage.getItem('parkingSlots');
    let allSlots = storedSlots ? JSON.parse(storedSlots) : parkingSlots;
    
    allSlots = allSlots.map(slot => 
        slot.id === slotId ? { ...slot, status: newStatus } : slot
    );
    
    localStorage.setItem('parkingSlots', JSON.stringify(allSlots));
    return allSlots.find(s => s.id === slotId);
};

// Calculate booking amount (₹50 per hour)
export const calculateBookingAmount = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    return hours * 50;
};

// Get all bookings
export const getBookings = () => {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
};

// Get booking by ID
export const getBookingById = (bookingId) => {
    const bookings = getBookings();
    return bookings.find(booking => booking.id === bookingId);
};

// Mock user data
export const currentUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
};

// Mock bookings data
export const bookings = [
    {
        id: 1,
        userId: 1,
        slotId: 1,
        areaId: 1,
        startTime: '2024-03-20T10:00:00',
        endTime: '2024-03-20T12:00:00',
        status: 'active',
        vehicleNumber: 'ABC123'
    },
    {
        id: 2,
        userId: 1,
        slotId: 5,
        areaId: 1,
        startTime: '2024-03-21T14:00:00',
        endTime: '2024-03-21T16:00:00',
        status: 'upcoming',
        vehicleNumber: 'XYZ789'
    }
];

// Get user's bookings
export const getUserBookings = (userId) => {
    const allBookings = getBookings();
    return allBookings.filter(booking => booking.userId === userId);
};

// Get available slots in an area
export const getAvailableSlots = (areaId) => {
    return parkingSlots.filter(slot => 
        slot.areaId === parseInt(areaId) && 
        slot.status === 'available'
    );
};

// Function to create a new booking
export const createBooking = (bookingData) => {
    const existingBookings = getBookings();
    const newBooking = {
        id: Date.now(),
        ...bookingData,
        status: 'upcoming'
    };
    existingBookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));
    updateSlotStatus(bookingData.slotId, 'booked');
    return newBooking;
};

// Initialize slots when the module loads
initializeDefaultSlots(); 