/**
 * Form Validation Utilities
 * 
 * Client-side validation matching backend rules.
 * Provides real-time validation feedback.
 */

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Password strength levels
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

/**
 * Username validation
 * - 3-20 characters
 * - Only letters, numbers, and underscores
 */
export const validateUsername = (username: string): ValidationResult => {
  const trimmed = username.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Username is required' };
  }
  
  if (trimmed.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' };
  }
  
  if (trimmed.length > 20) {
    return { isValid: false, message: 'Username must be at most 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Email is required' };
  }
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Password validation
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('one number');
  }
  
  if (errors.length > 0) {
    return {
      isValid: false,
      message: `Password must contain ${errors.join(', ')}`,
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Calculate password strength
 */
export const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const feedback: string[] = [];
  
  if (!checks.minLength) {
    feedback.push('Add more characters (min 8)');
  }
  if (!checks.hasUppercase) {
    feedback.push('Add an uppercase letter');
  }
  if (!checks.hasLowercase) {
    feedback.push('Add a lowercase letter');
  }
  if (!checks.hasNumber) {
    feedback.push('Add a number');
  }
  if (!checks.hasSpecial) {
    feedback.push('Add a special character for extra security');
  }
  
  // Calculate score (0-4)
  let score = 0;
  if (checks.minLength) score++;
  if (checks.hasUppercase && checks.hasLowercase) score++;
  if (checks.hasNumber) score++;
  if (checks.hasSpecial) score++;
  
  // Bonus for length
  if (password.length >= 12) score = Math.min(4, score + 0.5);
  if (password.length >= 16) score = Math.min(4, score + 0.5);
  
  // Determine strength level
  let strength: PasswordStrength;
  if (score <= 1) {
    strength = 'weak';
  } else if (score <= 2) {
    strength = 'fair';
  } else if (score <= 3) {
    strength = 'good';
  } else {
    strength = 'strong';
  }
  
  return {
    strength,
    score: Math.floor(score),
    feedback,
    checks,
  };
};

/**
 * Validate entire registration form
 */
export interface RegistrationFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateRegistrationForm = (data: RegistrationFormData): RegistrationValidationResult => {
  const errors: Record<string, string> = {};
  
  const usernameResult = validateUsername(data.username);
  if (!usernameResult.isValid) {
    errors.username = usernameResult.message;
  }
  
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }
  
  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }
  
  const confirmResult = validateConfirmPassword(data.password, data.confirmPassword);
  if (!confirmResult.isValid) {
    errors.confirmPassword = confirmResult.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login form
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export const validateLoginForm = (data: LoginFormData): RegistrationValidationResult => {
  const errors: Record<string, string> = {};
  
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};