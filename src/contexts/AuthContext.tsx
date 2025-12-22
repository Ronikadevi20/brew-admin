import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import authService from '@/services/auth.service';
import { tokenStorage } from '@/lib/token-storage';
import type { AuthContextType, AuthState, RegisterRequest } from '@/types/auth.types';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
};

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Initialize auth state on mount
   * Checks for existing session and restores it
   */
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a stored session
      if (!authService.hasSession()) {
        updateState({ isInitialized: true });
        return;
      }

      try {
        updateState({ isLoading: true });
        
        // Try to get current user with stored refresh token
        const user = await authService.getCurrentUser();
        
        updateState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      } catch (error) {
        // Session expired or invalid
        console.warn('Session restoration failed:', error);
        tokenStorage.clearAllTokens();
        updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      }
    };

    initializeAuth();
  }, [updateState]);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string) => {
    updateState({ isLoading: true });

    try {
      const { user } = await authService.login({ email, password });
      
      updateState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  }, [updateState]);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterRequest) => {
    updateState({ isLoading: true });

    try {
      const { user } = await authService.register(data);
      
      updateState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  }, [updateState]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    updateState({ isLoading: true });

    try {
      await authService.logout();
    } finally {
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [updateState]);

  /**
   * Request password reset
   */
  const forgotPassword = useCallback(async (email: string) => {
    await authService.forgotPassword({ email });
  }, []);

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(
    async (token: string, newPassword: string, confirmPassword: string) => {
      await authService.resetPassword({ token, newPassword, confirmPassword });
    },
    []
  );

  /**
   * Verify email with token
   */
  const verifyEmail = useCallback(async (token: string) => {
    await authService.verifyEmail({ token });
  }, []);

  /**
   * Change password for authenticated user
   */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string, confirmPassword: string) => {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
    },
    []
  );

  /**
   * Refresh auth state
   */
  const refreshAuth = useCallback(async () => {
    if (!authService.hasSession()) {
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      updateState({ user, isAuthenticated: true });
    } catch (error) {
      console.warn('Auth refresh failed:', error);
      tokenStorage.clearAllTokens();
      updateState({ user: null, isAuthenticated: false });
    }
  }, [updateState]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      verifyEmail,
      changePassword,
      refreshAuth,
    }),
    [
      state,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      verifyEmail,
      changePassword,
      refreshAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;