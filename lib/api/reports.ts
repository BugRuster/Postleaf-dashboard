/**
 * Reports Management API Functions
 * Handles report-related API calls including fetching and dismissing reports
 */

import apiClient from "./client";

/**
 * Report data structure
 */
export interface Report {
  id: string;
  contentId: string;
  contentType: "post" | "cut" | "event" | "user" | "comment";
  reason: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: "pending" | "dismissed" | "resolved";
  rawData?: RawReport; // Include raw data for detailed view
}

/**
 * Report filters for querying reports
 */
export interface ReportFilters {
  contentType?: "post" | "cut" | "event" | "user" | "comment";
  status?: "pending" | "dismissed" | "resolved";
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

/** Backend response shape: { status, message, data, pagination } */
interface ReportsApiResponse {
  status: string;
  message: string;
  data: RawReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/** Raw report shape from backend */
interface RawReport {
  _id: string;
  user_id?: {
    _id: string;
    username?: string;
    email?: string;
    profile_picture?: string;
  };
  cut_id?: {
    _id: string;
    caption?: string;
    type?: string;
    media_url?: string;
  } | null;
  post_id?: {
    _id: string;
    caption?: string;
    type?: string;
    image_url?: string[];
  };
  reported_user_id?: {
    _id: string;
    username?: string;
    email?: string;
    profile_picture?: string;
  };
  comment_id?: { _id: string; text?: string; body?: string } | null;
  reason: string;
  status: "pending" | "dismissed" | "resolved";
  createdAt: string;
  updatedAt?: string;
}

function rawReportToReport(raw: RawReport): Report {
  const contentType: Report["contentType"] = raw.reported_user_id
    ? "user"
    : raw.post_id
      ? "post"
      : raw.cut_id
        ? "cut"
        : raw.comment_id
          ? "comment"
          : "post";
  const contentId =
    raw.post_id?._id ||
    raw.cut_id?._id ||
    raw.reported_user_id?._id ||
    raw.comment_id?._id ||
    "";
  const description =
    raw.post_id?.caption ||
    raw.cut_id?.caption ||
    (raw.reported_user_id
      ? `User: ${raw.reported_user_id.username || ""}`
      : "") ||
    (raw.comment_id
      ? raw.comment_id.text || raw.comment_id.body || "Comment"
      : "") ||
    "—";
  return {
    id: raw._id,
    contentId,
    contentType,
    reason: raw.reason,
    description,
    reportedBy: raw.user_id?.username ?? "Unknown",
    reportedAt: raw.createdAt,
    status: raw.status,
    rawData: raw, // Include raw data
  };
}

/**
 * Fetches a paginated list of reports with optional filters
 * @param filters - Optional filters for content type, status, date range, and pagination
 * @returns Promise with paginated report list
 */
export async function getReports(
  filters?: ReportFilters,
): Promise<ReportListResponse> {
  const params: Record<string, string | number | undefined> = {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
  };

  // Only add filters if they have values
  if (filters?.contentType) {
    params.content_type = filters.contentType;
  }
  if (filters?.status) {
    params.status = filters.status;
  }

  const { data: body } = await apiClient.get<ReportsApiResponse>("/d/reports", {
    params,
  });
  const { data = [], pagination } = body;
  const reports = (Array.isArray(data) ? data : []).map(rawReportToReport);
  return {
    reports,
    total: pagination?.total ?? 0,
    page: pagination?.page ?? 1,
    totalPages: pagination?.totalPages ?? 1,
    hasNext: pagination?.hasNextPage ?? false,
    hasPrev: pagination?.hasPrevPage ?? false,
  };
}

/**
 * Dismisses a report (marks it as dismissed)
 * @param reportId - The ID of the report to dismiss
 * @returns Promise that resolves when dismissal is successful
 */
export async function dismissReport(reportId: string): Promise<void> {
  await apiClient.post(`/d/reports/${reportId}/dismiss`);
}

/**
 * Resolves a report (marks it as resolved) with content deletion
 * @param reportId - The ID of the report to resolve
 * @param type - The type of content being deleted (cut, post, user, or comment)
 * @returns Promise that resolves when resolution is successful
 */
export async function resolveReport(
  reportId: string,
  type: "cut" | "post" | "user" | "comment",
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ status: string; message: string }>(
    `/d/reports/${reportId}/resolve`,
    {
      type,
      reportId,
    },
  );
  return { message: data.message };
}

/**
 * Fetches detailed report data including content details
 * @param reportId - The ID of the report
 * @returns Promise with the raw report data
 */
export async function getReportDetails(reportId: string): Promise<RawReport> {
  const { data } = await apiClient.get<{ status: string; data: RawReport }>(
    `/d/reports/${reportId}`,
  );
  return data.data;
}

// Export RawReport type for use in components
export type { RawReport };
