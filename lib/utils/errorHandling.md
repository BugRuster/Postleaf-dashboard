# Error Handling Utilities

This module provides centralized error handling utilities for the Admin Dashboard System.

## Features

- **Centralized Error Handling**: All API errors are handled consistently
- **Toast Notifications**: User-friendly error messages using Sonner
- **Error Boundaries**: React error boundaries for graceful error handling
- **Type-Safe**: Full TypeScript support

## Usage

### API Error Handling

The `handleApiError` function is automatically called by the Axios interceptor for all API errors:

```typescript
import { handleApiError } from "@/lib/utils/errorHandling";

try {
  const response = await apiClient.get("/endpoint");
} catch (error) {
  handleApiError(error); // Automatically displays appropriate toast
}
```

### Manual Toast Notifications

```typescript
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "@/lib/utils/errorHandling";

// Success message
showSuccess("Admin updated successfully");

// Error message
showError("Failed to update admin");

// Warning message
showWarning("Your session will expire soon");

// Info message
showInfo("New features available");
```

### Loading States

```typescript
import { showLoading, dismissToast } from "@/lib/utils/errorHandling";

const toastId = showLoading("Updating admin...");

try {
  await updateAdmin(data);
  dismissToast(toastId);
  showSuccess("Admin updated successfully");
} catch (error) {
  dismissToast(toastId);
  handleApiError(error);
}
```

### Error Boundaries

Wrap components with ErrorBoundary to catch runtime errors:

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

Or use the HOC wrapper:

```typescript
import { withErrorBoundary } from "@/components/error-boundary";

const MyComponent = () => {
  // Component code
};

export default withErrorBoundary(MyComponent);
```

## Error Types

### Network Errors

- **Message**: "Unable to connect to server. Please check your internet connection."
- **When**: No response from server

### 401 Unauthorized

- **Message**: "Your session has expired. Please log in again."
- **Action**: Clears token and redirects to login

### 403 Forbidden

- **Message**: "You don't have permission to perform this action."
- **When**: User lacks required permissions

### 400 Validation Errors

- **Message**: Displays specific field errors
- **When**: Request validation fails

### 404 Not Found

- **Message**: "The requested resource was not found."
- **When**: Resource doesn't exist

### 500+ Server Errors

- **Message**: "Something went wrong. Please try again later."
- **When**: Server-side errors

## Global Error Pages

### app/error.tsx

Catches errors in the app directory (client-side errors)

### app/global-error.tsx

Catches errors in the root layout (critical errors)

## Best Practices

1. **Let the interceptor handle API errors**: Don't manually call `handleApiError` unless needed
2. **Use specific toast functions**: Use `showSuccess`, `showError`, etc. for non-API messages
3. **Wrap critical components**: Use ErrorBoundary for components that might throw errors
4. **Log errors in production**: Consider adding error logging service integration
5. **Provide context**: Include helpful error messages that guide users to solutions
