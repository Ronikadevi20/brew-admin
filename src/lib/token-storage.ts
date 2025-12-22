/**
 * Token Storage Utility
 * 
 * Handles secure storage of authentication tokens.
 * 
 * Security implementation:
 * - Access tokens: Stored in memory (protection against XSS)
 * - Refresh tokens: Stored in secure cookies (persistence + security)
 * 
 * Cookie security features:
 * - Secure flag: Only transmitted over HTTPS (in production)
 * - SameSite=Strict: Protection against CSRF attacks
 * - Path=/: Accessible across the application
 * 
 * Note: For maximum security, consider having your backend set 
 * httpOnly cookies directly in the response headers, which prevents
 * JavaScript access entirely.
 */

import { TOKEN_KEYS } from '@/config/api.config';
import { cookies } from './cookies';

// In-memory storage for access token (cleared on page refresh)
// This is intentional - access tokens should be short-lived
let accessToken: string | null = null;

// Default cookie expiry: 7 days (should match your refresh token expiry)
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

/**
 * Calculate cookie expiry date
 */
function getRefreshTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  return expiry;
}

/**
 * Token storage interface for consistent access patterns
 */
export const tokenStorage = {
  /**
   * Get the access token from memory
   */
  getAccessToken: (): string | null => {
    return accessToken;
  },

  /**
   * Set the access token in memory
   */
  setAccessToken: (token: string): void => {
    accessToken = token;
  },

  /**
   * Clear the access token from memory
   */
  clearAccessToken: (): void => {
    accessToken = null;
  },

  /**
   * Get the refresh token from cookie
   */
  getRefreshToken: (): string | null => {
    return cookies.get(TOKEN_KEYS.REFRESH_TOKEN);
  },

  /**
   * Set the refresh token in a secure cookie
   */
  setRefreshToken: (token: string): void => {
    cookies.set(TOKEN_KEYS.REFRESH_TOKEN, token, {
      expires: getRefreshTokenExpiry(),
      // secure and sameSite are set by default in cookies utility
    });
  },

  /**
   * Clear the refresh token cookie
   */
  clearRefreshToken: (): void => {
    cookies.delete(TOKEN_KEYS.REFRESH_TOKEN);
  },

  /**
   * Clear all tokens (both memory and cookies)
   */
  clearAllTokens: (): void => {
    tokenStorage.clearAccessToken();
    tokenStorage.clearRefreshToken();
  },

  /**
   * Check if user has a valid session (refresh token exists)
   */
  hasSession: (): boolean => {
    return cookies.has(TOKEN_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get token expiry configuration (useful for debugging)
   */
  getConfig: () => ({
    refreshTokenExpiryDays: REFRESH_TOKEN_EXPIRY_DAYS,
    accessTokenStorage: 'memory',
    refreshTokenStorage: 'cookie',
  }),
};

export default tokenStorage;