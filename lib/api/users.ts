/**
 * User Management API Functions
 * Handles user-related API calls including search and tick management
 */

import apiClient from "./client";

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
}

export interface PaginatedResponse {
  status: string;
  data: {
    users: User[];
    meta: {
      limit: number;
      hasMore: boolean;
      cursor: string;
    };
  };
}

export interface UserSearchResponse {
  status: string;
  message: string;
  results: User[];
  searchType: string;
  pagination: {
    currentPage: number;
    limit: number;
    totalResults: number;
  };
}

export async function getAllUsers(
  cursor?: string,
  limit: number = 20,
): Promise<PaginatedResponse> {
  const params: Record<string, any> = { limit };
  if (cursor) {
    params.cursor = cursor;
  }
  const response = await apiClient.get<PaginatedResponse>("/user", { params });
  return response.data;
}

export async function searchUsers(query: string): Promise<UserSearchResponse> {
  const response = await apiClient.get<UserSearchResponse>(
    `/search?q=${encodeURIComponent(query)}&type=user`,
  );
  return response.data;
}

export interface GetUsersWithTicksResponse {
  status: string;
  message: string;
  data: User[];
  pagination: { page: number; limit: number };
}

export type TickTypeFilter = "blue" | "golden" | "both";

/**
 * Get users with blue or golden ticks.
 * GET /d/users/ticks?page=1&limit=20&tickType=blue|golden|both
 */
export async function getUsersWithTicks(
  page: number = 1,
  limit: number = 20,
  tickType: TickTypeFilter = "both",
): Promise<GetUsersWithTicksResponse> {
  const response = await apiClient.get<GetUsersWithTicksResponse>(
    "/d/users/ticks",
    { params: { page, limit, tickType } },
  );
  return response.data;
}

export async function updateUserTick(
  userId: string,
  blueTick?: boolean,
  goldenTick?: boolean,
): Promise<User> {
  const response = await apiClient.put<User>(`/d/users/${userId}/tick`, {
    blueTick,
    goldenTick,
  });
  return response.data;
}
