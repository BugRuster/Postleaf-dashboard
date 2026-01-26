/**
 * SuperAdminStats Component
 * Displays key statistics for super admin dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Flag, UserGear } from "@phosphor-icons/react"

interface SuperAdminStatsProps {
  totalAdmins: number
  totalSuperAdmins: number
  pendingReports: number
  loading?: boolean
}

export function SuperAdminStats({
  totalAdmins,
  totalSuperAdmins,
  pendingReports,
  loading = false,
}: SuperAdminStatsProps) {
  const stats = [
    {
      title: "Regular Admins",
      value: totalAdmins,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Super Admins",
      value: totalSuperAdmins,
      icon: UserGear,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Pending Reports",
      value: pendingReports,
      icon: Flag,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
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
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
