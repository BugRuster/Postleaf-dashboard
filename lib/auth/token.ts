/**
 * Token Management Utilities
 * Handles JWT token storage and retrieval using localStorage
 */

import type { User } from '@/lib/api/auth';

const TOKEN_KEY = 'admin_dashboard_token';
const USER_KEY = 'admin_dashboard_user';

/**
 * Retrieves the JWT token from localStorage
 * @returns The stored token or null if not found
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Stores the JWT token in localStorage
 * @param token - The JWT token to store
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the JWT token from localStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Checks if the user is authenticated by verifying token existence
 * @returns True if a token exists, false otherwise
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Stores user data in localStorage
 * @param user - The user data to store
 */
export function setUser(user: User): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Retrieves user data from localStorage
 * @returns The stored user data or null if not found
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) {
    return null;
  }
  
  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
}

/**
 * Checks if the admin status has expired
 * @returns True if admin status is expired, false otherwise
 */
export function isAdminExpired(): boolean {
  const user = getUser();
  
  if (!user || !user.adminExpiryTime) {
    return false;
  }
  
  const expiryTime = new Date(user.adminExpiryTime);
  const currentTime = new Date();
  
  return currentTime >= expiryTime;
}

/**
 * Logs out the user by removing token and user data
 * Redirects to login page if redirect parameter is true
 * @param redirect - Whether to redirect to login page (default: false)
 */
export function logout(redirect: boolean = false): void {
  removeToken();
  
  if (redirect && typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
