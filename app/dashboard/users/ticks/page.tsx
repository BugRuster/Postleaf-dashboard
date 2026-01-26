"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  searchUsers,
  getUsersWithTicks,
  updateUserTick,
  type User,
} from "@/lib/api/users";
import { getUser } from "@/lib/auth/token";
import { canAccessUserTicks } from "@/lib/auth/permissions";
import { TickManagement } from "@/components/users/TickManagement";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSidebar } from "@/app/dashboard/layout";

export default function UserTicksPage() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Users with tick tab
  const [tickedUsers, setTickedUsers] = useState<User[]>([]);
  const [tickedUsersPagination, setTickedUsersPagination] = useState({
    page: 1,
    limit: 20,
  });
  const [loadingTickedUsers, setLoadingTickedUsers] = useState(false);

  // Check permissions
  useEffect(() => {
    const user = getUser();
    if (!user || user.role === "user" || !canAccessUserTicks(user.role as "admin" | "super_admin")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await searchUsers(query);
      setUsers(response.results);
    } catch (err) {
      console.error("Failed to search users:", err);
      setError("Failed to search users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFetchTickedUsers = useCallback(
    async (tickType: "blue" | "golden" | "both", page: number) => {
      setLoadingTickedUsers(true);
      setError(null);
      try {
        const response = await getUsersWithTicks(page, 20, tickType);
        setTickedUsers(response.data);
        setTickedUsersPagination(response.pagination);
      } catch (err) {
        console.error("Failed to fetch users with tick:", err);
        setError("Failed to fetch users with tick. Please try again.");
        setTickedUsers([]);
      } finally {
        setLoadingTickedUsers(false);
      }
    },
    [],
  );

  const handleUpdateTick = async (userId: string, tick: 'blue' | 'golden' | null) => {
    setError(null);
    setSuccessMessage(null);

    const currentUser = users.find((u) => u._id === userId)
      ?? tickedUsers.find((u) => u._id === userId);

    try {
      const blueTick = tick === "blue";
      const goldenTick = tick === "golden";
      const response = await updateUserTick(userId, blueTick, goldenTick);

      const updatedUser =
        "data" in response ? (response as { data: User }).data : response;

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, blueTick: updatedUser.blueTick, goldenTick: updatedUser.goldenTick }
            : u
        )
      );

      if (tick === null) {
        setTickedUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        setTickedUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, blueTick: updatedUser.blueTick, goldenTick: updatedUser.goldenTick }
              : u
          )
        );
      }

      setSuccessMessage(
        `Successfully updated tick for ${currentUser?.username ?? "user"}`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update user tick:", err);
      setError("Failed to update user tick. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Tick Management"
        description="Assign or remove verification ticks for users"
        onMenuClick={toggleSidebar}
      />

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-md bg-green-500/15 p-4 text-green-700 dark:text-green-400">
          {successMessage}
        </div>
      )}

      <TickManagement
        onSearch={handleSearch}
        searchResults={users}
        onUpdateTick={handleUpdateTick}
        loading={loading}
        tickedUsers={tickedUsers}
        tickedUsersPagination={tickedUsersPagination}
        onFetchTickedUsers={handleFetchTickedUsers}
        loadingTickedUsers={loadingTickedUsers}
      />
    </div>
  );
}
