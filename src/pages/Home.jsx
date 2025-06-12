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
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { fetchParkingAreas } from "../store/slices/parkingSlice";
import { format, addDays } from "date-fns";

import ParkingLive from "../components/ParkingLive";
import SlotsCarousel from "../components/SlotsCarousel";
import ParkingAnnotator from "../components/ParkingAnnotator";
import ParkingAreaList from "../components/ParkingAreaList";

const Home = () => {
  const dispatch = useDispatch();
  const { areas, loading, error } = useSelector((state) => state.parking);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
  return new Date().toISOString().split("T")[0];
  });
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
  const maxDate = addDays(new Date(), 7).toISOString().split('T')[0];

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const maxAllowedDate = addDays(new Date(), 7);
    
    if (selectedDate <= maxAllowedDate) {
      setSelectedDate(e.target.value);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Parking Area Maps</h2>
      <SlotsCarousel/>      

      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <h3 className="mb-4">Filter Parking Availability</h3>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
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
                  sx={{
                    height: "41px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc"
                    }
                  }}
                >
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name} 
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
              onChange={handleDateChange}
              min={today}
              max={maxDate}
              style={{
                width: "100%",
                height: "41px",
                padding: "8px 14px",
                borderRadius: 4,
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "#fff"
              }}
            />
            <Box sx={{ minHeight: '20px', mt: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                You can only book up to 7 days in advance
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={10} md={3}>
            <label style={{ display: "block", marginBottom: 8 }}>Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              style={{
                width: "100%",
                height: "41px",
                padding: "8px 14px",
                borderRadius: 4,
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "#fff"
              }}
            />
          </Grid>
          <Grid
            item
            xs={2}
            md={1}
            
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
