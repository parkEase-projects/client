import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './store';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import ParkingSlots from './pages/ParkingSlots';
import ViewBookings from './pages/ViewBookings';
import CreateMap from './pages/CreateMap';
import ViewMaps from './pages/ViewMaps';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// AppContent component to use useLocation hook
function AppContent() {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/register', '/forgot-password'];
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <div className="App">
      <Navbar />
      <main style={{ minHeight: shouldShowFooter ? 'calc(100vh - 64px - 200px)' : 'calc(100vh - 64px)', padding: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/booking" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/create-map" element={<ProtectedRoute><CreateMap /></ProtectedRoute>} />
          <Route path="/view-maps" element={<ProtectedRoute><ViewMaps /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/slots" element={<ParkingSlots />} />
          <Route path="/view-bookings" element={<ProtectedRoute><ViewBookings /></ProtectedRoute>} />
          
          {/* Footer Pages - Public */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 