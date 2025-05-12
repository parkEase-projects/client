// Mock data for parking areas and slots
export const parkingAreas = [
    {
        id: 1,
        name: 'Main Entrance',
        totalSlots: 10,
        description: 'Near the main building entrance',
        status: 'active'
    },
    {
        id: 2,
        name: 'Side Parking',
        totalSlots: 10,
        description: 'Next to the side entrance',
        status: 'active'
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
                status: randomStatus,
                user: randomStatus === 'booked' ? 'User' + Math.floor(Math.random() * 100) : null
            });
        }
    });
};

// Helper function to get slots for a specific area
export const getSlotsByArea = (areaId) => {
    console.log('Getting slots for area:', areaId); // Debug log
    console.log('Current parkingSlots:', parkingSlots); // Debug log
    return parkingSlots.filter(slot => slot.areaId === parseInt(areaId));
};

// Helper function to get area by ID
export const getAreaById = (areaId) => {
    return parkingAreas.find(area => area.id === parseInt(areaId));
};

// Helper function to update slot status
export const updateSlotStatus = (slotId, newStatus) => {
    const slotIndex = parkingSlots.findIndex(s => s.id === slotId);
    if (slotIndex !== -1) {
        parkingSlots[slotIndex].status = newStatus;
        // Update localStorage
        localStorage.setItem('parkingSlots', JSON.stringify(parkingSlots));
    }
    return parkingSlots[slotIndex];
};

// Helper function to get available slots in an area
export const getAvailableSlots = (areaId) => {
    return parkingSlots.filter(slot => 
        slot.areaId === parseInt(areaId) && 
        slot.status === 'available'
    );
};

// Function to create a new booking
export const createBooking = (bookingData) => {
    const newBooking = {
        id: bookings.length + 1,
        ...bookingData,
        status: 'upcoming'
    };
    
    // Add to bookings array
    bookings.push(newBooking);
    
    // Update slot status
    updateSlotStatus(bookingData.slotId, 'booked');
    
    return newBooking;
};

// Function to get user's bookings
export const getUserBookings = (userId) => {
    return bookings.filter(booking => booking.userId === userId);
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

// Calculate booking amount (₹50 per hour)
export const calculateBookingAmount = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    return hours * 50;
};

// Initialize slots from localStorage or default to initial state
export const initializeSlots = () => {
    const storedSlots = localStorage.getItem('parkingSlots');
    if (storedSlots) {
        parkingSlots = JSON.parse(storedSlots);
    } else {
        initializeDefaultSlots();
        localStorage.setItem('parkingSlots', JSON.stringify(parkingSlots));
    }
    console.log('Initialized slots:', parkingSlots); // Debug log
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

// Initialize the slots when the module loads
initializeSlots(); 