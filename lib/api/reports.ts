/**
 * Reports Management API Functions
 * Handles report-related API calls including fetching and dismissing reports
 */

import apiClient from './client';

/**
 * Report data structure
 */
export interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'cut' | 'event';
  reason: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'dismissed' | 'resolved';
}

/**
 * Report filters for querying reports
 */
export interface ReportFilters {
  contentType?: 'post' | 'cut' | 'event';
  status?: 'pending' | 'dismissed' | 'resolved';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

/**
 * Report list response with pagination
 */
export interface ReportListResponse {
  reports: Report[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Fetches a paginated list of reports with optional filters
 * @param filters - Optional filters for content type, status, date range, and pagination
 * @returns Promise with paginated report list
 */
export async function getReports(filters?: ReportFilters): Promise<ReportListResponse> {
  const response = await apiClient.get<ReportListResponse>('/d/reports', {
    params: {
      contentType: filters?.contentType,
      status: filters?.status,
      dateFrom: filters?.dateFrom,
      dateTo: filters?.dateTo,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
    },
  });
  return response.data;
}

/**
 * Dismisses a report (marks it as dismissed)
 * @param reportId - The ID of the report to dismiss
 * @returns Promise that resolves when dismissal is successful
 */
export async function dismissReport(reportId: string): Promise<void> {
  await apiClient.post(`/d/reports/${reportId}/dismiss`);
}
