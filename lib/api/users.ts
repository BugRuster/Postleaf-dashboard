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
 * User data structure
 */
export interface User {
  id: string;
  username: string;
  email: string;
  tick: TickType | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * User search response structure
 */
export interface UserSearchResponse {
  users: User[];
  total: number;
}

/**
 * Update tick request
 */
export interface UpdateTickRequest {
  tick: TickType | null;
}

/**
 * Searches for users by username or email (super_admin only)
 * @param query - The search query (username or email)
 * @returns Promise with search results
 */
export async function searchUsers(query: string): Promise<UserSearchResponse> {
  const response = await apiClient.get<UserSearchResponse>('/d/users/search', {
    params: { q: query },
  });
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
