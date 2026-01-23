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
  total: number;
  active: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  averageEngagement: number;
}

/**
 * Aggregated analytics data for all content types
 */
export interface AnalyticsData {
  posts: ContentTypeAnalytics;
  cuts: ContentTypeAnalytics;
  events: ContentTypeAnalytics;
}

/**
 * Detailed analytics data for specific content
 */
export interface ContentAnalyticsData {
  contentId: string;
  contentType: 'post' | 'cut' | 'event';
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagementRate: number;
  timeline: TimelineDataPoint[];
}

/**
 * Fetches aggregated analytics for all content types
 * @returns Promise with analytics data for posts, cuts, and events
 */
export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await apiClient.get<AnalyticsData>('/d/analytics');
  return response.data;
}

/**
 * Fetches detailed analytics for specific content
 * @param contentType - The type of content (post, cut, or event)
 * @param contentId - The ID of the specific content
 * @returns Promise with detailed analytics including timeline data
 */
export async function getContentAnalytics(
  contentType: 'post' | 'cut' | 'event',
  contentId: string
): Promise<ContentAnalyticsData> {
  const response = await apiClient.get<ContentAnalyticsData>(
    `/d/analytics/${contentType}/${contentId}`
  );
  return response.data;
}
