"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAdmins,
  promoteUser,
  demoteAdmin,
  type Admin,
  type PaginatedResponse,
} from "@/lib/api/admins";
import { getUser } from "@/lib/auth/token";
import { canAccessAdminManagement } from "@/lib/auth/permissions";
import { AdminList } from "@/components/admins/AdminList";
import { UserSelectionModal } from "@/components/admins/UserSelectionModal";
import { Button } from "@/components/ui/button";

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check permissions
  useEffect(() => {
    const user = getUser();
    if (!user || !canAccessAdminManagement(user.role)) {
      router.push("/dashboard");
    }
  }, [router]);

  // Fetch admins
  const fetchAdmins = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Admin> = await getAdmins({
        page,
        limit: 10,
      });
      setAdmins(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setError("Failed to load admins. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePromote = async (userId: string) => {
    try {
      await promoteUser(userId);
      // Refresh the list
      await fetchAdmins(currentPage);
    } catch (err) {
      console.error("Failed to promote user:", err);
      setError("Failed to promote user. Please try again.");
    }
  };

  const handleDemote = async (userId: string) => {
    try {
      await demoteAdmin(userId);
      // Refresh the list
      await fetchAdmins(currentPage);
    } catch (err) {
      console.error("Failed to demote admin:", err);
      setError("Failed to demote admin. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Management
          </h1>
          <p className="text-muted-foreground">
            Manage administrators and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchAdmins(currentPage)}>
            Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Create Admin</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      <AdminList
        admins={admins}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDemote={handleDemote}
        loading={loading}
      />

      <UserSelectionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onPromote={handlePromote}
      />
    </div>
  );
}
