import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CameraView = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedArea, setSelectedArea] = useState('all');
  const [areas, setAreas] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchParkingAreas();
    fetchCameras();
  }, []);

  const fetchParkingAreas = async () => {
    try {
      const response = await axios.get('/api/parking/areas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAreas(response.data);
    } catch (error) {
      console.error('Error fetching parking areas:', error);
    }
  };

  const fetchCameras = async () => {
    try {
      const response = await axios.get('/api/parking/cameras', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCameras(response.data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const filteredCameras = selectedArea === 'all' 
    ? cameras 
    : cameras.filter(camera => camera.area_id === selectedArea);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Security Camera Views
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Filter by Area</InputLabel>
        <Select
          value={selectedArea}
          label="Filter by Area"
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <MenuItem value="all">All Areas</MenuItem>
          {areas.map((area) => (
            <MenuItem key={area.id} value={area.id}>
              {area.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {filteredCameras.map((camera) => (
          <Grid item xs={12} md={6} key={camera.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={camera.camera_url}
                alt={camera.name}
                sx={{
                  objectFit: 'cover',
                  backgroundColor: 'black'
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {camera.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {camera.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {camera.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CameraView; 