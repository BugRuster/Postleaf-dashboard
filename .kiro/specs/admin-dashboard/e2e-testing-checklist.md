# End-to-End Testing Checklist

## Overview
This document provides a comprehensive checklist for manually testing all user flows in the Admin Dashboard System. Each test should be performed for both `admin` and `super_admin` roles where applicable.

## Test Environment Setup
- [ ] Backend API is running and accessible
- [ ] Environment variables are configured (`.env.local`)
- [ ] Development server is running (`npm run dev`)
- [ ] Browser console is open for error monitoring

---

## 1. Authentication Flow

### 1.1 Login Tests
- [ ] **Valid Login (Admin)**
  - Navigate to `/login`
  - Enter valid admin credentials
  - Verify successful redirect to `/dashboard`
  - Verify JWT token is stored in localStorage
  - Verify user data is stored in localStorage

- [ ] **Valid Login (Super Admin)**
  - Navigate to `/login`
  - Enter valid super_admin credentials
  - Verify successful redirect to `/dashboard`
  - Verify JWT token is stored in localStorage
  - Verify user data is stored in localStorage

- [ ] **Invalid Credentials**
  - Navigate to `/login`
  - Enter invalid credentials
  - Verify error message is displayed
  - Verify no redirect occurs
  - Verify no token is stored

- [ ] **Form Validation**
  - Try submitting with empty username/email
  - Try submitting with empty password
  - Verify validation error messages appear
  - Verify submit button is disabled during submission

- [ ] **Loading States**
  - Verify loading indicator appears during login
  - Verify button shows "Logging in..." text
  - Verify form fields are disabled during submission

### 1.2 Logout Tests
- [ ] **Logout from Dashboard**
  - Login successfully
  - Click logout button in sidebar
  - Verify redirect to `/login`
  - Verify JWT token is removed from localStorage
  - Verify user data is removed from localStorage

---

## 2. Route Protection and Authorization

### 2.1 Unauthenticated Access
- [ ] **Protected Routes**
  - Clear localStorage (logout)
  - Try accessing `/dashboard`
  - Verify redirect to `/login`
  - Try accessing `/dashboard/admins`
  - Verify redirect to `/login`
  - Try accessing `/dashboard/reports`
  - Verify redirect to `/login`

### 2.2 Role-Based Access (Admin)
- [ ] **Admin Access**
  - Login as admin
  - Verify access to `/dashboard` (home)
  - Verify access to `/dashboard/reports`
  - Verify access to `/dashboard/ads`
  - Verify access to `/dashboard/analytics`
  - Verify NO access to `/dashboard/admins` (should redirect or show error)
  - Verify NO access to `/dashboard/users/ticks` (should redirect or show error)

### 2.3 Role-Based Access (Super Admin)
- [ ] **Super Admin Access**
  - Login as super_admin
  - Verify access to all routes:
    - `/dashboard`
    - `/dashboard/admins`
    - `/dashboard/admins/[id]`
    - `/dashboard/reports`
    - `/dashboard/ads`
    - `/dashboard/analytics`
    - `/dashboard/users/ticks`

### 2.4 Navigation Display
- [ ] **Admin Navigation**
  - Login as admin
  - Verify sidebar shows: Dashboard, Reports, Ads, Analytics
  - Verify sidebar does NOT show: Admin Management, User Ticks

- [ ] **Super Admin Navigation**
  - Login as super_admin
  - Verify sidebar shows all navigation items
  - Verify active link is highlighted
  - Click each navigation link and verify correct page loads

---

## 3. Dashboard Home Page

### 3.1 Status Display
- [ ] **Admin Status Cards**
  - Navigate to `/dashboard`
  - Verify "Role" card displays correct role
  - Verify "Credits" card displays numeric value
  - Verify "Validity" card displays validity period
  - Verify "Active Ads" card displays count

- [ ] **Loading States**
  - Refresh page
  - Verify skeleton loaders appear while data loads
  - Verify loaders are replaced with actual data

- [ ] **Status Charts**
  - Verify charts render correctly
  - Verify chart data matches status cards
  - Verify charts are responsive

- [ ] **Error Handling**
  - Simulate API error (disconnect backend)
  - Verify error message is displayed
  - Verify page doesn't crash

---

## 4. Admin Management (Super Admin Only)

### 4.1 Admin List
- [ ] **List Display**
  - Navigate to `/dashboard/admins`
  - Verify list of admins is displayed
  - Verify table shows: email, role, credits, validity
  - Verify pagination controls are present

- [ ] **Pagination**
  - Click "Next" button
  - Verify next page loads
  - Click "Previous" button
  - Verify previous page loads
  - Verify buttons are disabled at boundaries

- [ ] **Promote User**
  - Click "Promote" button on a user
  - Verify loading state ("Promoting...")
  - Verify list refreshes after promotion
  - Verify user's role is updated

- [ ] **Demote Admin**
  - Click "Demote" button on an admin
  - Verify loading state ("Demoting...")
  - Verify list refreshes after demotion
  - Verify user's role is updated

- [ ] **Refresh Button**
  - Click "Refresh" button
  - Verify list reloads

### 4.2 Admin Details
- [ ] **Details Page**
  - Click on an admin in the list
  - Navigate to `/dashboard/admins/[id]`
  - Verify admin information is displayed
  - Verify validity and credits forms are present

- [ ] **Update Validity**
  - Enter new validity period
  - Click "Update Validity"
  - Verify loading state
  - Verify success message appears
  - Verify data refreshes

- [ ] **Update Credits**
  - Enter new credit amount
  - Click "Update Credits"
  - Verify loading state
  - Verify success message appears
  - Verify data refreshes

- [ ] **Form Validation**
  - Try submitting empty validity
  - Try submitting negative credits
  - Verify validation errors appear

- [ ] **Back to List**
  - Click "Back to List" button
  - Verify navigation to admin list

---

## 5. Reports Management

### 5.1 Report List
- [ ] **List Display**
  - Navigate to `/dashboard/reports`
  - Verify list of reports is displayed
  - Verify table shows: content type, reason, reported by, date
  - Verify pagination controls are present

- [ ] **Filters**
  - Apply content type filter
  - Verify filtered results
  - Apply status filter
  - Verify filtered results
  - Apply date range filter
  - Verify filtered results
  - Clear filters
  - Verify all reports are shown

- [ ] **Dismiss Report**
  - Click "Dismiss" button on a report
  - Verify loading state ("Dismissing...")
  - Verify report is removed from list
  - Verify list refreshes

- [ ] **Pagination**
  - Navigate through pages
  - Verify pagination works correctly
  - Verify page numbers update

- [ ] **Refresh Button**
  - Click "Refresh" button
  - Verify list reloads

---

## 6. Advertisement Management

### 6.1 Available Content Tab
- [ ] **Content Display**
  - Navigate to `/dashboard/ads`
  - Verify "Available Content" tab is active
  - Verify list of promotable content is displayed
  - Verify table shows: type, title, description, author, created date

- [ ] **Create Ad**
  - Click "Create Ad" button on content
  - Verify loading state ("Creating...")
  - Verify ad is created
  - Verify content list refreshes
  - Switch to "Active Ads" tab
  - Verify new ad appears in active ads

- [ ] **Refresh Button**
  - Click "Refresh" button
  - Verify list reloads

### 6.2 Active Ads Tab
- [ ] **Ads Display**
  - Click "Active Ads" tab
  - Verify list of active ads is displayed
  - Verify table shows: type, content ID, dates, budget, spent, status

- [ ] **Pause/Resume Ad**
  - Click "Pause" button on active ad
  - Verify loading state
  - Verify ad status changes to "paused"
  - Click "Resume" button
  - Verify ad status changes to "active"

- [ ] **Delete Ad**
  - Click "Delete" button on an ad
  - Verify loading state ("Deleting...")
  - Verify ad is removed from list
  - Verify list refreshes

- [ ] **Refresh Button**
  - Click "Refresh" button
  - Verify list reloads

---

## 7. Analytics

### 7.1 General Analytics
- [ ] **Analytics Display**
  - Navigate to `/dashboard/analytics`
  - Verify aggregated statistics are displayed
  - Verify charts for posts, cuts, and events
  - Verify metrics: total, active, views, likes, shares, comments

- [ ] **Loading States**
  - Refresh page
  - Verify loading indicators appear
  - Verify data loads correctly

- [ ] **Error Handling**
  - Simulate API error
  - Verify error message is displayed

### 7.2 Content-Specific Analytics
- [ ] **Navigate to Content Analytics**
  - From general analytics, click on specific content
  - Navigate to `/dashboard/analytics/[type]/[id]`
  - Verify content type is displayed (post/cut/event)
  - Verify detailed metrics are shown

- [ ] **Timeline Charts**
  - Verify timeline chart is displayed
  - Verify chart shows views, likes, shares over time
  - Verify chart is interactive

- [ ] **Back Navigation**
  - Click back button
  - Verify navigation to previous page

---

## 8. User Tick Management (Super Admin Only)

### 8.1 User Search
- [ ] **Search Functionality**
  - Navigate to `/dashboard/users/ticks`
  - Enter search query (minimum 2 characters)
  - Verify loading state appears
  - Verify search results are displayed
  - Verify table shows: username, email, current tick

- [ ] **Search Debouncing**
  - Type quickly in search box
  - Verify search doesn't trigger on every keystroke
  - Verify search triggers after typing stops

- [ ] **Empty Search**
  - Clear search box
  - Verify empty state message is shown

### 8.2 Tick Assignment
- [ ] **Assign Blue Tick**
  - Search for a user
  - Select "Blue" from tick dropdown
  - Verify loading state
  - Verify success message appears
  - Verify user's tick is updated in the list

- [ ] **Assign Golden Tick**
  - Search for a user
  - Select "Golden" from tick dropdown
  - Verify loading state
  - Verify success message appears
  - Verify user's tick is updated

- [ ] **Remove Tick**
  - Search for a user with a tick
  - Select "None" from tick dropdown
  - Verify loading state
  - Verify success message appears
  - Verify user's tick is removed

---

## 9. Error Handling

### 9.1 API Errors
- [ ] **Network Error**
  - Disconnect from network
  - Perform any API action
  - Verify toast notification: "Unable to connect to server..."

- [ ] **401 Unauthorized**
  - Manually clear token from localStorage
  - Perform any API action
  - Verify redirect to `/login`
  - Verify toast notification about session expiry

- [ ] **403 Forbidden**
  - Try accessing super_admin route as admin
  - Verify error message: "You don't have permission..."

- [ ] **500 Server Error**
  - Simulate server error
  - Verify toast notification: "Something went wrong..."

### 9.2 Form Validation Errors
- [ ] **Login Form**
  - Submit with empty fields
  - Verify inline validation errors

- [ ] **Admin Details Form**
  - Submit with invalid data
  - Verify inline validation errors

### 9.3 React Error Boundaries
- [ ] **Component Error**
  - Trigger a component error (if possible)
  - Verify error boundary catches it
  - Verify user-friendly error message
  - Verify "Try Again" button works

---

## 10. Loading States

### 10.1 Page Loading
- [ ] **Dashboard Home**
  - Verify skeleton loaders for status cards
  - Verify skeleton loaders for charts

- [ ] **Admin List**
  - Verify skeleton loaders for table rows

- [ ] **Reports List**
  - Verify skeleton loaders for table rows

- [ ] **Available Content**
  - Verify skeleton loaders for table rows

- [ ] **Active Ads**
  - Verify skeleton loaders for table rows

- [ ] **Analytics**
  - Verify skeleton loaders for charts and metrics

### 10.2 Action Loading
- [ ] **Button States**
  - Verify all action buttons show loading text
  - Verify buttons are disabled during loading
  - Verify loading indicators appear

---

## 11. Responsive Design

### 11.1 Desktop View
- [ ] Verify layout works on desktop (1920x1080)
- [ ] Verify sidebar is visible
- [ ] Verify tables are readable
- [ ] Verify charts render correctly

### 11.2 Tablet View
- [ ] Verify layout works on tablet (768x1024)
- [ ] Verify sidebar adapts
- [ ] Verify tables are scrollable if needed

### 11.3 Mobile View
- [ ] Verify layout works on mobile (375x667)
- [ ] Verify sidebar collapses or adapts
- [ ] Verify tables are scrollable

---

## 12. Browser Compatibility

- [ ] **Chrome**
  - Test all flows in Chrome
  - Verify no console errors

- [ ] **Firefox**
  - Test all flows in Firefox
  - Verify no console errors

- [ ] **Safari**
  - Test all flows in Safari
  - Verify no console errors

- [ ] **Edge**
  - Test all flows in Edge
  - Verify no console errors

---

## 13. Performance

- [ ] **Page Load Times**
  - Verify pages load within 2 seconds
  - Check Network tab for slow requests

- [ ] **Bundle Size**
  - Run `npm run build`
  - Verify bundle sizes are reasonable
  - Check for any warnings

- [ ] **Memory Leaks**
  - Navigate between pages multiple times
  - Check browser memory usage
  - Verify no memory leaks

---

## 14. Accessibility

- [ ] **Keyboard Navigation**
  - Navigate using Tab key
  - Verify focus indicators are visible
  - Verify all interactive elements are reachable

- [ ] **Screen Reader**
  - Test with screen reader
  - Verify labels are present
  - Verify ARIA attributes are correct

- [ ] **Color Contrast**
  - Verify text is readable
  - Verify sufficient color contrast

---

## Test Results Summary

### Passed Tests: _____ / _____
### Failed Tests: _____ / _____
### Blocked Tests: _____ / _____

### Critical Issues Found:
1. 
2. 
3. 

### Minor Issues Found:
1. 
2. 
3. 

### Notes:


---

## Sign-off

**Tester Name:** ___________________
**Date:** ___________________
**Signature:** ___________________
