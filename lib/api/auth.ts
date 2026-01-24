/**
 * Authentication API Functions
 * Handles login and authentication-related API calls
 */

import apiClient from "./client";

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
  password?: string | undefined;
  profile_picture: string;
  bio: string;
  firebaseUid?: string;
  credentialsAuth: boolean;
  googleAuth: boolean;
  appleAuth: boolean;
  isVerified: boolean;
  blueTick: boolean;
  goldenTick: boolean;
  premium: boolean;
  isAdmin: boolean;
  isPrivate: boolean;
  role: "user" | "admin" | "super_admin";
  adminValidity?: number;
  adminExpiryTime?: Date;
  allocated_credits: number;
  available_credits: number;
  createdAt: Date;
  updatedAt: Date;
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
    role: "admin" | "super_admin";
  };
}

/**
 * Authenticates a user with email/username and password
 * @param credentials - Login credentials (email or username with password)
 * @returns Promise with login response containing token and user data
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials,
  );
  return response.data;
}
