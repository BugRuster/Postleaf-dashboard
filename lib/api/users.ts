/**
 * User Management API Functions
 * Handles user-related API calls including search and tick management
 */

import apiClient from './client';

export interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
  bio: string;
  isVerified: boolean;
  blueTick: boolean;
  goldenTick: boolean;
  premium: boolean;
  isAdmin: boolean;
  isPrivate: boolean;
  role: string;
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

export async function getAllUsers(cursor?: string, limit: number = 20): Promise<PaginatedResponse> {
  const params: Record<string, any> = { limit };
  if (cursor) {
    params.cursor = cursor;
  }
  const response = await apiClient.get<PaginatedResponse>('/user', { params });
  return response.data;
}

export async function searchUsers(query: string): Promise<UserSearchResponse> {
  const response = await apiClient.get<UserSearchResponse>(`/search?q=${encodeURIComponent(query)}&type=user`);
  return response.data;
}

export async function updateUserTick(
  userId: string, 
  blueTick?: boolean, 
  goldenTick?: boolean
): Promise<User> {
  const response = await apiClient.put<User>(`/d/users/${userId}/tick`, { blueTick, goldenTick });
  return response.data;
}
