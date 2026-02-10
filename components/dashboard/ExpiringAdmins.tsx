/**
 * ExpiringAdmins Component
 * Displays admins whose validity is expiring soon
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Users } from "@phosphor-icons/react";
import Link from "next/link";
import type { Admin } from "@/lib/api/admins";

interface ExpiringAdminsProps {
  admins: Admin[];
  loading?: boolean;
}

export function ExpiringAdmins({
  admins,
  loading = false,
}: ExpiringAdminsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" weight="fill" />
            Expiring Admins
          </CardTitle>
          <CardDescription>Admins with validity expiring soon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (admins.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" weight="fill" />
            Expiring Admins
          </CardTitle>
          <CardDescription>Admins with validity expiring soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users
              className="h-12 w-12 text-muted-foreground mb-4"
              weight="light"
            />
            <p className="text-sm text-muted-foreground">
              No admins expiring soon
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getValidityColor = (days: number | undefined) => {
    if (!days)
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    if (days <= 7)
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    if (days <= 30)
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" weight="fill" />
          Expiring Admins
        </CardTitle>
        <CardDescription>Admins with validity expiring soon</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {admins.map((admin) => (
          <Link
            key={admin._id}
            href={`/dashboard/admins?adminId=${admin._id}`}
            className="flex items-center justify-between border-b pb-4 last:border-0 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-md transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {admin.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">{admin.username}</p>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={getValidityColor(admin.adminValidity)}
            >
              {admin.adminValidity ? `${admin.adminValidity} days` : "Expired"}
            </Badge>
          </Link>
        ))}
        <Link
          href="/dashboard/admins"
          className="block text-center text-sm text-primary hover:underline pt-2"
        >
          View all admins →
        </Link>
      </CardContent>
    </Card>
  );
}
