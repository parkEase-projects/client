import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-bootstrap";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { fetchParkingAreas } from "../store/slices/parkingSlice";
import { format } from "date-fns";

import ParkingLive from "../components/ParkingLive";

const Home = () => {
  const dispatch = useDispatch();
  const { areas, loading, error } = useSelector((state) => state.parking);
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
      <h2 className="text-center mb-4">Parking Area Maps</h2>
      <ParkingLive />
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://parking.ecu.edu/wp-content/pv-uploads/sites/379/2020/08/D-Zone-Parking-768x525.jpg"
            alt="Parking Area Map 1"
            style={{ height: "600px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Overall Map</h3>
            <p>All parking areas</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://thumbs.dreamstime.com/b/car-parking-lot-road-markings-numbering-spaces-empty-pedestrian-crossing-top-view-d-render-153672294.jpg"
            alt="Parking Area Map 2"
            style={{ height: "600px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Level 1 Parking</h3>
            <p>Upper level parking area</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://thumbs.dreamstime.com/b/car-parking-lot-road-markings-numbering-spaces-empty-pedestrian-crossing-top-view-d-render-153672294.jpg"
            alt="Parking Area Map 3"
            style={{ height: "600px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Level 2 Parking</h3>
            <p>Basement parking area</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

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
