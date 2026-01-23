/**
 * User Management API Functions
 * Handles user-related API calls including search and tick management
 */

import apiClient from './client';

/**
 * Tick type - blue or golden verification badge
 */
export type TickType = 'blue' | 'golden';

/**
 * User data structure from API
 */
export interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  blueTick: boolean;
  goldenTick: boolean;
  profile_picture?: string;
  bio?: string;
  isVerified?: boolean;
  premium?: boolean;
  isPrivate?: boolean;
}

/**
 * Paginated users response
 */
export interface PaginatedUsersResponse {
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

/**
 * User search response structure
 */
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

/**
 * Update tick request
 */
export interface UpdateTickRequest {
  tick: TickType | null;
}

/**
 * Fetches all users with pagination
 * @param cursor - Optional cursor for pagination
 * @param limit - Number of users per page (default 20)
 * @returns Promise with paginated users
 */
export async function getAllUsers(cursor?: string, limit: number = 20): Promise<PaginatedUsersResponse> {
  const params: Record<string, any> = { limit };
  if (cursor) {
    params.cursor = cursor;
  }
  const response = await apiClient.get<PaginatedUsersResponse>('/user', { params });
  return response.data;
}

/**
 * Searches for users by username
 * @param query - The search query (username)
 * @returns Promise with search results
 */
export async function searchUsers(query: string): Promise<UserSearchResponse> {
  const response = await apiClient.get<UserSearchResponse>(`/search?q=${encodeURIComponent(query)}&type=user`);
  return response.data;
}

/**
 * Updates a user's tick status (super_admin only)
 * @param userId - The ID of the user
 * @param data - The tick update data (tick type or null to remove)
 * @returns Promise with updated user data
 */
export async function updateUserTick(userId: string, data: UpdateTickRequest): Promise<User> {
  const response = await apiClient.put<User>(`/d/users/${userId}/tick`, data);
  return response.data;
}
