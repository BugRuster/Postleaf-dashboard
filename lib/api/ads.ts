/**
 * Advertisement Management API Functions
 * Handles advertisement-related API calls including content, ads CRUD operations
 */

import apiClient from './client';

/**
 * Raw content item structure as returned by the API
 */
interface ApiContentItem {
  _id: string;
  user_id: string;
  caption: string;
  type: string;
  image_url: string[];
  tags: string[];
  TTL: number;
  is_advertisement: boolean;
  interests: string[];
  location: string;
  isBlocked: boolean;
  blockedBy: string[];
  replies: string[];
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  views: number;
}

/**
 * API response wrapper for available content endpoint
 */
interface ApiAvailableContentResponse {
  status: string;
  message: string;
  data: ApiContentItem[];
}

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
 * Maps API content type strings to frontend Content type union
 * @param apiType - The type string from the API response
 * @returns A valid Content type ('post', 'cut', or 'event')
 */
function mapContentType(apiType: string): Content['type'] {
  switch (apiType) {
    case 'text':
      return 'post';
    case 'image':
      return 'post';
    case 'cut':
      return 'cut';
    case 'event':
      return 'event';
    default:
      return 'post';
  }
}

/**
 * Transforms API content item to frontend Content interface
 * @param apiContent - The raw content item from the API
 * @returns A Content object with properly mapped fields
 */
function transformApiContentToContent(apiContent: ApiContentItem): Content {
  return {
    id: apiContent._id,
    type: mapContentType(apiContent.type),
    title: apiContent.caption,
    description: apiContent.caption,
    author: apiContent.user_id,
    createdAt: apiContent.createdAt,
    isPromotable: apiContent.is_advertisement === false,
  };
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
  try {
    const response = await apiClient.get<ApiAvailableContentResponse>('/d/ads/available');
    
    // Validate response structure
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.warn('Invalid API response structure for available content');
      return [];
    }
    
    // Transform each API content item to frontend Content interface
    return response.data.data
      .map(apiContent => {
        try {
          return transformApiContentToContent(apiContent);
        } catch (error) {
          console.error('Failed to transform content item:', apiContent, error);
          return null;
        }
      })
      .filter((content): content is Content => content !== null);
      
  } catch (error) {
    console.error('Failed to fetch available content:', error);
    throw error;
  }
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
