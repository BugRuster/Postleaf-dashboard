/**
 * Advertisement Management API Functions
 * Handles advertisement-related API calls including content, ads CRUD operations
 */

import apiClient from './client';

/**
 * Content data structure for promotable content
 */
export interface Content {
  id: string;
  type: 'post' | 'cut' | 'event';
  title: string;
  description: string;
  author: string;
  createdAt: string;
  isPromotable: boolean;
}

/**
 * Advertisement data structure
 */
export interface Advertisement {
  id: string;
  contentId: string;
  contentType: 'post' | 'cut' | 'event';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Create advertisement request
 */
export interface CreateAdRequest {
  contentId: string;
  startDate: string;
  endDate: string;
  budget: number;
}

/**
 * Update advertisement request
 */
export interface UpdateAdRequest {
  startDate?: string;
  endDate?: string;
  budget?: number;
  status?: 'active' | 'paused';
}

/**
 * Fetches content available for promotion
 * @returns Promise with array of promotable content
 */
export async function getAvailableContent(): Promise<Content[]> {
  const response = await apiClient.get<Content[]>('/d/ads/available');
  return response.data;
}

/**
 * Fetches active advertisements for the current admin
 * @returns Promise with array of active advertisements
 */
export async function getActiveAds(): Promise<Advertisement[]> {
  const response = await apiClient.get<Advertisement[]>('/d/ads');
  return response.data;
}

/**
 * Creates a new advertisement
 * @param data - Advertisement creation data (contentId, dates, budget)
 * @returns Promise with created advertisement
 */
export async function createAd(data: CreateAdRequest): Promise<Advertisement> {
  const response = await apiClient.post<Advertisement>('/d/ads', data);
  return response.data;
}

/**
 * Updates an existing advertisement
 * @param adId - The ID of the advertisement to update
 * @param data - Advertisement update data (dates, budget, status)
 * @returns Promise with updated advertisement
 */
export async function updateAd(adId: string, data: UpdateAdRequest): Promise<Advertisement> {
  const response = await apiClient.put<Advertisement>(`/d/ads/${adId}`, data);
  return response.data;
}

/**
 * Deletes an advertisement
 * @param adId - The ID of the advertisement to delete
 * @returns Promise that resolves when deletion is successful
 */
export async function deleteAd(adId: string): Promise<void> {
  await apiClient.delete(`/d/ads/${adId}`);
}
