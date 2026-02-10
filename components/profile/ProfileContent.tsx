"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as PhosphorUser,
  Envelope,
  Shield,
  Coins,
  Calendar,
  SignOut,
} from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSidebar } from "@/app/dashboard/layout";
import { getUser, removeToken } from "@/lib/auth/token";
import { getAdminStatus } from "@/lib/api/admins";
import type { User as AuthUser } from "@/lib/api/auth";
import type { AdminStatus } from "@/lib/types";
import { toast } from "sonner";

export function ProfileContent() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminStatusLoading, setAdminStatusLoading] = useState(false);
  const [adminStatusError, setAdminStatusError] = useState<string | null>(null);

  // Calculate remaining time from expiry date
  const calculateRemainingTime = (expiryTime: string | null) => {
    if (!expiryTime) {
      return { expired: true, days: 0, hours: 0, minutes: 0 };
    }

    const now = new Date().getTime();
    const expiry = new Date(expiryTime).getTime();
    const diff = expiry - now;

    if (diff <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { expired: false, days, hours, minutes };
  };

  const remainingTime = adminStatus?.adminExpiryTime
    ? calculateRemainingTime(adminStatus.adminExpiryTime)
    : { expired: true, days: 0, hours: 0, minutes: 0 };

  useEffect(() => {
    async function loadProfile() {
      try {
        // Get user from token using the helper function
        const userData = getUser();

        if (!userData) {
          router.push("/login");
          return;
        }

        setUser(userData);

        // Fetch admin status only for admins (not super_admins)
        if (userData.role === "admin") {
          setAdminStatusLoading(true);
          setAdminStatusError(null);
          try {
            const status = await getAdminStatus(userData._id);
            setAdminStatus(status);
          } catch (error) {
            console.error("Failed to fetch admin status:", error);
            setAdminStatusError("Failed to load admin status");
            toast.error("Failed to load admin status");
          } finally {
            setAdminStatusLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Failed to load profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName =
    `${user.first_name} ${user.last_name}`.trim() || user.username;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <PageHeader
        title="Profile"
        description="Manage your account information"
        onMenuClick={toggleSidebar}
      />

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <PhosphorUser className="mt-1 size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base">{fullName}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <PhosphorUser className="mt-1 size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Username
              </p>
              <p className="text-base">@{user.username}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Envelope className="mt-1 size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{user.email}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Shield className="mt-1 size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <div className="mt-1">
                <Badge
                  variant={
                    user.role === "super_admin" ? "default" : "secondary"
                  }
                >
                  {user.role === "super_admin" ? "Super Admin" : "Admin"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Status - Only for regular admins */}
      {user.role === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Status</CardTitle>
            <CardDescription>Your admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminStatusLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : adminStatusError ? (
              <div className="rounded-md bg-destructive/15 p-4 text-destructive">
                {adminStatusError}
              </div>
            ) : adminStatus ? (
              <>
                <div className="flex items-start gap-3">
                  <Coins className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Allocated Credits
                    </p>
                    <p className="text-2xl font-bold">
                      {adminStatus.allocated_credits}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total credits allocated
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Coins className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Available Credits
                    </p>
                    <p className="text-2xl font-bold">
                      {adminStatus.available_credits}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Credits available for advertisements
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Validity
                    </p>
                    {remainingTime.expired ? (
                      <p className="text-sm text-destructive">
                        No time remaining
                      </p>
                    ) : (
                      <div className="mt-2 flex gap-3">
                        <div className="flex flex-col items-center rounded-md bg-muted px-3 py-2">
                          <span className="text-2xl font-bold">
                            {remainingTime.days}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            days
                          </span>
                        </div>
                        <div className="flex flex-col items-center rounded-md bg-muted px-3 py-2">
                          <span className="text-2xl font-bold">
                            {remainingTime.hours}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            hrs
                          </span>
                        </div>
                        <div className="flex flex-col items-center rounded-md bg-muted px-3 py-2">
                          <span className="text-2xl font-bold">
                            {remainingTime.minutes}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            mins
                          </span>
                        </div>
                      </div>
                    )}
                    {adminStatus.adminExpiryTime && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Expires:{" "}
                        {new Date(adminStatus.adminExpiryTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Shield className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Advertisements
                    </p>
                    <p className="text-2xl font-bold">
                      {adminStatus.activeAds?.total ?? 0}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>Posts: {adminStatus.activeAds?.posts ?? 0}</p>
                      <p>Cuts: {adminStatus.activeAds?.cuts ?? 0}</p>
                      <p>Events: {adminStatus.activeAds?.events ?? 0}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No admin status data available
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Logout Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your session</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full gap-2 sm:w-auto"
            onClick={handleLogout}
          >
            <SignOut className="size-5" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
