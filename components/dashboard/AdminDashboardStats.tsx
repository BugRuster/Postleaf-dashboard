/**
 * AdminDashboardStats Component
 * Quick stats cards for regular admin dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Coins, Clock, ChartBar } from "@phosphor-icons/react";
import Link from "next/link";
import type { AdminStatus } from "@/lib/api/admins";

interface AdminDashboardStatsProps {
  adminStatus: AdminStatus | null;
  loading?: boolean;
}

export function AdminDashboardStats({
  adminStatus,
  loading = false,
}: AdminDashboardStatsProps) {
  const stats = [
    {
      title: "Active Ads",
      value: adminStatus?.activeAds?.total ?? 0,
      subtitle: `${adminStatus?.activeAds?.posts ?? 0} posts, ${adminStatus?.activeAds?.cuts ?? 0} cuts, ${adminStatus?.activeAds?.events ?? 0} events`,
      icon: Megaphone,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      link: "/dashboard/ads",
    },
    {
      title: "Available Credits",
      value: adminStatus?.available_credits ?? 0,
      subtitle: `${adminStatus?.allocated_credits ?? 0} allocated`,
      icon: Coins,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      link: null,
    },
    {
      title: "Validity",
      value: adminStatus?.adminValidity
        ? `${adminStatus.adminValidity} days`
        : "Expired",
      subtitle: adminStatus?.adminExpiryTime
        ? `Until ${new Date(adminStatus.adminExpiryTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : "No expiry set",
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
      link: null,
    },
    {
      title: "Analytics",
      value: "View Stats",
      subtitle: "Check your content performance",
      icon: ChartBar,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      link: "/dashboard/analytics",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const CardWrapper = stat.link ? Link : "div";
        const cardProps = stat.link ? { href: stat.link } : ({} as any);

        return (
          <CardWrapper key={stat.title} {...cardProps}>
            <Card
              className={
                stat.link
                  ? "cursor-pointer hover:bg-muted/50 transition-colors"
                  : ""
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-md`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} weight="fill" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtitle}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </CardWrapper>
        );
      })}
    </div>
  );
}
