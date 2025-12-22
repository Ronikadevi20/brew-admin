import apiClient from '@/lib/api-client';
import { tokenStorage } from '@/lib/token-storage';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    GetMeResponse,
    User,
} from '@/types/auth.types';

/**
 * Authentication service object containing all auth methods
 */
export const authService = {
    /**
     * Login user with email and password
     */
    login: async (data: LoginRequest): Promise<{ user: User }> => {
        const response = await apiClient.post<LoginResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            data
        );

        const { user, tokens } = response.data.data;

        // Validate user role - only CAFE_ADMIN can access the system
        if (user.role !== 'CAFE_ADMIN') {
            // Don't store tokens for unauthorized users
            throw new Error('Access denied. Only cafe administrators can login to this system.');
        }

        // Store tokens securely
        tokenStorage.setAccessToken(tokens.accessToken);
        tokenStorage.setRefreshToken(tokens.refreshToken);

        return { user };
    },

    /**
     * Register a new user
     */
    register: async (data: RegisterRequest): Promise<{ user: User }> => {
        const response = await apiClient.post<RegisterResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            data
        );

        const { user, tokens } = response.data.data;

        // Validate user role - only CAFE_ADMIN can access the system
        if (user.role !== 'CAFE_ADMIN') {
            // Don't store tokens for unauthorized users
            throw new Error('Access denied. Only cafe administrators can access this system.');
        }

        // Store tokens securely
        tokenStorage.setAccessToken(tokens.accessToken);
        tokenStorage.setRefreshToken(tokens.refreshToken);

        return { user };
    },

    /**
     * Logout user - clears tokens and calls logout endpoint
     */
    logout: async (): Promise<void> => {
        try {
            // Call logout endpoint to invalidate tokens on server
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            // Even if logout API fails, clear local tokens
            console.error('Logout API error:', error);
        } finally {
            // Always clear tokens locally
            tokenStorage.clearAllTokens();
        }
    },

    /**
     * Request password reset email
     */
    forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
        const response = await apiClient.post<ForgotPasswordResponse>(
            API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
            data
        );
        return response.data;
    },

    /**
     * Reset password with token from email
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        const response = await apiClient.post<ResetPasswordResponse>(
            API_ENDPOINTS.AUTH.RESET_PASSWORD,
            data
        );
        return response.data;
    },

    /**
     * Verify email with token
     */
    verifyEmail: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
        const response = await apiClient.post<VerifyEmailResponse>(
            API_ENDPOINTS.AUTH.VERIFY_EMAIL,
            data
        );
        return response.data;
    },

    /**
     * Change password for authenticated user
     */
    changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
        const response = await apiClient.post<ChangePasswordResponse>(
            API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
            data
        );
        return response.data;
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async (): Promise<User> => {
        // The apiClient interceptor will automatically add the token
        // and handle token refresh if needed (401 response)
        const response = await apiClient.get<GetMeResponse>(API_ENDPOINTS.AUTH.ME);
        const user = response.data.data;

        // Validate user role - only CAFE_ADMIN can access the system
        if (user.role !== 'CAFE_ADMIN') {
            tokenStorage.clearAllTokens();
            throw new Error('Access denied. Only cafe administrators can access this system.');
        }

        return user;
    },

    /**
     * Check if user has a valid session
     */
    hasSession: (): boolean => {
        return tokenStorage.hasSession();
    },

    /**
     * Check if we have a refresh token (for session restoration)
     */
    hasRefreshToken: (): boolean => {
        return !!tokenStorage.getRefreshToken();
    },
};

export default authService;