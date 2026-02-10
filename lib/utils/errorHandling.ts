/**
 * Error Handling Utilities
 * Centralized error handling and display functions
 */

import { AxiosError } from "axios";
import { toast } from "sonner";

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API Error response interface
 */
export interface ApiErrorResponse {
  message?: string;
  errors?: ValidationError[];
  error?: string;
}

/**
 * Handle network errors (no response from server)
 */
export function handleNetworkError(): void {
  toast.error(
    "Unable to connect to server. Please check your internet connection.",
  );
}

/**
 * Handle unauthorized errors (401)
 * Note: Token clearing and redirect is handled by API client interceptor
 */
export function handleUnauthorized(): void {
  toast.error("Your session has expired. Please log in again.");
}

/**
 * Handle forbidden errors (403)
 */
export function handleForbidden(): void {
  toast.error("You don't have permission to perform this action.");
}

/**
 * Handle validation errors (400)
 * @param errors - Array of validation errors
 * @returns Formatted error message
 */
export function handleValidationError(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return "Validation failed. Please check your input.";
  }

  if (errors.length === 1) {
    return errors[0].message;
  }

  // Multiple validation errors
  const errorMessages = errors
    .map((err) => `${err.field}: ${err.message}`)
    .join(", ");
  toast.error(`Validation errors: ${errorMessages}`);
  return errorMessages;
}

/**
 * Handle server errors (500+)
 * @param error - The error object
 */
export function handleServerError(error: Error): void {
  console.error("Server error:", error);
  toast.error("Something went wrong. Please try again later.");
}

/**
 * Generic API error handler
 * Routes errors to appropriate handlers based on status code
 * @param error - Axios error object
 */
export function handleApiError(error: unknown): void {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as ApiErrorResponse;

      switch (status) {
        case 401:
          handleUnauthorized();
          break;

        case 403:
          handleForbidden();
          break;

        case 400:
          if (data.errors && Array.isArray(data.errors)) {
            handleValidationError(data.errors);
          } else {
            toast.error(
              data.message ||
                data.error ||
                "Invalid request. Please check your input.",
            );
          }
          break;

        case 404:
          toast.error(data.message || "The requested resource was not found.");
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          handleServerError(new Error(data.message || "Server error"));
          break;

        default:
          toast.error(
            data.message || data.error || "An unexpected error occurred.",
          );
      }
    } else if (error.request) {
      // Network error - no response received
      handleNetworkError();
    } else {
      // Other errors
      toast.error(error.message || "An unexpected error occurred.");
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred.");
  }
}

/**
 * Display a success message
 * @param message - Success message to display
 */
export function showSuccess(message: string): void {
  toast.success(message);
}

/**
 * Display an info message
 * @param message - Info message to display
 */
export function showInfo(message: string): void {
  toast.info(message);
}

/**
 * Display a warning message
 * @param message - Warning message to display
 */
export function showWarning(message: string): void {
  toast.warning(message);
}

/**
 * Display an error message
 * @param message - Error message to display
 */
export function showError(message: string): void {
  toast.error(message);
}

/**
 * Display a loading message
 * @param message - Loading message to display
 * @returns Toast ID for dismissal
 */
export function showLoading(message: string): string | number {
  return toast.loading(message);
}

/**
 * Dismiss a toast by ID
 * @param toastId - Toast ID to dismiss
 */
export function dismissToast(toastId: string | number): void {
  toast.dismiss(toastId);
}
