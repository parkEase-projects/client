import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert
} from '@mui/material';
import PasswordField from './PasswordField';
import { validatePassword, validatePasswordMatch } from '../utils/validation';

const ChangePasswordDialog = ({
  open,
  onClose,
  onChange,
  onSubmit,
  data,
  loading,
  error
}) => {
  const [formErrors, setFormErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e);

    // Validate fields while typing
    if (name === 'newPassword') {
      setFormErrors(prev => ({
        ...prev,
        newPassword: validatePassword(value),
        confirmPassword: data.confirmPassword ? validatePasswordMatch(value, data.confirmPassword) : ''
      }));
    } else if (name === 'confirmPassword') {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: validatePasswordMatch(data.newPassword, value)
      }));
    }
  };

  const handleSubmit = () => {
    const newPasswordError = validatePassword(data.newPassword);
    const confirmPasswordError = validatePasswordMatch(data.newPassword, data.confirmPassword);

    if (newPasswordError || confirmPasswordError) {
      setFormErrors({
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }

    onSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" sx={{ mt: 2 }}>
          <PasswordField
            fullWidth
            label="Current Password"
            name="currentPassword"
            value={data.currentPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!formErrors.currentPassword}
            helperText={formErrors.currentPassword}
          />
          <PasswordField
            fullWidth
            label="New Password"
            name="newPassword"
            value={data.newPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!formErrors.newPassword}
            helperText={formErrors.newPassword}
          />
          <PasswordField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !!formErrors.newPassword || !!formErrors.confirmPassword}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog; 