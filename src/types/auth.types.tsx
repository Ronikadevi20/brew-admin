/**
 * Authentication Types
 * 
 * Type definitions for authentication-related data structures.
 */

// User data returned from API
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'CAFE_ADMIN' | 'ADMIN';
  membershipType: 'FREE' | 'PREMIUM';
  hasCompletedOnboarding: boolean;
  profileImageUrl?: string | null;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Token pair structure
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response from API
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: TokenPair;
  };
  timestamp: string;
}

// Register request payload
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Register response from API
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: TokenPair;
  };
  timestamp: string;
}

// Forgot password request payload
export interface ForgotPasswordRequest {
  email: string;
}

// Forgot password response
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

// Reset password request payload
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Reset password response
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

// Verify email request payload
export interface VerifyEmailRequest {
  token: string;
}

// Verify email response
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

// Change password request payload
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Change password response
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh token response
export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    tokens: TokenPair;
  };
  timestamp: string;
}

// Get current user response
export interface GetMeResponse {
  success: boolean;
  message: string;
  data: User;
  timestamp: string;
}

// Generic API error response
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

// Auth context state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

// Auth context actions
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
}