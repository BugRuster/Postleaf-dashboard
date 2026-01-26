/**
 * Analytics API Functions
 * Handles analytics-related API calls for aggregated and content-specific data
 */

import apiClient from './client';

/**
 * Timeline data point for time-series analytics
 */
export interface TimelineDataPoint {
  date: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
}

/**
 * Analytics data for a specific content type
 */
export interface ContentTypeAnalytics {
  count: number;
  views: number;
  likes: number;
  comments: number;
  registrations?: number;
}

/**
 * Top content item
 */
export interface TopContentItem {
  id: string;
  type: 'post' | 'cut' | 'event';
  title: string;
  views: number;
  imageUrl?: string;
  mediaUrl?: string;
  isAd: boolean;
}

/**
 * Active ad item
 */
export interface ActiveAdItem {
  id: string;
  type: 'post' | 'cut' | 'event';
  title: string;
  views: number;
  likes: number;
  comments: number;
  imageUrl?: string;
  mediaUrl?: string;
  createdAt: string;
}

/**
 * Aggregated analytics data for all content types
 */
export interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
  posts: ContentTypeAnalytics;
  cuts: ContentTypeAnalytics;
  events: ContentTypeAnalytics;
  topContent: TopContentItem[];
  activeAds: ActiveAdItem[];
}

/**
 * Detailed analytics data for specific content
 */
export interface ContentAnalyticsData {
  id: string;
  type: 'post' | 'cut' | 'event';
  title: string;
  views: number;
  likes: number;
  comments: number;
  isAd: boolean;
  imageUrl?: string;
  mediaUrl?: string;
  registrations?: number;
  createdAt: string;
}

/**
 * Fetches aggregated analytics for all content types
 * @returns Promise with analytics data for posts, cuts, and events
 */
export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await apiClient.get<{ data: AnalyticsData }>('/d/analytics');
  return response.data.data;
}

/**
 * Fetches detailed analytics for specific content
 * @param contentType - The type of content (post, cut, or event)
 * @param contentId - The ID of the specific content
 * @returns Promise with detailed analytics data
 */
export async function getContentAnalytics(
  contentType: 'post' | 'cut' | 'event',
  contentId: string
): Promise<ContentAnalyticsData> {
  const response = await apiClient.get<{ data: ContentAnalyticsData }>(
    `/d/analytics/${contentType}/${contentId}`
  );
  return response.data.data;
}
