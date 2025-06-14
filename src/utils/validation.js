// Validation regex patterns
export const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  PHONE: /^\d{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Validation error messages
export const ERROR_MESSAGES = {
  EMAIL: {
    INVALID: 'Please enter a valid email address',
    REQUIRED: 'Email is required'
  },
  PHONE: {
    INVALID: 'Phone number must be exactly 10 digits',
    REQUIRED: 'Phone number is required'
  },
  PASSWORD: {
    INVALID: 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    REQUIRED: 'Password is required',
    MATCH: 'Passwords do not match'
  }
};

// Validation functions
export const validateEmail = (email) => {
  if (!email) return ERROR_MESSAGES.EMAIL.REQUIRED;
  if (!PATTERNS.EMAIL.test(email)) return ERROR_MESSAGES.EMAIL.INVALID;
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return ERROR_MESSAGES.PHONE.REQUIRED;
  if (!PATTERNS.PHONE.test(phone)) return ERROR_MESSAGES.PHONE.INVALID;
  return '';
};

export const validatePassword = (password) => {
  if (!password) return ERROR_MESSAGES.PASSWORD.REQUIRED;
  if (!PATTERNS.PASSWORD.test(password)) return ERROR_MESSAGES.PASSWORD.INVALID;
  return '';
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return ERROR_MESSAGES.PASSWORD.REQUIRED;
  if (password !== confirmPassword) return ERROR_MESSAGES.PASSWORD.MATCH;
  return '';
};

export function validateUsername(username) {
  if (!username || username.trim() === '') {
    return 'Username is required';
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  return '';
}

// Form validation helper
export const validateForm = (formData, fields) => {
  const errors = {};
  
  fields.forEach(field => {
    switch (field) {
      case 'email':
        errors.email = validateEmail(formData.email);
        break;
      case 'phone':
        errors.phone = validatePhone(formData.phoneNumber);
        break;
      case 'password':
        errors.password = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        errors.confirmPassword = validatePasswordMatch(formData.password, formData.confirmPassword);
        break;
      default:
        break;
    }
  });

  return {
    isValid: !Object.values(errors).some(error => error),
    errors
  };
}; 