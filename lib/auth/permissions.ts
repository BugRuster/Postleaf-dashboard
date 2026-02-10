/**
 * Permission Checking Utilities
 * Provides role-based access control functions
 */

export type UserRole = "admin" | "super_admin";

export interface UserWithRole {
  role: UserRole;
}

/**
 * Checks if a user can access admin management features
 * Only super_admins can manage other admins
 * @param role - The user's role
 * @returns True if the user can access admin management, false otherwise
 */
export function canAccessAdminManagement(role: UserRole): boolean {
  return role === "super_admin";
}

/**
 * Checks if a user can access user tick management features
 * Only super_admins can manage user ticks
 * @param role - The user's role
 * @returns True if the user can access user tick management, false otherwise
 */
export function canAccessUserTicks(role: UserRole): boolean {
  return role === "super_admin";
}

/**
 * Checks if a user can access reports management
 * Only super_admins can access reports
 * @param role - The user's role
 * @returns True if the user can access reports, false otherwise
 */
export function canAccessReports(role: UserRole): boolean {
  return role === "super_admin";
}

/**
 * Checks if a user can access advertisement management
 * Only regular admins can manage advertisements (not super_admins)
 * @param role - The user's role
 * @returns True if the user can access advertisement management, false otherwise
 */
export function canAccessAdvertisements(role: UserRole): boolean {
  return role === "admin";
}

/**
 * Checks if a user can access analytics
 * Only regular admins can view analytics (not super_admins)
 * @param role - The user's role
 * @returns True if the user can access analytics, false otherwise
 */
export function canAccessAnalytics(role: UserRole): boolean {
  return role === "admin";
}

/**
 * Checks if a user can access the dashboard home
 * Both admins and super_admins can access the dashboard
 * @param role - The user's role
 * @returns True if the user can access the dashboard, false otherwise
 */
export function canAccessDashboard(role: UserRole): boolean {
  return role === "admin" || role === "super_admin";
}

/**
 * Gets all accessible routes for a given role
 * @param role - The user's role
 * @returns Array of route paths the user can access
 */
export function getAccessibleRoutes(role: UserRole): string[] {
  const routes: string[] = [];

  if (canAccessDashboard(role)) {
    routes.push("/dashboard");
  }

  if (canAccessReports(role)) {
    routes.push("/reports");
  }

  if (canAccessAdvertisements(role)) {
    routes.push("/ads");
  }

  if (canAccessAnalytics(role)) {
    routes.push("/analytics");
  }

  if (canAccessAdminManagement(role)) {
    routes.push("/admins");
  }

  if (canAccessUserTicks(role)) {
    routes.push("/users/ticks");
  }

  return routes;
}
