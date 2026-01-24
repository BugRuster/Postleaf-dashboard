/**
 * Centralized Type Definitions
 * 
 * This file serves as the single source of truth for all TypeScript types
 * used throughout the admin dashboard application. It re-exports types from
 * various modules for easier imports and better maintainability.
 * 
 * Usage:
 * ```typescript
 * import type { Admin, Report, LoginRequest } from '@/lib/types';
 * ```
 * 
 * Organization:
 * - Authentication types
 * - Admin management types
 * - Report management types
 * - Advertisement types
 * - Analytics types
 * - User management types
 * - API client types
 * - Error handling types
 * - Validation types
 * - Permission types
 */

// ============================================================================
// Authentication Types
// ============================================================================

export type {
  LoginRequestWithEmail,
  LoginRequestWithUsername,
  LoginRequest,
  User as AuthUser,
  LoginResponse,
} from '@/lib/api/auth';

// ============================================================================
// Admin Management Types
// ============================================================================

export type {
  AdminStatus,
  Admin,
  PaginatedResponse,
  PaginationParams,
  UpdateValidityRequest,
  UpdateCreditsRequest,
} from '@/lib/api/admins';

// ============================================================================
// Report Management Types
// ============================================================================

export type {
  Report,
  ReportFilters,
  ReportListResponse,
} from '@/lib/api/reports';

// ============================================================================
// Advertisement Types
// ============================================================================

export type {
  ContentItem,
  ContentResponse,
  CreateAdRequest,
  UpdateAdLinkRequest,
  Pagination,
} from '@/lib/api/ads';

// ============================================================================
// Analytics Types
// ============================================================================

export type {
  TimelineDataPoint,
  ContentTypeAnalytics,
  TopContentItem,
  AnalyticsData,
  ContentAnalyticsData,
} from '@/lib/api/analytics';

// ============================================================================
// User Management Types
// ============================================================================

export type {
  User,
  UserSearchResponse,
  PaginatedResponse as UserPaginatedResponse,
} from '@/lib/api/users';

// ============================================================================
// API Client Types
// ============================================================================

export type {
  ApiError,
} from '@/lib/api/client';

// ============================================================================
// Error Handling Types
// ============================================================================

export type {
  ValidationError,
  ApiErrorResponse,
} from '@/lib/utils/errorHandling';

// ============================================================================
// Validation Types
// ============================================================================

export type {
  LoginFormData,
  ValidityFormData,
  CreditsFormData,
  CreateAdFormData,
  UpdateAdFormData,
  UserSearchFormData,
  UpdateTickFormData,
  ReportFiltersFormData,
} from '@/lib/utils/validation';

// ============================================================================
// Permission Types
// ============================================================================

export type {
  UserRole,
  UserWithRole,
} from '@/lib/auth/permissions';

// ============================================================================
// Common Type Utilities
// ============================================================================

/**
 * Content type union for posts, cuts, and events
 */
export type ContentType = 'post' | 'cut' | 'event';

/**
 * Report status union
 */
export type ReportStatus = 'pending' | 'dismissed' | 'resolved';

/**
 * Advertisement status union
 */
export type AdStatus = 'active' | 'paused' | 'completed';

/**
 * Generic async state for data fetching
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Generic form state
 */
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
}

/**
 * Navigation item structure
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  requiredRole?: 'super_admin';
}

/**
 * Table column definition
 */
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Filter state for lists
 */
export interface FilterState {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Sort state for tables
 */
export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

