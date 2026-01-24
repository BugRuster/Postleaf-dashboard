"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  searchUsers,
  updateUserTick,
  type User,
} from "@/lib/api/users";
import { getUser } from "@/lib/auth/token";
import { canAccessUserTicks } from "@/lib/auth/permissions";
import { TickManagement } from "@/components/users/TickManagement";

export default function UserTicksPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleUpdateTick = async (userId: string, tick: 'blue' | 'golden' | null) => {
    setError(null);
    setSuccessMessage(null);
    
    // Find the current user to get their username
    const currentUser = users.find(u => u._id === userId);
    
    try {
      const blueTick = tick === 'blue';
      const goldenTick = tick === 'golden';
      const response = await updateUserTick(userId, blueTick, goldenTick);
      
      // Handle both direct user response and wrapped response
      const updatedUser = 'data' in response ? (response as any).data : response;
      
      // Update the user in the list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, blueTick: updatedUser.blueTick, goldenTick: updatedUser.goldenTick } : user
        )
      );
      
      setSuccessMessage(
        `Successfully updated tick for ${currentUser?.username || 'user'}`
      );
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update user tick:", err);
      setError("Failed to update user tick. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Tick Management
          </h1>
          <p className="text-muted-foreground">
            Assign or remove verification ticks for users
          </p>
        </div>
      </div>

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
      />
    </div>
  );
}
