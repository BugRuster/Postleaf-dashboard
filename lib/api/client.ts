/**
 * Axios API Client Configuration
 * Handles HTTP requests with JWT token injection and error handling
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, removeToken } from "@/lib/auth/token";
import { handleApiError } from "@/lib/utils/errorHandling";

/**
 * API Error interface for typed error handling
 */
export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

/**
 * Create and configure the Axios client instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 
  
  "http://localhost:8080/api/v1",

  // "https://backend.postleaf.live/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to inject JWT token into headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor to handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 errors specially - clear token and redirect
    if (error.response?.status === 401) {
      removeToken();
      // Only redirect if not already on the login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Use centralized error handler for displaying messages
    handleApiError(error);

    return Promise.reject(error);
  },
);

export default apiClient;
