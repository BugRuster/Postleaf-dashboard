"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getUser, isAuthenticated } from "@/lib/auth/token";
import { ErrorBoundary } from "@/components/error-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Compute auth state directly - will be null on server, actual value on client
  const user =
    typeof window !== "undefined" && isAuthenticated() ? getUser() : null;
  const userRole = (user?.role === "user" ? "admin" : user?.role ?? "admin") as "admin" | "super_admin";
  const isLoading = typeof window === "undefined" || !user;

  useEffect(() => {
    // Check authentication and redirect if needed (client-side only)
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const currentUser = getUser();
    if (!currentUser || !currentUser.role) {
      router.push("/login");
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        suppressHydrationWarning
      >
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" suppressHydrationWarning>
      <Sidebar userRole={userRole} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
