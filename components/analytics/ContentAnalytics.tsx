"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { IoCalendarOutline } from "react-icons/io5"
import { Eye, Heart, ChatCircle, Users } from "@phosphor-icons/react"
import type { ContentAnalyticsData } from "@/lib/api/analytics"
import Image from "next/image"

interface ContentAnalyticsProps {
  data: ContentAnalyticsData | null
  loading?: boolean
}

export function ContentAnalytics({ data, loading }: ContentAnalyticsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[140px]" />
          <Skeleton className="h-[140px]" />
          <Skeleton className="h-[140px]" />
          <Skeleton className="h-[140px]" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4">
        <p className="text-sm text-red-800 dark:text-red-200">No analytics data available for this content</p>
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

  const engagementRate = data.views > 0 
    ? data.type === 'event' 
      ? ((data.registrations || 0) / data.views * 100).toFixed(2) // For events, use registrations
      : (((data.likes + data.comments) / data.views) * 100).toFixed(2) // For posts/cuts, use likes + comments
    : '0.00'

  return (
    <div className="space-y-6">
      {/* Content Preview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-2xl">{data.title}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {data.type}
                </Badge>
                {data.isAd && (
                  <Badge variant="secondary">
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
        <CardContent className="space-y-4">
          {/* Media Preview */}
          {(data.imageUrl || data.mediaUrl) && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted">
              {data.type === 'cut' && data.mediaUrl ? (
                <video
                  src={data.mediaUrl}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                />
              ) : (
                <Image
                  src={data.imageUrl || data.mediaUrl || ''}
                  alt={data.title}
                  fill
                  className="object-contain"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
            </div>
          )}
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <IoCalendarOutline className="h-4 w-4" />
              <span>Created: {formatDate(data.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {data.type === 'event' ? 'Registration' : 'Engagement'} Rate: {engagementRate}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total views</p>
          </CardContent>
        </Card>

        {data.type !== 'event' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Likes</CardTitle>
                <Heart className="h-5 w-5 text-muted-foreground" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.likes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Total likes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <ChatCircle className="h-5 w-5 text-muted-foreground" weight="fill" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.comments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Total comments</p>
              </CardContent>
            </Card>
          </>
        )}

        {data.type === 'event' && data.registrations !== undefined && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registrations</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" weight="fill" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.registrations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Engagement Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Summary</CardTitle>
          <CardDescription>Overall performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.type !== 'event' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Interactions</span>
                  <span className="text-2xl font-bold">
                    {(data.likes + data.comments).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Engagement Rate</span>
                  <span className="text-2xl font-bold">{engagementRate}%</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Registrations</span>
                  <span className="text-2xl font-bold">
                    {(data.registrations || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Registration Rate</span>
                  <span className="text-2xl font-bold">{engagementRate}%</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
