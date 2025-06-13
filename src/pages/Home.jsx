import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import VideocamIcon from "@mui/icons-material/Videocam";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useNavigate } from "react-router-dom";
import { fetchParkingAreas } from "../store/slices/parkingSlice";
import { format } from "date-fns";

import ParkingLive from "../components/ParkingLive";
import SlotsCarousel from "../components/SlotsCarousel";
import ParkingAnnotator from "../components/ParkingAnnotator";

const Home = () => {
  const dispatch = useDispatch();
  const { areas, loading, error } = useSelector((state) => state.parking);
  const user = useSelector((state) => state.auth.user);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchParkingAreas());
  }, [dispatch]);

  const handleSearch = () => {
    if (selectedArea && selectedDate && selectedTime) {
      const selectedAreaObj = areas.find(
        (a) => a.id === parseInt(selectedArea)
      );

      const formattedDate = format(new Date(selectedDate), "MMMM dd, yyyy");

      const [hours, minutes] = selectedTime.split(":");
      const timeDate = new Date();
      timeDate.setHours(parseInt(hours), parseInt(minutes));
      const formattedTime = format(timeDate, "h:mm a");

      const params = new URLSearchParams({
        area: selectedAreaObj?.name || "",
        date: selectedDate,
        time: selectedTime,
      }).toString();

      navigate(`/slots?${params}`, {
        state: {
          areaName: selectedAreaObj?.name,
          areaId: selectedArea,
          date: formattedDate,
          time: formattedTime,
          rawDate: selectedDate,
          rawTime: selectedTime,
        },
      });
    } else {
      alert("Please select parking area, date, and time.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-4">
      {/* Role-based action buttons */}
      {(user?.role === 'admin' || user?.role === 'security') && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<VideocamIcon />}
              onClick={() => navigate('/camera-view')}
            >
              Camera Views
            </Button>
            
            {user?.role === 'admin' && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SecurityIcon />}
                  onClick={() => navigate('/security-management')}
                >
                  Manage Security Staff
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<AssessmentIcon />}
                  onClick={() => navigate('/reports')}
                >
                  View Reports
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      )}

      {/* Regular parker report button */}
      {user?.role === 'parker' && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="info"
              startIcon={<AssessmentIcon />}
              onClick={() => navigate('/reports')}
            >
              My Reports
            </Button>
          </Stack>
        </Paper>
      )}

      <h2 className="text-center mb-4">Parking Area Maps</h2>
      <SlotsCarousel/>

      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <h3 className="mb-4">Filter Parking Availability</h3>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <label style={{ display: "block", marginBottom: 8 }}>
                Parking Area
              </label>
              {loading ? (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  size="small"
                >
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name} ({area.available_slots} slots available)
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <label style={{ display: "block", marginBottom: 8 }}>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            />
          </Grid>
          <Grid item xs={10} md={3}>
            <label style={{ display: "block", marginBottom: 8 }}>Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            />
          </Grid>
          <Grid
            item
            xs={2}
            md={1}
            sx={{
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
            }}
          >
            <IconButton
              color="primary"
              onClick={handleSearch}
              sx={{ mt: 3 }}
              disabled={
                loading || !selectedArea || !selectedDate || !selectedTime
              }
            >
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Home;
