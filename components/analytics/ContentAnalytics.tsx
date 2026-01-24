"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, ChatCircle, CalendarBlank, Megaphone } from "@phosphor-icons/react/dist/ssr"
import type { ContentAnalyticsData } from "@/lib/api/analytics"

interface ContentAnalyticsProps {
  data: ContentAnalyticsData | null
  loading?: boolean
}

export function ContentAnalytics({ data, loading }: ContentAnalyticsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[180px]" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">No analytics data available for this content</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Content Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-2xl capitalize">{data.type} Analytics</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {data.type}
                </Badge>
                {data.isAd && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Megaphone className="h-3 w-3" />
                    Advertisement
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">
                Content ID: {data.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarBlank className="h-4 w-4" />
            <span>Created: {formatDate(data.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <Heart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.likes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total likes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <ChatCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.comments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total comments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
