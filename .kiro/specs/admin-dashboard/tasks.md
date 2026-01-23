# Implementation Plan: Admin Dashboard System

## Overview

This implementation plan breaks down the admin dashboard system into discrete, incremental tasks. Each task builds on previous work, starting with foundational setup, then core authentication, followed by individual dashboard features, and finally integration and testing. The plan follows Next.js App Router conventions and uses shadcn/ui components throughout.

## Tasks

- [x] 1. Project setup and core infrastructure
  - Initialize Next.js project with TypeScript and App Router (done)
  - Configure Tailwind CSS and shadcn/ui (done)
  - Set up project structure (app/, components/, lib/ directories)
  - Install core dependencies (axios, react-hook-form, zod)
  - Configure environment variables for API base URL
  - _Requirements: 16.1, 16.2_

- [x] 2. Install required shadcn/ui components
  - Run `pnpm dlx shadcn-ui@latest add form input button label card table badge select tabs toast alert skeleton dialog sheet`
  - Install shadcn/charts for data visualization
  - Verify all components are properly installed
  - _Requirements: 16.2, 16.4, 16.5_

- [x] 3. Implement authentication infrastructure
  - [x] 3.1 Create token management utilities
    - Implement `lib/auth/token.ts` with getToken, setToken, removeToken, isAuthenticated functions
    - Use localStorage for token storage
    - _Requirements: 1.1, 1.5_
  
  - [x] 3.2 Create Axios API client with interceptors
    - Implement `lib/api/client.ts` with base configuration
    - Add request interceptor to include JWT token in headers
    - Add response interceptor to handle 401 errors (clear token and redirect)
    - Implement error handling for different status codes
    - _Requirements: 1.4, 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 3.3 Create authentication API functions
    - Implement `lib/api/auth.ts` with login function
    - Define LoginRequest and LoginResponse types
    - _Requirements: 1.1_
  
  - [ ]* 3.4 Write property test for authentication flow
    - **Property 1: Authentication Flow Integrity**
    - Test that valid credentials result in token storage and redirect
    - Test that logout clears token and redirects to login
    - **Validates: Requirements 1.1, 1.3, 1.5**
  
  - [ ]* 3.5 Write property test for invalid credentials
    - **Property 2: Invalid Credentials Rejection**
    - Test that invalid credentials are rejected with error messages
    - **Validates: Requirements 1.2**
  
  - [ ]* 3.6 Write property test for token inclusion
    - **Property 3: Token Inclusion in API Requests**
    - Test that JWT token is included in all API request headers
    - **Validates: Requirements 1.4**

- [x] 4. Implement route protection and middleware
  - [x] 4.1 Create Next.js middleware for authentication
    - Implement `middleware.ts` to check authentication on protected routes
    - Redirect unauthenticated users to /login
    - Allow public access to / and /login routes
    - _Requirements: 2.1, 2.3, 2.6_
  
  - [x] 4.2 Create permission checking utilities
    - Implement `lib/auth/permissions.ts` with role-based access functions
    - Add canAccessAdminManagement, canAccessUserTicks, canAccessReports functions
    - _Requirements: 2.2, 2.4, 2.5_
  
  - [ ]* 4.3 Write property test for route protection
    - **Property 4: Unauthenticated Route Protection**
    - Test that unauthenticated users are redirected from protected routes
    - **Validates: Requirements 2.1**
  
  - [ ]* 4.4 Write property test for role-based access
    - **Property 5: Role-Based Access Control**
    - Test that admins and super_admins have appropriate access levels
    - **Validates: Requirements 2.2, 2.4, 2.5**

- [x] 5. Create login page and authentication UI
  - [x] 5.1 Implement login page
    - Create `app/(auth)/login/page.tsx` as a client component
    - Implement form with email or username, password, and role fields using shadcn/ui Form
    - Add form validation with react-hook-form and zod
    - Handle login submission and redirect on success
    - Display error messages for failed login attempts
    - _Requirements: 1.1, 1.2, 1.3, 13.1, 13.2_
  
  - [x] 5.2 Create root page with redirect logic
    - Implement `app/page.tsx` to redirect authenticated users to dashboard
    - Redirect unauthenticated users to /login
    - _Requirements: 2.3_
  
  - [ ]* 5.3 Write unit tests for login form
    - Test form validation for empty fields
    - Test form validation for invalid email format
    - Test successful login flow
    - Test error display for failed login
    - _Requirements: 1.1, 1.2, 13.1, 13.2_

- [x] 6. Implement dashboard layout and navigation
  - [x] 6.1 Create dashboard layout with sidebar
    - Implement `app/(dashboard)/layout.tsx` with sidebar navigation
    - Create `components/dashboard/Sidebar.tsx` component
    - Display navigation links based on user role
    - Highlight active navigation link
    - Add logout button that clears token and redirects
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 1.5_
  
  - [ ]* 6.2 Write property test for navigation display
    - **Property 17: Navigation Display and Behavior**
    - Test that navigation links are displayed correctly for each role
    - Test that clicking links navigates to correct pages
    - **Validates: Requirements 12.2, 12.3, 12.4, 12.5**

- [x] 7. Implement dashboard home page
  - [x] 7.1 Create admin status API functions
    - Implement `lib/api/admins.ts` with getAdminStatus function
    - Define AdminStatus type
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 7.2 Create dashboard home page
    - Implement `app/(dashboard)/page.tsx` to fetch and display admin status
    - Create `components/dashboard/StatusCard.tsx` for individual metrics
    - Display role, credits, validity, and active ads count
    - Implement loading states with shadcn/ui Skeleton
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 7.3 Create status charts component
    - Implement `components/dashboard/StatusCharts.tsx` using shadcn/charts
    - Visualize admin status metrics with appropriate chart types
    - _Requirements: 3.6_
  
  - [ ]* 7.4 Write property test for dashboard data display
    - **Property 6: Dashboard Data Display**
    - Test that dashboard fetches and displays all admin status data
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
  
  - [ ]* 7.5 Write property test for loading states
    - **Property 7: Loading State Consistency**
    - Test that loading indicators appear during async operations
    - Test that loading indicators are removed after completion
    - **Validates: Requirements 3.5, 14.1, 14.2, 14.3, 14.4, 14.5**

- [x] 8. Checkpoint - Verify authentication and dashboard home
  - Ensure login works correctly
  - Verify token storage and API client integration
  - Test route protection and role-based access
  - Confirm dashboard home displays admin status
  - Ask the user if questions arise

- [x] 9. Implement admin management features (super_admin only)
  - [x] 9.1 Create admin management API functions
    - Implement `lib/api/admins.ts` with getAdmins, promoteUser, demoteAdmin functions
    - Define Admin, PaginatedResponse types
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 9.2 Create admin list page
    - Implement `app/dashboard/admins/page.tsx` with role check
    - Create `components/admins/AdminList.tsx` component
    - Display paginated list of admins using shadcn/ui Table
    - Add promote/demote buttons with loading states
    - Implement pagination controls
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 9.3 Create admin details page
    - Implement `app/dashboard/admins/[id]/page.tsx` with role check
    - Create `components/admins/AdminDetailsForm.tsx` component
    - Display admin details and forms for updating validity and credits
    - Implement form validation with react-hook-form and zod
    - Handle form submission with loading states and success messages
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 9.4 Write property test for admin list management
    - **Property 8: Admin List Management**
    - Test that admin list fetches and displays correctly
    - Test that promote/demote actions update the list
    - **Validates: Requirements 4.1, 4.2, 4.3**
  
  - [ ]* 9.5 Write property test for admin details update
    - **Property 9: Admin Details Update**
    - Test that validity and credits updates work correctly
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 10. Implement reports management
  - [x] 10.1 Create reports API functions
    - Implement `lib/api/reports.ts` with getReports, dismissReport functions
    - Define Report, ReportFilters, ReportListResponse types
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 10.2 Create reports management page
    - Implement `app/dashboard/reports/page.tsx`
    - Create `components/reports/ReportList.tsx` component
    - Display paginated list of reports using shadcn/ui Table
    - Add dismiss button with loading states
    - _Requirements: 6.1, 6.3, 6.4, 6.5_
  
  - [x] 10.3 Create report filters component
    - Implement `components/reports/ReportFilters.tsx` component
    - Add filters for content type, status, and date range using shadcn/ui Select and DatePicker
    - Update report list when filters change
    - _Requirements: 6.2_
  
  - [ ]* 10.4 Write property test for report filtering and management
    - **Property 11: Report Filtering and Management**
    - Test that filters return correct reports
    - Test that dismiss action removes reports from list
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ]* 10.5 Write property test for pagination
    - **Property 18: Pagination Consistency**
    - Test pagination navigation and button states
    - **Validates: Requirements 6.4, 15.1, 15.2, 15.3, 15.4, 15.5**

- [x] 11. Implement advertisement management
  - [x] 11.1 Create ads API functions
    - Implement `lib/api/ads.ts` with getAvailableContent, getActiveAds, createAd, updateAd, deleteAd functions
    - Define Advertisement, Content, CreateAdRequest, UpdateAdRequest types
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 11.2 Create advertisement management page with tabs
    - Implement `app/dashboard/ads/page.tsx` with shadcn/ui Tabs
    - Create two tabs: "Available Content" and "Active Ads"
    - _Requirements: 7.1, 7.3_
  
  - [x] 11.3 Create available content component
    - Implement `components/ads/AvailableContent.tsx` component
    - Display content available for promotion using shadcn/ui Table
    - Add "Create Ad" button with loading states
    - _Requirements: 7.1, 7.2_
  
  - [x] 11.4 Create active ads component
    - Implement `components/ads/ActiveAds.tsx` component
    - Display active advertisements using shadcn/ui Table
    - Add update and delete buttons with loading states
    - _Requirements: 7.3, 7.4, 7.5_
  
  - [ ]* 11.5 Write property test for advertisement management
    - **Property 12: Advertisement Creation and Management**
    - Test ad creation, update, and deletion flows
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [ ] 12. Checkpoint - Verify admin, reports, and ads features
  - Test admin management (super_admin only)
  - Verify reports filtering and dismissal
  - Test advertisement creation and management
  - Ensure pagination works across all list views
  - Ask the user if questions arise

- [x] 13. Implement analytics features
  - [x] 13.1 Create analytics API functions
    - Implement `lib/api/analytics.ts` with getAnalytics, getContentAnalytics functions
    - Define AnalyticsData, ContentAnalyticsData, TimelineDataPoint types
    - _Requirements: 8.1, 8.2, 8.3, 10.1, 10.2, 10.5_
  
  - [x] 13.2 Create general analytics page
    - Implement `app/dashboard/analytics/page.tsx`
    - Create `components/analytics/AnalyticsOverview.tsx` component
    - Display aggregated statistics for posts, cuts, and events using shadcn/charts
    - Implement loading states and error handling
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 13.3 Create content-specific analytics page
    - Implement `app/dashboard/analytics/[type]/[id]/page.tsx`
    - Create `components/analytics/ContentAnalytics.tsx` component
    - Display detailed metrics and timeline charts using shadcn/charts
    - Support all content types (posts, cuts, events)
    - Implement loading states and error handling
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 13.4 Write property test for analytics data retrieval
    - **Property 13: Analytics Data Retrieval**
    - Test that analytics fetch correctly for all content types
    - **Validates: Requirements 8.1, 8.2, 8.3, 10.1, 10.2, 10.5**
  
  - [ ]* 13.5 Write property test for analytics error handling
    - **Property 14: Analytics Error Handling**
    - Test that analytics failures display appropriate error messages
    - **Validates: Requirements 8.5, 10.4**

- [x] 14. Implement user tick management (super_admin only)
  - [x] 14.1 Create users API functions
    - Implement `lib/api/users.ts` with searchUsers, updateUserTick functions
    - Define User, UserSearchResponse, UpdateTickRequest, TickType types
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 14.2 Create user tick management page
    - Implement `app/dashboard/users/ticks/page.tsx` with role check
    - Create `components/users/TickManagement.tsx` component
    - Add user search input with debouncing
    - Display search results using shadcn/ui Table
    - Add tick assignment/removal controls using shadcn/ui Select
    - Implement loading states for search and update operations
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 14.3 Write property test for user search and tick management
    - **Property 15: User Search and Tick Management**
    - Test that user search returns correct results
    - Test that tick assignment and removal work correctly
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

- [x] 15. Implement comprehensive error handling
  - [x] 15.1 Create error handling utilities
    - Implement `lib/utils/errorHandling.ts` with error display functions
    - Integrate shadcn/ui Toast for error notifications
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 15.2 Add error boundaries for React components
    - Create error boundary components for graceful error handling
    - Display user-friendly error messages
    - _Requirements: 11.1_
  
  - [ ]* 15.3 Write property test for API error handling
    - **Property 16: API Error Handling by Status Code**
    - Test error handling for different HTTP status codes
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [x] 16. Implement form validation across all forms
  - [x] 16.1 Create validation schemas
    - Implement `lib/utils/validation.ts` with Zod schemas for all forms
    - Add email, numeric, and required field validation
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [x] 16.2 Apply validation to all forms
    - Ensure all forms use react-hook-form with Zod validation
    - Display inline error messages using shadcn/ui Form components
    - Provide visual feedback during validation
    - _Requirements: 13.4, 13.5_
  
  - [ ]* 16.3 Write property test for form validation
    - **Property 10: Form Validation Enforcement**
    - Test validation for various invalid inputs
    - Test that valid inputs enable submission
    - **Validates: Requirements 5.4, 13.1, 13.2, 13.3, 13.4, 13.5**

- [-] 17. Final integration and polish
  - [x] 17.1 Add loading states to all async operations
    - Ensure all API calls show loading indicators
    - Use shadcn/ui Skeleton for page loading
    - Use Button loading states for actions
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 17.2 Implement consistent error display
    - Use shadcn/ui Toast for global errors
    - Use inline errors for form validation
    - Ensure all error cases are handled
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 17.3 Add TypeScript type definitions
    - Ensure all components and functions have proper types
    - Create `lib/types/index.ts` with all type definitions
    - Fix any TypeScript errors
    - _Requirements: All_
  
  - [x] 17.4 Test all user flows end-to-end
    - Test login and logout
    - Test all dashboard pages for both admin and super_admin roles
    - Verify route protection and permissions
    - Test all CRUD operations
    - _Requirements: All_

- [ ] 18. Final checkpoint - Complete system verification
  - Run all property-based tests (minimum 100 iterations each)
  - Run all unit tests
  - Verify all features work correctly
  - Test error handling and edge cases
  - Ensure loading states are consistent
  - Verify form validation across all forms
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Use `pnpm` for all package management operations
- Install shadcn/ui components via CLI, never create them manually
- Follow Next.js App Router conventions throughout
- Implement proper TypeScript types for all components and functions
