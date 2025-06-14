import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SecurityManagement = () => {
  const [securityStaff, setSecurityStaff] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSecurity, setNewSecurity] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: ''
  });
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchSecurityStaff();
  }, []);

  const fetchSecurityStaff = async () => {
    try {
      const response = await axios.get('/api/auth/security-staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSecurityStaff(response.data);
    } catch (error) {
      console.error('Error fetching security staff:', error);
    }
  };

  const handleAddSecurity = async () => {
    try {
      await axios.post('/api/auth/add-security', newSecurity, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenDialog(false);
      fetchSecurityStaff();
      setNewSecurity({ username: '', email: '', phone_number: '', password: '' });
    } catch (error) {
      console.error('Error adding security staff:', error);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/auth/toggle-security/${id}`, 
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSecurityStaff();
    } catch (error) {
      console.error('Error toggling security status:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Security Staff Management
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 3 }}
      >
        Add New Security Staff
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {securityStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.username}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone_number}</TableCell>
                <TableCell>{staff.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color={staff.is_active ? 'error' : 'success'}
                    onClick={() => handleToggleActive(staff.id, staff.is_active)}
                  >
                    {staff.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
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
            value={newSecurity.username}
            onChange={(e) => setNewSecurity({ ...newSecurity, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newSecurity.email}
            onChange={(e) => setNewSecurity({ ...newSecurity, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newSecurity.phone_number}
            onChange={(e) => setNewSecurity({ ...newSecurity, phone_number: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newSecurity.password}
            onChange={(e) => setNewSecurity({ ...newSecurity, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSecurity} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SecurityManagement; 