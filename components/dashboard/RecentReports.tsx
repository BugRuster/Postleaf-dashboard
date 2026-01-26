/**
 * RecentReports Component
 * Displays the latest 5 reports for super admin dashboard
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Flag } from "@phosphor-icons/react"
import Link from "next/link"
import type { Report } from "@/lib/api/reports"

interface RecentReportsProps {
  reports: Report[]
  loading?: boolean
}

export function RecentReports({ reports, loading = false }: RecentReportsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" weight="fill" />
            Recent Reports
          </CardTitle>
          <CardDescription>Latest 5 reports requiring attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" weight="fill" />
            Recent Reports
          </CardTitle>
          <CardDescription>Latest 5 reports requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Flag className="h-12 w-12 text-muted-foreground mb-4" weight="light" />
            <p className="text-sm text-muted-foreground">No reports found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
      case 'resolved':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      case 'dismissed':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
      case 'cut':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
      case 'event':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
      case 'user':
        return 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" weight="fill" />
          Recent Reports
        </CardTitle>
        <CardDescription>Latest 5 pending reports requiring attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/dashboard/reports?reportId=${report.id}`}
            className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getContentTypeColor(report.contentType)}>
                    {report.contentType}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium line-clamp-2">{report.reason}</p>
                <p className="text-xs text-muted-foreground">
                  By {report.reportedBy} • {new Date(report.reportedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
        <Link
          href="/dashboard/reports"
          className="block text-center text-sm text-primary hover:underline pt-2 font-medium"
        >
          View all reports →
        </Link>
      </CardContent>
    </Card>
  )
}
