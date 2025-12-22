/**
 * Cookie Utility
 * 
 * Secure cookie management for authentication tokens.
 * 
 * Security features:
 * - Secure flag (HTTPS only in production)
 * - SameSite=Strict (CSRF protection)
 * - Path restriction
 * - Optional expiry
 */

export interface CookieOptions {
  expires?: Date;
  maxAge?: number; // in seconds
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

// Check if we're in production (HTTPS)
const isProduction = import.meta.env.PROD;

// Default secure cookie options
const defaultOptions: CookieOptions = {
  path: '/',
  secure: isProduction, // Only send over HTTPS in production
  sameSite: 'Strict', // Strict CSRF protection
};

/**
 * Set a cookie with secure defaults
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const opts = { ...defaultOptions, ...options };
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.expires) {
    cookieString += `; expires=${opts.expires.toUTCString()}`;
  }

  if (opts.maxAge !== undefined) {
    cookieString += `; max-age=${opts.maxAge}`;
  }

  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }

  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`;
  }

  if (opts.secure) {
    cookieString += '; secure';
  }

  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, options: CookieOptions = {}): void {
  const opts = { ...defaultOptions, ...options };
  
  // Set expiry to past date to delete
  setCookie(name, '', {
    ...opts,
    expires: new Date(0),
    maxAge: 0,
  });
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

export const cookies = {
  set: setCookie,
  get: getCookie,
  delete: deleteCookie,
  has: hasCookie,
};

export default cookies;