import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const SecurityManagement = () => {
  const user = useSelector(state => state.auth.user);
  const [securityStaff, setSecurityStaff] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newStaff, setNewStaff] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSecurityStaff();
    }
  }, [user]);

  const fetchSecurityStaff = async () => {
    try {
      const response = await axios.get('/api/auth/security-staff');
      setSecurityStaff(response.data);
    } catch (error) {
      setError('Failed to fetch security staff');
    }
  };

  const handleAddStaff = async () => {
    try {
      await axios.post('/api/auth/security-staff', {
        ...newStaff,
        role: 'security'
      });
      setSuccess('Security staff added successfully');
      setOpenDialog(false);
      setNewStaff({
        username: '',
        email: '',
        phone_number: '',
        password: '',
      });
      fetchSecurityStaff();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add security staff');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to remove this security staff member?')) {
      try {
        await axios.delete(`/api/auth/security-staff/${staffId}`);
        setSuccess('Security staff removed successfully');
        fetchSecurityStaff();
      } catch (error) {
        setError('Failed to remove security staff');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          You don't have permission to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Security Staff Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Security Staff
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {securityStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.username}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone_number}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteStaff(staff.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Security Staff</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            value={newStaff.username}
            onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newStaff.email}
            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newStaff.phone_number}
            onChange={(e) => setNewStaff({ ...newStaff, phone_number: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newStaff.password}
            onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddStaff} variant="contained" color="primary">
            Add Staff
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SecurityManagement; 