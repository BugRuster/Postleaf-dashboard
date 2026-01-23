/**
 * Admin Management API Functions
 * Handles admin-related API calls including status, management, and updates
 */

import apiClient from './client';

/**
 * Admin status data returned from the backend
 */
export interface AdminStatus {
  role: string;
  credits: number;
  validity: string;
  activeAds: number;
}

/**
 * Admin data structure
 */
export interface Admin {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  credits: number;
  validity: string;
  activeAds: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Update validity request
 */
export interface UpdateValidityRequest {
  validity: string;
}

/**
 * Update credits request
 */
export interface UpdateCreditsRequest {
  credits: number;
}

/**
 * Fetches an admin's status information
 * @param adminId - The ID of the admin (admins can only view their own, super_admins can view any)
 * @returns Promise with admin status data (role, credits, validity, active ads count)
 */
export async function getAdminStatus(adminId: string): Promise<AdminStatus> {
  const response = await apiClient.get<AdminStatus>(`/d/admins/${adminId}/status`);
  return response.data;
}

/**
 * Fetches a paginated list of admins (super_admin only)
 * @param params - Pagination parameters (page, limit)
 * @returns Promise with paginated admin list
 */
export async function getAdmins(params?: PaginationParams): Promise<PaginatedResponse<Admin>> {
  const response = await apiClient.get<PaginatedResponse<Admin>>('/d/admins', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
    },
  });
  return response.data;
}

/**
 * Promotes a user to admin role (super_admin only)
 * @param userId - The ID of the user to promote
 * @returns Promise that resolves when promotion is successful
 */
export async function promoteUser(userId: string): Promise<void> {
  await apiClient.post(`/d/admins/promote/${userId}`);
}

/**
 * Demotes an admin to regular user (super_admin only)
 * @param adminId - The ID of the admin to demote
 * @returns Promise that resolves when demotion is successful
 */
export async function demoteAdmin(adminId: string): Promise<void> {
  await apiClient.post(`/d/admins/demote/${adminId}`);
}

/**
 * Fetches a specific admin's details (super_admin only)
 * @param adminId - The ID of the admin
 * @returns Promise with admin details
 */
export async function getAdminById(adminId: string): Promise<Admin> {
  const response = await apiClient.get<Admin>(`/d/admins/${adminId}`);
  return response.data;
}

/**
 * Updates an admin's validity period (super_admin only)
 * @param adminId - The ID of the admin
 * @param data - The new validity period
 * @returns Promise with updated admin data
 */
export async function updateAdminValidity(adminId: string, data: UpdateValidityRequest): Promise<Admin> {
  const response = await apiClient.put<Admin>(`/d/admins/${adminId}/validity`, data);
  return response.data;
}

/**
 * Updates an admin's credits (super_admin only)
 * @param adminId - The ID of the admin
 * @param data - The new credits amount
 * @returns Promise with updated admin data
 */
export async function updateAdminCredits(adminId: string, data: UpdateCreditsRequest): Promise<Admin> {
  const response = await apiClient.put<Admin>(`/d/admins/${adminId}/credits`, data);
  return response.data;
}
