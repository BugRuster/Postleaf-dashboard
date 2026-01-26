/**
 * Advertisement Management API Functions
 * Handles advertisement-related API calls including content, ads CRUD operations
 */

import apiClient from './client';

/**
 * Content item structure as returned by the API
 */
export interface ContentItem {
  _id: string;
  contentType: 'post' | 'cut' | 'event';
  content: {
    _id: string;
    user_id?: string;
    creator_id?: string;
    caption?: string;
    title?: string;
    description?: string;
    type?: string;
    image_url?: string[];
    event_images?: string[];
    media_url?: string;
    event_date?: string;
    location?: string;
    createdAt: string;
    views?: number;
    is_advertisement?: boolean;
    ad_link?: string;
  };
  createdAt: string;
}

/**
 * Pagination metadata structure
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Content response with pagination
 */
export interface ContentResponse {
  data: ContentItem[];
  pagination: Pagination;
}

/**
 * Create advertisement request
 */
export interface CreateAdRequest {
  contentId: string;
  contentType: 'post' | 'cut' | 'event';
  adLink?: string;
}

/**
 * Update ad link request
 */
export interface UpdateAdLinkRequest {
  contentType: 'post' | 'cut' | 'event';
  adLink: string;
}

/**
 * Fetches content available for promotion
 */
export async function getAvailableContent(page = 1, limit = 20): Promise<ContentResponse> {
  const response = await apiClient.get('/d/ads/available', {
    params: { page, limit }
  });
  return response.data;
}

/**
 * Creates a new advertisement
 */
export async function createAd(data: CreateAdRequest): Promise<void> {
  await apiClient.post('/d/ads', data);
}

/**
 * Deletes an advertisement by content ID
 */
export async function deleteAd(contentId: string, contentType: 'post' | 'cut' | 'event'): Promise<void> {
  await apiClient.delete(`/d/ads/${contentId}`, {
    params: { contentType }
  });
}

/**
 * Updates ad link for content
 */
export async function updateAdLink(
  contentId: string, 
  contentType: 'post' | 'cut' | 'event', 
  adLink: string
): Promise<void> {
  await apiClient.put(`/d/ads/${contentId}`, {
    contentType,
    adLink
  });
}
