import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon, DirectionsCar } from '@mui/icons-material';
import { fetchParkingAreas } from '../store/slices/parkingSlice';

const ParkingAreas = () => {
  const dispatch = useDispatch();
  const { areas, loading, error } = useSelector((state) => state.parking);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [newArea, setNewArea] = useState({
    name: '',
    total_slots: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchParkingAreas());
  }, [dispatch]);

  const handleCreateArea = async () => {
    // TODO: Implement area creation
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Parking Areas
          </Typography>
          {user?.role === 'admin' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Parking Area
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {areas.map((area) => (
              <Grid item xs={12} md={4} key={area.id}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      p: 1,
                      bgcolor: area.status === 'active' ? 'success.main' : 'warning.main',
                      color: 'white',
                      borderBottomLeftRadius: 8,
                    }}
                  >
                    {area.status}
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <DirectionsCar sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">
                      {area.name}
                    </Typography>
                  </Box>

                  <Typography color="textSecondary" paragraph>
                    {area.description}
                  </Typography>

                  <Box mt="auto" pt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper
                          sx={{
                            p: 1,
                            textAlign: 'center',
                            bgcolor: 'primary.light',
                            color: 'white',
                          }}
                        >
                          <Typography variant="body2">Total Slots</Typography>
                          <Typography variant="h6">{area.total_slots}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper
                          sx={{
                            p: 1,
                            textAlign: 'center',
                            bgcolor: 'success.light',
                            color: 'white',
                          }}
                        >
                          <Typography variant="body2">Available</Typography>
                          <Typography variant="h6">{area.available_slots}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Add Parking Area Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Parking Area</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Area Name"
              value={newArea.name}
              onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Total Slots"
              type="number"
              value={newArea.total_slots}
              onChange={(e) => setNewArea({ ...newArea, total_slots: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newArea.description}
              onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateArea}
            disabled={!newArea.name || !newArea.total_slots}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ParkingAreas; 