import { z } from "zod";

/**
 * Validation schemas for all forms in the admin dashboard
 * Uses Zod for type-safe validation with react-hook-form
 */

// ============================================================================
// Authentication Schemas
// ============================================================================

/**
 * Login form validation schema
 * Validates username/email and password fields
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Username or email is required")
    .refine(
      (value) => {
        // If it contains @, validate as email
        if (value.includes("@")) {
          return z.string().email().safeParse(value).success;
        }
        // Otherwise, validate as username (alphanumeric, underscore, hyphen)
        return /^[a-zA-Z0-9_-]+$/.test(value);
      },
      {
        message: "Please enter a valid email or username",
      },
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// Admin Management Schemas
// ============================================================================

/**
 * Admin validity update schema
 * Validates validity period in days (positive number, max 30)
 */
export const validitySchema = z.object({
  validity: z
    .number({
      required_error: "Validity period is required",
      invalid_type_error: "Validity must be a number",
    })
    .int("Validity must be a whole number")
    .positive("Validity must be a positive number")
    .max(30, "Validity cannot exceed 30 days"),
});

export type ValidityFormData = z.infer<typeof validitySchema>;

/**
 * Admin credits update schema
 * Validates credit amount (positive number)
 */
export const creditsSchema = z.object({
  credits: z
    .number({
      required_error: "Credits is required",
      invalid_type_error: "Credits must be a number",
    })
    .int("Credits must be a whole number")
    .min(0, "Credits must be a positive number"),
});

export type CreditsFormData = z.infer<typeof creditsSchema>;

// ============================================================================
// Advertisement Management Schemas
// ============================================================================

/**
 * Create advertisement schema
 * Validates ad creation fields
 */
export const createAdSchema = z
  .object({
    contentId: z.string().min(1, "Content ID is required"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine(
        (value) => {
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        {
          message: "Please enter a valid date",
        },
      ),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine(
        (value) => {
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        {
          message: "Please enter a valid date",
        },
      ),
    budget: z
      .number({
        required_error: "Budget is required",
        invalid_type_error: "Budget must be a number",
      })
      .min(0, "Budget must be a positive number"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type CreateAdFormData = z.infer<typeof createAdSchema>;

/**
 * Update advertisement schema
 * Validates ad update fields (all optional)
 */
export const updateAdSchema = z.object({
  startDate: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "Please enter a valid date",
      },
    ),
  endDate: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "Please enter a valid date",
      },
    ),
  budget: z
    .number({
      invalid_type_error: "Budget must be a number",
    })
    .min(0, "Budget must be a positive number")
    .optional(),
  status: z.enum(["active", "paused"]).optional(),
});

export type UpdateAdFormData = z.infer<typeof updateAdSchema>;

// ============================================================================
// User Management Schemas
// ============================================================================

/**
 * User search schema
 * Validates search query
 */
export const userSearchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .min(2, "Search query must be at least 2 characters"),
});

export type UserSearchFormData = z.infer<typeof userSearchSchema>;

/**
 * Update user tick schema
 * Validates tick type assignment
 */
export const updateTickSchema = z.object({
  tick: z.enum(["blue", "golden", "none"], {
    required_error: "Please select a tick type",
  }),
});

export type UpdateTickFormData = z.infer<typeof updateTickSchema>;

// ============================================================================
// Report Management Schemas
// ============================================================================

/**
 * Report filters schema
 * Validates report filter fields
 */
export const reportFiltersSchema = z.object({
  contentType: z.enum(["post", "cut", "event", "user", "all"]).optional(),
  status: z.enum(["pending", "dismissed", "resolved", "all"]).optional(),
});

export type ReportFiltersFormData = z.infer<typeof reportFiltersSchema>;

// ============================================================================
// Generic Validation Helpers
// ============================================================================

/**
 * Email validation regex
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

/**
 * Validates numeric input
 */
export const isValidNumber = (value: unknown): boolean => {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
};

/**
 * Validates required field
 */
export const isRequired = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};
