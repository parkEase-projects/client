import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { Person, Edit, Delete, Lock } from '@mui/icons-material';
import axios from 'axios';
import { logout, updateProfile } from '../store/slices/authSlice';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import { validateEmail, validatePhone, validatePassword, validatePasswordMatch } from '../utils/validation';

const API_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async () => {
    const passwordError = validatePassword(passwordData.newPassword);
    const confirmPasswordError = validatePasswordMatch(passwordData.newPassword, passwordData.confirmPassword);

    if (passwordError || confirmPasswordError) {
      setError(passwordError || confirmPasswordError);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axios.put(`${API_URL}/api/auth/profile/update`, {
        username: user.username,
        password: passwordData.newPassword
      });
      setSuccess('Password updated successfully');
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phoneNumber);

    if (emailError || phoneError) {
      setError(emailError || phoneError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile/update`, {
        username: user.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      });
      setSuccess('Profile updated successfully');
      dispatch(updateProfile(response.data.user));
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/auth/profile/delete`, {
        data: { username: user.username }
      });
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account');
      setShowDeleteDialog(false);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}>
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user?.username}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.role}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

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

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              value={user?.username}
              disabled
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Box mt={4} display="flex" justifyContent="space-between">
          <Box>
            {!isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{ mr: 2 }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Lock />}
                  onClick={() => setShowPasswordDialog(true)}
                >
                  Change Password
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  disabled={loading}
                  sx={{ mr: 2 }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      email: user?.email || '',
                      phoneNumber: user?.phoneNumber || ''
                    });
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      <ChangePasswordDialog
        open={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }}
        onChange={handlePasswordChange}
        onSubmit={handlePasswordUpdate}
        data={passwordData}
        loading={loading}
        error={error}
      />
    </Container>
  );
};

export default Profile;
