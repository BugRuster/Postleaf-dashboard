"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getUser, isAuthenticated, isAdminExpired, logout } from "@/lib/auth/token";
import { ErrorBoundary } from "@/components/error-boundary";

// Create context for sidebar toggle
const SidebarContext = createContext<{
  toggleSidebar: () => void
}>({
  toggleSidebar: () => {}
})

export const useSidebar = () => useContext(SidebarContext)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Compute initial auth state
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    userRole: "admin" | "super_admin";
  }>(() => {
    // Initialize state based on current auth status
    if (typeof window === 'undefined') {
      return { isLoading: true, userRole: "admin" };
    }
    
    if (!isAuthenticated()) {
      return { isLoading: false, userRole: "admin" };
    }

    const currentUser = getUser();
    if (!currentUser || !currentUser.role) {
      return { isLoading: false, userRole: "admin" };
    }

    const role = currentUser.role === "user" ? "admin" : currentUser.role;
    return { 
      isLoading: false, 
      userRole: role as "admin" | "super_admin" 
    };
  });

  useEffect(() => {
    // Check authentication and redirect if needed (client-side only)
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const currentUser = getUser();
    if (!currentUser || !currentUser.role) {
      router.push("/login");
      return;
    }

    // Check if admin status is expired on mount
    if (isAdminExpired()) {
      logout(true);
      return;
    }

    // Set up interval to check admin expiry every 30 seconds
    const checkExpiryInterval = setInterval(() => {
      if (isAdminExpired()) {
        logout(true);
      }
    }, 30000); // Check every 30 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(checkExpiryInterval);
    };
  }, [router]);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarContext.Provider value={{ toggleSidebar: () => setIsMobileSidebarOpen(true) }}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          userRole={authState.userRole} 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
