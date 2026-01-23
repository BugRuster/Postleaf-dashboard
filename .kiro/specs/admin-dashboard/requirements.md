# Requirements Document

## Introduction

This document specifies the requirements for a frontend admin dashboard system that provides role-based access control for administrators and super_administrators to manage users, content, advertisements, and reports. The system is built as an MVP focusing on functionality over UI polish, using Next.js App Router with TypeScript, shadcn/ui components, Axios for API calls, and pnpm as the package manager.

## Glossary

- **Dashboard_System**: The frontend admin dashboard application built with Next.js App Router
- **Auth_Module**: The authentication and authorization component
- **Admin**: A user with administrative privileges
- **Super_Admin**: A user with elevated administrative privileges including admin management capabilities
- **JWT_Token**: JSON Web Token used for authentication
- **Report**: A user-submitted report about content or behavior
- **Advertisement**: Promoted content displayed to users
- **Tick**: A verification badge (blue or golden) assigned to users
- **Content**: Posts, cuts, or events in the system
- **API_Client**: The Axios-based HTTP client for backend communication
- **shadcn_UI**: The component library used for UI elements
- **shadcn_Charts**: The charting library used for data visualization

## Requirements

### Requirement 1: User Authentication

**User Story:** As an admin or super_admin, I want to log in with my credentials, so that I can access the dashboard system securely.

#### Acceptance Criteria

1. WHEN a user submits valid credentials (email, password, role), THE Auth_Module SHALL authenticate the user and store the JWT_Token in localStorage
2. WHEN a user submits invalid credentials, THE Auth_Module SHALL display an error message and prevent access
3. WHEN authentication succeeds, THE Dashboard_System SHALL redirect the user to the dashboard home page
4. WHEN a JWT_Token exists in localStorage, THE Auth_Module SHALL include it in all API requests
5. WHEN a user logs out, THE Auth_Module SHALL remove the JWT_Token from localStorage and redirect to the login page

### Requirement 2: Route Protection and Authorization

**User Story:** As a system architect, I want route-based access control, so that users can only access pages appropriate for their role.

#### Acceptance Criteria

1. WHEN an unauthenticated user attempts to access a protected route, THE Dashboard_System SHALL redirect them to the login page
2. WHEN an admin attempts to access a super_admin-only route, THE Dashboard_System SHALL deny access and display an error message
3. THE Dashboard_System SHALL allow public access to the root route (/) and login route (/login)
4. WHEN a user's role is admin, THE Dashboard_System SHALL grant access to dashboard home, reports management, advertisement management, and analytics pages
5. WHEN a user's role is super_admin, THE Dashboard_System SHALL grant access to all pages including admin management, admin details, and user tick management
6. THE Dashboard_System SHALL use Next.js App Router middleware for route protection

### Requirement 3: Dashboard Home Display

**User Story:** As an admin, I want to view my status information, so that I can see my role, credits, validity, and active advertisements.

#### Acceptance Criteria

1. WHEN the dashboard home page loads, THE Dashboard_System SHALL fetch and display the admin's role
2. WHEN the dashboard home page loads, THE Dashboard_System SHALL fetch and display the admin's available credits
3. WHEN the dashboard home page loads, THE Dashboard_System SHALL fetch and display the admin's account validity period
4. WHEN the dashboard home page loads, THE Dashboard_System SHALL fetch and display the count of active advertisements
5. WHILE data is being fetched, THE Dashboard_System SHALL display a loading indicator
6. THE Dashboard_System SHALL use shadcn_Charts to visualize admin status metrics

### Requirement 4: Admin Management

**User Story:** As a super_admin, I want to manage other administrators, so that I can promote users to admin or demote admins.

#### Acceptance Criteria

1. WHEN the admin management page loads, THE Dashboard_System SHALL fetch and display a paginated list of admins
2. WHEN a super_admin clicks promote on a user, THE Dashboard_System SHALL send a promotion request and update the list upon success
3. WHEN a super_admin clicks demote on an admin, THE Dashboard_System SHALL send a demotion request and update the list upon success
4. WHEN pagination controls are used, THE Dashboard_System SHALL fetch and display the corresponding page of admins
5. WHILE admin operations are in progress, THE Dashboard_System SHALL display loading indicators

### Requirement 5: Admin Details Management

**User Story:** As a super_admin, I want to configure admin account settings, so that I can set validity periods and credit allocations.

#### Acceptance Criteria

1. WHEN the admin details page loads for a specific admin, THE Dashboard_System SHALL fetch and display that admin's current validity and credits
2. WHEN a super_admin submits a new validity period, THE Dashboard_System SHALL update the admin's validity and display a success message
3. WHEN a super_admin submits a new credit amount, THE Dashboard_System SHALL update the admin's credits and display a success message
4. WHEN form validation fails, THE Dashboard_System SHALL display validation error messages and prevent submission
5. WHILE update operations are in progress, THE Dashboard_System SHALL display loading indicators

### Requirement 6: Reports Management

**User Story:** As an admin, I want to view and manage user reports, so that I can review and dismiss inappropriate content reports.

#### Acceptance Criteria

1. WHEN the reports management page loads, THE Dashboard_System SHALL fetch and display a paginated list of reports
2. WHEN an admin applies filters, THE Dashboard_System SHALL fetch and display reports matching the filter criteria
3. WHEN an admin dismisses a report, THE Dashboard_System SHALL send a dismiss request and remove the report from the list upon success
4. WHEN pagination controls are used, THE Dashboard_System SHALL fetch and display the corresponding page of reports
5. WHILE report operations are in progress, THE Dashboard_System SHALL display loading indicators

### Requirement 7: Advertisement Management

**User Story:** As an admin, I want to create and manage advertisements, so that I can promote content and control active promotions.

#### Acceptance Criteria

1. WHEN the advertisement management page loads on the "available content" tab, THE Dashboard_System SHALL fetch and display content available for promotion
2. WHEN an admin creates an advertisement from available content, THE Dashboard_System SHALL send a creation request and update the display upon success
3. WHEN the advertisement management page loads on the "active ads" tab, THE Dashboard_System SHALL fetch and display currently active advertisements
4. WHEN an admin updates an active advertisement, THE Dashboard_System SHALL send an update request and refresh the display upon success
5. WHEN an admin deletes an active advertisement, THE Dashboard_System SHALL send a deletion request and remove it from the list upon success

### Requirement 8: Analytics Display

**User Story:** As an admin, I want to view aggregated analytics, so that I can understand system-wide metrics for posts, cuts, and events.

#### Acceptance Criteria

1. WHEN the analytics page loads, THE Dashboard_System SHALL fetch and display aggregated statistics for posts
2. WHEN the analytics page loads, THE Dashboard_System SHALL fetch and display aggregated statistics for cuts
3. WHEN the analytics page loads, THE Dashboard_System SHALL fetch and display aggregated statistics for events
4. WHILE analytics data is being fetched, THE Dashboard_System SHALL display loading indicators
5. WHEN analytics data fails to load, THE Dashboard_System SHALL display an error message

### Requirement 9: User Tick Management

**User Story:** As a super_admin, I want to manage user verification badges, so that I can assign or remove blue and golden ticks.

#### Acceptance Criteria

1. WHEN a super_admin searches for a user, THE Dashboard_System SHALL fetch and display matching users
2. WHEN a super_admin selects a user, THE Dashboard_System SHALL display that user's current tick status
3. WHEN a super_admin assigns a tick (blue or golden) to a user, THE Dashboard_System SHALL send an update request and display the new status upon success
4. WHEN a super_admin removes a tick from a user, THE Dashboard_System SHALL send an update request and display the updated status upon success
5. WHILE tick operations are in progress, THE Dashboard_System SHALL display loading indicators

### Requirement 10: Content Analytics

**User Story:** As an admin, I want to view detailed analytics for specific content, so that I can analyze performance of individual posts, cuts, or events.

#### Acceptance Criteria

1. WHEN an admin requests analytics for specific content, THE Dashboard_System SHALL fetch analytics data using the content type and content ID
2. WHEN content analytics load successfully, THE Dashboard_System SHALL display detailed metrics for that content
3. WHILE content analytics are being fetched, THE Dashboard_System SHALL display a loading indicator
4. WHEN content analytics fail to load, THE Dashboard_System SHALL display an error message
5. THE Dashboard_System SHALL support analytics requests for posts, cuts, and events content types

### Requirement 11: API Error Handling

**User Story:** As a user, I want clear error messages when operations fail, so that I understand what went wrong and can take appropriate action.

#### Acceptance Criteria

1. WHEN an API request fails with a network error, THE Dashboard_System SHALL display a user-friendly error message
2. WHEN an API request fails with a 401 unauthorized error, THE Dashboard_System SHALL clear the JWT_Token and redirect to the login page
3. WHEN an API request fails with a 403 forbidden error, THE Dashboard_System SHALL display an access denied message
4. WHEN an API request fails with a validation error, THE Dashboard_System SHALL display the specific validation error messages
5. WHEN an API request fails with a server error, THE Dashboard_System SHALL display a generic error message and log the error details

### Requirement 12: Navigation and Layout

**User Story:** As an admin, I want a consistent navigation interface, so that I can easily access different sections of the dashboard.

#### Acceptance Criteria

1. WHEN a user is authenticated, THE Dashboard_System SHALL display a sidebar with navigation links
2. WHEN a user's role is admin, THE Dashboard_System SHALL display navigation links for dashboard home, reports, advertisements, and analytics
3. WHEN a user's role is super_admin, THE Dashboard_System SHALL display all navigation links including admin management and user tick management
4. WHEN a user clicks a navigation link, THE Dashboard_System SHALL navigate to the corresponding page
5. THE Dashboard_System SHALL highlight the currently active navigation link
6. THE Dashboard_System SHALL use shadcn_UI components for navigation and layout elements

### Requirement 13: Form Validation

**User Story:** As a user, I want form inputs to be validated, so that I submit correct data and receive immediate feedback on errors.

#### Acceptance Criteria

1. WHEN a user submits a login form with empty fields, THE Dashboard_System SHALL display validation error messages and prevent submission
2. WHEN a user submits a form with invalid email format, THE Dashboard_System SHALL display an email validation error
3. WHEN a user submits a form with invalid numeric values, THE Dashboard_System SHALL display a numeric validation error
4. WHEN all form fields are valid, THE Dashboard_System SHALL enable the submit button
5. WHILE form validation is in progress, THE Dashboard_System SHALL provide visual feedback
6. THE Dashboard_System SHALL use shadcn_UI form components for all form inputs

### Requirement 14: Loading States

**User Story:** As a user, I want visual feedback during operations, so that I know the system is processing my request.

#### Acceptance Criteria

1. WHEN an API request is in progress, THE Dashboard_System SHALL display a loading indicator
2. WHEN data is being fetched for a page, THE Dashboard_System SHALL display a loading state for that section
3. WHEN a form is being submitted, THE Dashboard_System SHALL disable the submit button and show a loading indicator
4. WHEN an operation completes successfully, THE Dashboard_System SHALL remove the loading indicator
5. WHEN an operation fails, THE Dashboard_System SHALL remove the loading indicator and display an error message

### Requirement 15: Pagination

**User Story:** As an admin, I want paginated lists, so that I can navigate through large datasets efficiently.

#### Acceptance Criteria

1. WHEN a paginated list loads, THE Dashboard_System SHALL display the current page number and total pages
2. WHEN a user clicks the next page button, THE Dashboard_System SHALL fetch and display the next page of results
3. WHEN a user clicks the previous page button, THE Dashboard_System SHALL fetch and display the previous page of results
4. WHEN a user is on the first page, THE Dashboard_System SHALL disable the previous page button
5. WHEN a user is on the last page, THE Dashboard_System SHALL disable the next page button
6. THE Dashboard_System SHALL use shadcn_UI pagination components

### Requirement 16: Component Management and Package Installation

**User Story:** As a developer, I want to use standardized UI components and package management, so that the codebase is consistent and maintainable.

#### Acceptance Criteria

1. THE Dashboard_System SHALL use pnpm as the package manager for all dependency installations
2. WHEN shadcn_UI components are needed, THE Dashboard_System SHALL install them using the shadcn CLI add command
3. THE Dashboard_System SHALL NOT manually create shadcn_UI components
4. THE Dashboard_System SHALL use shadcn_UI components for all UI elements where available
5. THE Dashboard_System SHALL use shadcn_Charts for all data visualization and chart displays
