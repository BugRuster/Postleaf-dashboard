"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAdminById, type Admin } from "@/lib/api/admins";
import { getUser } from "@/lib/auth/token";
import { canAccessAdminManagement } from "@/lib/auth/permissions";
import { AdminDetailsForm } from "@/components/admins/AdminDetailsForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSidebar } from "@/app/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AdminDetailsPage() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check permissions
  useEffect(() => {
    const user = getUser();
    if (!user || user.role === "user" || !canAccessAdminManagement(user.role as "admin" | "super_admin")) {
      router.push("/dashboard");
    }
  }, [router]);

  // Fetch admin details
  const fetchAdmin = async () => {
    console.log("calling, fetch admin");
    setLoading(true);
    setError(null);
    try {
      const adminData = await getAdminById(userId);
      console.log("fetched admin, ", adminData);
      setAdmin(adminData);
    } catch (err) {
      console.error("Failed to fetch admin details:", err);
      setError("Failed to load admin details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAdmin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleUpdate = () => {
    // Refresh admin data after update
    fetchAdmin();
  };

  console.log("admin, ", admin);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Admin Details"
          onMenuClick={toggleSidebar}
          actions={
            <Link href="/dashboard/admins">
              <Button variant="outline">Back to List</Button>
            </Link>
          }
        />
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error || "Admin not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Details"
        description={`Manage settings for @${admin.username}`}
        onMenuClick={toggleSidebar}
        actions={
          <Link href="/dashboard/admins">
            <Button variant="outline">Back to List</Button>
          </Link>
        }
      />

      <AdminDetailsForm admin={admin} onUpdate={handleUpdate} />
    </div>
  );
}
