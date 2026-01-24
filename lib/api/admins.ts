/**
 * Admin Management API Functions
 * Handles admin-related API calls including status, management, and updates
 */

import apiClient from "./client";

/**
 * Admin status data returned from the backend
 */
export interface AdminStatus {
  adminId: string;
  role: string;
  adminValidity: number | null;
  adminExpiryTime: string | null;
  allocated_credits: number;
  available_credits: number;
  activeAds: {
    posts: number;
    cuts: number;
    events: number;
    total: number;
  };
}

/**
 * Admin data structure from API
 */
export interface Admin {
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
  updatedAt: string;
}

/**
 * Paginated response structure from API
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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
  validity: number;
}

/**
 * Update credits request
 */
export interface UpdateCreditsRequest {
  credits: number;
}

/**
 * Fetches an admin's status information
 * @param userId - The ID of the admin (admins can only view their own, super_admins can view any)
 * @returns Promise with admin status data (role, credits, validity, active ads count)
 */
export async function getAdminStatus(userId: string): Promise<AdminStatus> {
  const response = await apiClient.get<{
    status: string;
    message: string;
    data: AdminStatus;
  }>(`/d/admins/${userId}/status`);
  return response.data.data;
}

/**
 * Fetches a paginated list of admins (super_admin only)
 * @param params - Pagination parameters (page, limit)
 * @returns Promise with paginated admin list
 */
export async function getAdmins(
  params?: PaginationParams,
): Promise<PaginatedResponse<Admin>> {
  const response = await apiClient.get<PaginatedResponse<Admin>>("/d/admins", {
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
  await apiClient.post("/d/admins", {
    userId,
    action: "promote",
  });
}

/**
 * Demotes an admin to regular user (super_admin only)
 * @param userId - The ID of the admin to demote
 * @returns Promise that resolves when demotion is successful
 */
export async function demoteAdmin(userId: string): Promise<void> {
  await apiClient.post("/d/admins", {
    userId,
    action: "demote",
  });
}

/**
 * Fetches a specific admin's details (super_admin only)
 * @param userId - The ID of the admin
 * @returns Promise with admin details
 */
export async function getAdminById(userId: string): Promise<Admin> {
  const response = await apiClient.get<{
    status: string;
    message: string;
    data: Admin;
  }>(`/d/admins/${userId}`);
  return response.data.data;
}

/**
 * Updates an admin's validity period (super_admin only)
 * @param userId - The ID of the admin
 * @param data - The new validity period
 * @returns Promise with updated admin data
 */
export async function updateAdminValidity(
  userId: string,
  data: UpdateValidityRequest,
): Promise<Admin> {
  const response = await apiClient.post<{
    status: string;
    message: string;
    data: Admin;
  }>(`/d/admins/${userId}/validity`, data);
  return response.data.data;
}

/**
 * Updates an admin's credits (super_admin only)
 * @param userId - The ID of the admin
 * @param data - The new credits amount
 * @returns Promise with updated admin data
 */
export async function updateAdminCredits(
  userId: string,
  data: UpdateCreditsRequest,
): Promise<Admin> {
  const response = await apiClient.post<{
    status: string;
    message: string;
    data: Admin;
  }>(`/d/admins/${userId}/credits`, data);
  return response.data.data;
}
