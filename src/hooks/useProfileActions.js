import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateProfile, logout } from '../store/slices/authSlice';

const API_URL = process.env.REACT_APP_API_URL;

export default function useProfileActions(user) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Update profile
  const updateProfileAction = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile/update`, {
        username: user.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      });
      dispatch(updateProfile(response.data.user));
      setLoading(false);
      return { success: true, data: response.data.user };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Failed to update profile' };
    }
  };

  // Update password
  const updatePasswordAction = async (newPassword) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/auth/profile/update`, {
        username: user.username,
        password: newPassword
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Failed to update password' };
    }
  };

  // Delete account
  const deleteAccountAction = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/auth/profile/delete`, {
        data: { username: user.username }
      });
      dispatch(logout());
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Failed to delete account' };
    }
  };

  return {
    loading,
    updateProfileAction,
    updatePasswordAction,
    deleteAccountAction
  };
} 