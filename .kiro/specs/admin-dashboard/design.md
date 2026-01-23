# Design Document: Admin Dashboard System

## Overview

The Admin Dashboard System is a Next.js App Router application that provides role-based administrative interfaces for managing users, content, advertisements, and reports. The system uses TypeScript for type safety, shadcn/ui for consistent UI components, Axios for API communication, and localStorage for JWT token management.

The architecture follows Next.js App Router conventions with server and client components, middleware for route protection, and a modular component structure. The system supports two user roles (admin and super_admin) with different access levels to various dashboard features.

## Architecture

### Application Structure

```
app/
├── (auth)/
│   └── login/
│       └── page.tsx          # Login page (public)
├── (dashboard)/
│   ├── layout.tsx            # Dashboard layout with sidebar
│   ├── page.tsx              # Dashboard home
│   ├── admins/
│   │   ├── page.tsx          # Admin list (super_admin only)
│   │   └── [id]/
│   │       └── page.tsx      # Admin details (super_admin only)
│   ├── reports/
│   │   └── page.tsx          # Reports management
│   ├── ads/
│   │   └── page.tsx          # Advertisement management
│   ├── analytics/
│   │   ├── page.tsx          # General analytics
│   │   └── [type]/[id]/
│   │       └── page.tsx      # Content-specific analytics
│   └── users/
│       └── ticks/
│           └── page.tsx      # User tick management (super_admin only)
├── api/                      # API route handlers (if needed)
├── layout.tsx                # Root layout
└── page.tsx                  # Root page (redirects to login or dashboard)

components/
├── ui/                       # shadcn/ui components (installed via CLI)
├── auth/
│   └── LoginForm.tsx         # Login form component
├── dashboard/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── StatusCard.tsx        # Dashboard status cards
│   └── StatusCharts.tsx      # Dashboard charts using shadcn/charts
├── admins/
│   ├── AdminList.tsx         # Admin list table
│   ├── AdminDetailsForm.tsx  # Admin details form
│   └── PromoteDemoteButton.tsx
├── reports/
│   ├── ReportList.tsx        # Reports table
│   └── ReportFilters.tsx     # Filter controls
├── ads/
│   ├── AvailableContent.tsx  # Available content tab
│   └── ActiveAds.tsx         # Active ads tab
├── analytics/
│   ├── AnalyticsOverview.tsx # General analytics display
│   └── ContentAnalytics.tsx  # Content-specific analytics
└── users/
    └── TickManagement.tsx    # User tick management

lib/
├── api/
│   ├── client.ts             # Axios client configuration
│   ├── auth.ts               # Auth API calls
│   ├── admins.ts             # Admin API calls
│   ├── reports.ts            # Reports API calls
│   ├── ads.ts                # Ads API calls
│   ├── analytics.ts          # Analytics API calls
│   └── users.ts              # Users API calls
├── auth/
│   ├── token.ts              # Token management (localStorage)
│   └── permissions.ts        # Role-based permission checks
├── types/
│   └── index.ts              # TypeScript type definitions
└── utils/
    └── validation.ts         # Form validation utilities

middleware.ts                 # Route protection middleware
```

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui (installed via CLI)
- **Charts**: shadcn/charts (recharts)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS (via shadcn/ui)
- **State Management**: React hooks (useState, useEffect)
- **Package Manager**: pnpm

## Components and Interfaces

### Authentication Module

**Token Management (`lib/auth/token.ts`)**
```typescript
interface TokenManager {
  getToken(): string | null
  setToken(token: string): void
  removeToken(): void
  isAuthenticated(): boolean
}
```

The TokenManager handles JWT token storage in localStorage with methods to get, set, and remove tokens. It provides a simple interface for checking authentication status.

**Login Form Component (`components/auth/LoginForm.tsx`)**
```typescript
interface LoginFormProps {
  onSuccess: () => void
}

interface LoginFormData {
  email: string
  password: string
  role: 'admin' | 'super_admin'
}
```

The LoginForm is a client component that uses shadcn/ui Form, Input, and Button components. It validates inputs, calls the login API, stores the JWT token, and redirects on success.

### Route Protection

**Middleware (`middleware.ts`)**
```typescript
interface MiddlewareConfig {
  matcher: string[]
}

function middleware(request: NextRequest): NextResponse
```

The middleware checks for JWT tokens in cookies or headers, validates authentication for protected routes, and redirects unauthenticated users to login. It runs on all routes except public paths (/, /login).

**Permission Checker (`lib/auth/permissions.ts`)**
```typescript
interface UserRole {
  role: 'admin' | 'super_admin'
}

function canAccessAdminManagement(role: UserRole): boolean
function canAccessUserTicks(role: UserRole): boolean
function canAccessReports(role: UserRole): boolean
```

The permission checker provides role-based access control functions that return boolean values indicating whether a user can access specific features.

### API Client

**Axios Client (`lib/api/client.ts`)**
```typescript
interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
}

interface ApiError {
  message: string
  status: number
  data?: any
}
```

The API client is configured with:
- Base URL for the backend API
- Request interceptor to add JWT token to headers
- Response interceptor to handle 401 errors (redirect to login)
- Error handling with typed error responses

### Dashboard Components

**Sidebar Navigation (`components/dashboard/Sidebar.tsx`)**
```typescript
interface SidebarProps {
  userRole: 'admin' | 'super_admin'
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType
  requiredRole?: 'super_admin'
}
```

The Sidebar component displays navigation links based on user role, highlights the active route, and includes a logout button. It uses shadcn/ui navigation components.

**Status Cards (`components/dashboard/StatusCard.tsx`)**
```typescript
interface StatusCardProps {
  title: string
  value: string | number
  icon: React.ComponentType
  loading?: boolean
}
```

StatusCard displays individual metrics (role, credits, validity, active ads) using shadcn/ui Card components with loading states.

**Status Charts (`components/dashboard/StatusCharts.tsx`)**
```typescript
interface StatusChartsProps {
  data: AdminStatusData
  loading?: boolean
}

interface AdminStatusData {
  role: string
  credits: number
  validity: string
  activeAds: number
}
```

StatusCharts uses shadcn/charts to visualize admin status metrics with bar charts, line charts, or other appropriate visualizations.

### Admin Management Components

**Admin List (`components/admins/AdminList.tsx`)**
```typescript
interface AdminListProps {
  admins: Admin[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPromote: (userId: string) => void
  onDemote: (adminId: string) => void
  loading?: boolean
}

interface Admin {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  credits: number
  validity: string
}
```

AdminList displays a table of admins with promote/demote actions using shadcn/ui Table and Button components. It includes pagination controls.

**Admin Details Form (`components/admins/AdminDetailsForm.tsx`)**
```typescript
interface AdminDetailsFormProps {
  admin: Admin
  onUpdateValidity: (validity: string) => void
  onUpdateCredits: (credits: number) => void
  loading?: boolean
}
```

AdminDetailsForm provides inputs for updating admin validity and credits using shadcn/ui Form components with validation.

### Reports Management Components

**Report List (`components/reports/ReportList.tsx`)**
```typescript
interface ReportListProps {
  reports: Report[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onDismiss: (reportId: string) => void
  loading?: boolean
}

interface Report {
  id: string
  contentId: string
  contentType: string
  reason: string
  reportedBy: string
  createdAt: string
}
```

ReportList displays reports in a table with dismiss actions and pagination using shadcn/ui components.

**Report Filters (`components/reports/ReportFilters.tsx`)**
```typescript
interface ReportFiltersProps {
  onFilterChange: (filters: ReportFilters) => void
}

interface ReportFilters {
  contentType?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}
```

ReportFilters provides filter controls using shadcn/ui Select and DatePicker components.

### Advertisement Management Components

**Available Content (`components/ads/AvailableContent.tsx`)**
```typescript
interface AvailableContentProps {
  content: Content[]
  onCreateAd: (contentId: string) => void
  loading?: boolean
}

interface Content {
  id: string
  type: 'post' | 'cut' | 'event'
  title: string
  author: string
  createdAt: string
}
```

AvailableContent displays content that can be promoted with create ad actions using shadcn/ui components.

**Active Ads (`components/ads/ActiveAds.tsx`)**
```typescript
interface ActiveAdsProps {
  ads: Advertisement[]
  onUpdate: (adId: string, data: Partial<Advertisement>) => void
  onDelete: (adId: string) => void
  loading?: boolean
}

interface Advertisement {
  id: string
  contentId: string
  contentType: string
  startDate: string
  endDate: string
  budget: number
  status: 'active' | 'paused'
}
```

ActiveAds displays active advertisements with update and delete actions using shadcn/ui components.

### Analytics Components

**Analytics Overview (`components/analytics/AnalyticsOverview.tsx`)**
```typescript
interface AnalyticsOverviewProps {
  data: AnalyticsData
  loading?: boolean
}

interface AnalyticsData {
  posts: {
    total: number
    active: number
    engagement: number
  }
  cuts: {
    total: number
    active: number
    engagement: number
  }
  events: {
    total: number
    active: number
    engagement: number
  }
}
```

AnalyticsOverview displays aggregated statistics using shadcn/charts with bar charts, line charts, and metric cards.

**Content Analytics (`components/analytics/ContentAnalytics.tsx`)**
```typescript
interface ContentAnalyticsProps {
  contentType: 'post' | 'cut' | 'event'
  contentId: string
  data: ContentAnalyticsData
  loading?: boolean
}

interface ContentAnalyticsData {
  views: number
  likes: number
  shares: number
  comments: number
  engagement: number
  timeline: Array<{
    date: string
    views: number
    engagement: number
  }>
}
```

ContentAnalytics displays detailed metrics for specific content using shadcn/charts with time-series visualizations.

### User Tick Management Components

**Tick Management (`components/users/TickManagement.tsx`)**
```typescript
interface TickManagementProps {
  onSearch: (query: string) => void
  searchResults: User[]
  onUpdateTick: (userId: string, tick: TickType | null) => void
  loading?: boolean
}

interface User {
  id: string
  username: string
  email: string
  tick: TickType | null
}

type TickType = 'blue' | 'golden'
```

TickManagement provides user search and tick assignment using shadcn/ui Input, Select, and Button components.

## Data Models

### Authentication Types

```typescript
interface LoginRequest {
  email: string
  password: string
  role: 'admin' | 'super_admin'
}

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    role: 'admin' | 'super_admin'
  }
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}
```

### Admin Types

```typescript
interface Admin {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  credits: number
  validity: string
  activeAds: number
  createdAt: string
  updatedAt: string
}

interface AdminStatus {
  role: string
  credits: number
  validity: string
  activeAds: number
}

interface UpdateValidityRequest {
  validity: string
}

interface UpdateCreditsRequest {
  credits: number
}

interface PromoteDemoteRequest {
  userId: string
  action: 'promote' | 'demote'
}
```

### Report Types

```typescript
interface Report {
  id: string
  contentId: string
  contentType: 'post' | 'cut' | 'event'
  reason: string
  description: string
  reportedBy: string
  reportedAt: string
  status: 'pending' | 'dismissed' | 'resolved'
}

interface ReportFilters {
  contentType?: 'post' | 'cut' | 'event'
  status?: 'pending' | 'dismissed' | 'resolved'
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

interface ReportListResponse {
  reports: Report[]
  total: number
  page: number
  totalPages: number
}
```

### Advertisement Types

```typescript
interface Advertisement {
  id: string
  contentId: string
  contentType: 'post' | 'cut' | 'event'
  startDate: string
  endDate: string
  budget: number
  spent: number
  status: 'active' | 'paused' | 'completed'
  createdAt: string
  updatedAt: string
}

interface Content {
  id: string
  type: 'post' | 'cut' | 'event'
  title: string
  description: string
  author: string
  createdAt: string
  isPromotable: boolean
}

interface CreateAdRequest {
  contentId: string
  startDate: string
  endDate: string
  budget: number
}

interface UpdateAdRequest {
  startDate?: string
  endDate?: string
  budget?: number
  status?: 'active' | 'paused'
}
```

### Analytics Types

```typescript
interface AnalyticsData {
  posts: ContentTypeAnalytics
  cuts: ContentTypeAnalytics
  events: ContentTypeAnalytics
}

interface ContentTypeAnalytics {
  total: number
  active: number
  totalViews: number
  totalLikes: number
  totalShares: number
  totalComments: number
  averageEngagement: number
}

interface ContentAnalyticsData {
  contentId: string
  contentType: 'post' | 'cut' | 'event'
  views: number
  likes: number
  shares: number
  comments: number
  engagementRate: number
  timeline: TimelineDataPoint[]
}

interface TimelineDataPoint {
  date: string
  views: number
  likes: number
  shares: number
  comments: number
  engagement: number
}
```

### User Types

```typescript
interface User {
  id: string
  username: string
  email: string
  tick: TickType | null
  createdAt: string
  updatedAt: string
}

type TickType = 'blue' | 'golden'

interface UserSearchResponse {
  users: User[]
  total: number
}

interface UpdateTickRequest {
  tick: TickType | null
}
```

### Pagination Types

```typescript
interface PaginationParams {
  page: number
  limit: number
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified several areas where properties can be consolidated:

**Authentication and Token Management (1.1-1.5):**
- Properties 1.1, 1.3, and 1.5 can be combined into a comprehensive authentication flow property
- Property 1.4 (token in headers) is a separate concern about API client behavior

**Route Protection (2.1-2.5):**
- Properties 2.4 and 2.5 can be combined into a single role-based access property
- Property 2.1 and 2.2 are distinct (unauthenticated vs unauthorized)

**Dashboard Home Display (3.1-3.5):**
- Properties 3.1-3.4 are all examples of the same pattern (fetching and displaying data)
- These can be combined into one property about data fetching and display

**Loading States (3.5, 4.5, 5.5, 6.5, 8.4, 9.5, 10.3, 14.1-14.5):**
- All loading state properties follow the same pattern
- Can be consolidated into a single comprehensive loading state property

**Pagination (4.4, 6.4, 15.1-15.5):**
- All pagination properties follow the same pattern across different pages
- Can be consolidated into a single comprehensive pagination property

**Form Validation (5.4, 13.1-13.5):**
- All form validation properties follow the same pattern
- Can be consolidated into a single comprehensive form validation property

**Error Handling (11.1-11.5):**
- All error handling properties are distinct and should remain separate

**List Operations (4.1-4.3, 6.1-6.3, 7.1-7.5):**
- Each list type (admins, reports, ads) has similar CRUD operations
- However, they operate on different data types, so they should remain separate

### Correctness Properties

**Property 1: Authentication Flow Integrity**
*For any* valid credentials (email, password, role), when a user authenticates, the system should store the JWT token in localStorage, redirect to the dashboard home, and when the user logs out, the token should be removed and the user redirected to login.
**Validates: Requirements 1.1, 1.3, 1.5**

**Property 2: Invalid Credentials Rejection**
*For any* invalid credentials, the authentication attempt should fail with an error message and prevent access to the dashboard.
**Validates: Requirements 1.2**

**Property 3: Token Inclusion in API Requests**
*For any* API request when a JWT token exists in localStorage, the token should be included in the request headers.
**Validates: Requirements 1.4**

**Property 4: Unauthenticated Route Protection**
*For any* protected route, when accessed by an unauthenticated user, the system should redirect to the login page.
**Validates: Requirements 2.1**

**Property 5: Role-Based Access Control**
*For any* route, the system should grant or deny access based on the user's role (admin can access basic features, super_admin can access all features including admin management and user tick management).
**Validates: Requirements 2.2, 2.4, 2.5**

**Property 6: Dashboard Data Display**
*For any* authenticated admin, when the dashboard home loads, the system should fetch and display the admin's role, credits, validity, and active ads count.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

**Property 7: Loading State Consistency**
*For any* asynchronous operation (API request, data fetch, form submission), the system should display a loading indicator while the operation is in progress and remove it when the operation completes or fails.
**Validates: Requirements 3.5, 4.5, 5.5, 6.5, 8.4, 9.5, 10.3, 14.1, 14.2, 14.3, 14.4, 14.5**

**Property 8: Admin List Management**
*For any* paginated admin list, the system should fetch and display admins, and when a super_admin promotes or demotes a user, the list should update to reflect the change.
**Validates: Requirements 4.1, 4.2, 4.3**

**Property 9: Admin Details Update**
*For any* admin, when a super_admin updates the validity or credits, the system should send the update request and display the new values upon success.
**Validates: Requirements 5.1, 5.2, 5.3**

**Property 10: Form Validation Enforcement**
*For any* form with validation rules, the system should prevent submission when validation fails, display specific error messages, enable submission only when all fields are valid, and provide visual feedback during validation.
**Validates: Requirements 5.4, 13.1, 13.2, 13.3, 13.4, 13.5**

**Property 11: Report Filtering and Management**
*For any* filter criteria applied to reports, the system should fetch and display only reports matching those criteria, and when a report is dismissed, it should be removed from the list.
**Validates: Requirements 6.1, 6.2, 6.3**

**Property 12: Advertisement Creation and Management**
*For any* available content, when an admin creates an advertisement, it should appear in the active ads list, and when an admin updates or deletes an active ad, the changes should be reflected immediately.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

**Property 13: Analytics Data Retrieval**
*For any* content type (posts, cuts, events), the system should fetch and display aggregated analytics, and for any specific content ID, the system should fetch and display detailed analytics.
**Validates: Requirements 8.1, 8.2, 8.3, 10.1, 10.2, 10.5**

**Property 14: Analytics Error Handling**
*For any* analytics request that fails, the system should display an appropriate error message.
**Validates: Requirements 8.5, 10.4**

**Property 15: User Search and Tick Management**
*For any* user search query, the system should return matching users, and when a super_admin assigns or removes a tick, the user's tick status should update accordingly.
**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

**Property 16: API Error Handling by Status Code**
*For any* API request that fails, the system should handle the error based on the status code: network errors show user-friendly messages, 401 errors clear the token and redirect to login, 403 errors show access denied, validation errors show specific messages, and server errors show generic messages with logging.
**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

**Property 17: Navigation Display and Behavior**
*For any* authenticated user, the system should display navigation links appropriate for their role, highlight the active link, and navigate to the correct page when a link is clicked.
**Validates: Requirements 12.2, 12.3, 12.4, 12.5**

**Property 18: Pagination Consistency**
*For any* paginated list, the system should display current page and total pages, navigate to next/previous pages correctly, and disable navigation buttons appropriately at list boundaries.
**Validates: Requirements 4.4, 6.4, 15.1, 15.2, 15.3, 15.4, 15.5**

## Error Handling

### API Error Handling Strategy

The system implements a centralized error handling strategy in the Axios client with the following approach:

**Error Interceptor (`lib/api/client.ts`)**
```typescript
interface ErrorHandler {
  handleNetworkError(): void
  handleUnauthorized(): void
  handleForbidden(): void
  handleValidationError(errors: ValidationError[]): void
  handleServerError(error: Error): void
}
```

**Error Types:**
1. **Network Errors**: Display "Unable to connect to server. Please check your internet connection."
2. **401 Unauthorized**: Clear JWT token, redirect to /login
3. **403 Forbidden**: Display "You don't have permission to perform this action."
4. **400 Validation Errors**: Display specific field errors from response
5. **500 Server Errors**: Display "Something went wrong. Please try again later." and log to console

**Error Display:**
- Use shadcn/ui Toast or Alert components for error messages
- Form-specific errors display inline near the relevant field
- Global errors display in a toast notification

### Form Validation Strategy

**Client-Side Validation:**
- Email format validation using regex
- Required field validation
- Numeric range validation
- Custom validation rules per form

**Validation Library:**
- Use React Hook Form with Zod schema validation
- Integrate with shadcn/ui Form components
- Display errors inline with form fields

**Validation Timing:**
- On blur for individual fields
- On submit for entire form
- Real-time for specific fields (e.g., email format)

### Loading State Management

**Loading Indicators:**
- Skeleton loaders for page content (shadcn/ui Skeleton)
- Spinner for button actions (shadcn/ui Button with loading state)
- Progress bars for long operations
- Disabled state for forms during submission

**Loading State Patterns:**
```typescript
interface LoadingState {
  isLoading: boolean
  error: Error | null
  data: T | null
}
```

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific examples and edge cases with property-based tests for universal correctness properties. This dual approach ensures comprehensive coverage:

- **Unit tests** verify specific examples, integration points, and edge cases
- **Property tests** verify universal properties across all inputs through randomization

### Property-Based Testing Configuration

**Library**: fast-check (TypeScript/JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each property test references its design document property
- Tag format: `Feature: admin-dashboard, Property {number}: {property_text}`

**Example Property Test Structure**:
```typescript
import fc from 'fast-check'

// Feature: admin-dashboard, Property 1: Authentication Flow Integrity
describe('Authentication Flow Integrity', () => {
  it('should store token, redirect, and clear token on logout for any valid credentials', () => {
    fc.assert(
      fc.property(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8 }),
          role: fc.constantFrom('admin', 'super_admin')
        }),
        (credentials) => {
          // Test authentication flow
          // Verify token storage
          // Verify redirect
          // Test logout
          // Verify token removal
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Unit Testing Strategy

**Testing Framework**: Jest with React Testing Library

**Unit Test Focus Areas**:
1. **Component Rendering**: Verify components render correctly with props
2. **User Interactions**: Test button clicks, form submissions, navigation
3. **Edge Cases**: Empty states, error states, boundary conditions
4. **Integration Points**: Component interactions, API client integration

**Example Unit Test Structure**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/auth/LoginForm'

describe('LoginForm', () => {
  it('should display validation error for empty email', () => {
    render(<LoginForm onSuccess={jest.fn()} />)
    const submitButton = screen.getByRole('button', { name: /login/i })
    fireEvent.click(submitButton)
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})
```

### Test Coverage Goals

- **Property Tests**: Cover all 18 correctness properties
- **Unit Tests**: Cover critical user flows and edge cases
- **Integration Tests**: Cover API client and route protection
- **Component Tests**: Cover all interactive components

### Testing Best Practices

1. **Avoid Over-Testing**: Focus unit tests on specific examples and edge cases, let property tests handle comprehensive input coverage
2. **Test Behavior, Not Implementation**: Test what the component does, not how it does it
3. **Use Realistic Data**: Generate realistic test data for property tests
4. **Mock External Dependencies**: Mock API calls, localStorage, and routing
5. **Test Accessibility**: Ensure components are accessible (ARIA labels, keyboard navigation)

### Continuous Integration

- Run all tests on every commit
- Fail builds if any test fails
- Generate coverage reports
- Run property tests with increased iterations (1000+) in CI

## Implementation Notes

### Next.js App Router Patterns

**Server vs Client Components:**
- Use Server Components by default for pages
- Use Client Components ('use client') for interactive elements
- Fetch data in Server Components when possible
- Use client-side fetching for dynamic, user-triggered requests

**Route Organization:**
- Group routes with parentheses for layout sharing: `(dashboard)/`
- Use dynamic routes for parameterized pages: `[id]/`
- Implement middleware.ts for authentication checks

### shadcn/ui Component Installation

**Installation Process:**
1. Initialize shadcn/ui (already done): `pnpm dlx shadcn-ui@latest init`
2. Add components as needed: `pnpm dlx shadcn-ui@latest add [component-name]`
3. Never manually create shadcn/ui components

**Required Components:**
- Form, Input, Button, Label (authentication)
- Table, Card, Badge (data display)
- Select, DatePicker (filters)
- Tabs (advertisement management)
- Toast, Alert (notifications)
- Skeleton (loading states)
- Dialog, Sheet (modals)
- Chart components from shadcn/charts (analytics)

### State Management Approach

**Local State:**
- Use useState for component-local state
- Use useReducer for complex state logic

**Server State:**
- Fetch data in Server Components when possible
- Use client-side fetching with loading states for dynamic data
- Consider React Query/SWR for advanced caching (optional for MVP)

**Global State:**
- Use React Context for auth state if needed
- Keep global state minimal
- Prefer prop drilling for simple cases

### API Integration Patterns

**Axios Client Setup:**
```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

**API Call Pattern:**
```typescript
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.get<T>(url)
    return response.data
  } catch (error) {
    handleApiError(error)
    throw error
  }
}
```

### Performance Considerations

**Optimization Strategies:**
- Use Next.js Image component for images
- Implement pagination for large lists
- Lazy load components when appropriate
- Memoize expensive computations with useMemo
- Debounce search inputs

**Bundle Size:**
- Tree-shake unused shadcn/ui components
- Use dynamic imports for large components
- Monitor bundle size with Next.js analyzer

### Security Considerations

**Token Security:**
- Store JWT in localStorage (acceptable for MVP)
- Include token in Authorization header
- Clear token on logout and 401 errors
- Consider httpOnly cookies for production

**Input Validation:**
- Validate all user inputs client-side
- Sanitize inputs before display
- Use TypeScript for type safety
- Implement CSRF protection if needed

**Route Protection:**
- Implement middleware for authentication
- Check permissions on both client and server
- Redirect unauthorized users appropriately
