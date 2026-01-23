/**
 * Authentication API Functions
 * Handles login and authentication-related API calls
 */

import apiClient from './client';

/**
 * Login request payload with email
 */
export interface LoginRequestWithEmail {
  email: string;
  password: string;
}

/**
 * Login request payload with username
 */
export interface LoginRequestWithUsername {
  username: string;
  password: string;
}

/**
 * Combined login request type
 */
export type LoginRequest = LoginRequestWithEmail | LoginRequestWithUsername;

/**
 * User data from backend
 */
export interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
  bio: string;
  credentialsAuth: boolean;
  googleAuth: boolean;
  appleAuth: boolean;
  isVerified: boolean;
  blueTick: boolean;
  goldenTick: boolean;
  premium: boolean;
  isAdmin: boolean;
  isPrivate: boolean;
  role: 'admin' | 'super_admin';
  adminCredits: number;
  createdAt: string;
  updatedAt: string;
  notificationSettings?: {
    muteNotifications: boolean;
    pushEnabled: boolean;
  };
  encryptionKeys?: {
    oneTimePreKeys: unknown[];
  };
}

/**
 * Login response payload from backend
 */
export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
    provider: string;
    role: 'admin' | 'super_admin';
  };
}

/**
 * Authenticates a user with email/username and password
 * @param credentials - Login credentials (email or username with password)
 * @returns Promise with login response containing token and user data
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}
