import React, { useState, useRef } from 'react';
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
  CircularProgress,
  IconButton,
  Badge
} from '@mui/material';
import { Person, Edit, Delete, PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import { logout, updateProfile } from '../store/slices/authSlice';

const API_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/user/profile/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${token}`
        }
      });
      dispatch(updateProfile({ ...user, profile_image: response.data.profile_image }));
      setSuccess('Profile image updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/api/user/profile`, {
        username: user.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password || undefined
      });
      setSuccess('Profile updated successfully');
      dispatch(updateProfile(response.data));
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
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 32,
                  height: 32
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <PhotoCamera sx={{ color: 'white', fontSize: 20 }} />
              </IconButton>
            }
          >
            <Avatar
              src={user?.profile_image ? `${API_URL}${user.profile_image}` : undefined}
              sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}
            >
              {!user?.profile_image && <Person sx={{ fontSize: 40 }} />}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user?.username}
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
          {isEditing && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            </>
          )}
        </Grid>

        <Box mt={4} display="flex" justifyContent="space-between">
          <Box>
            {!isEditing ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  disabled={loading}
                  sx={{ mr: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 