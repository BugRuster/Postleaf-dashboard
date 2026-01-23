"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import type { AnalyticsData } from "@/lib/api/analytics"

interface AnalyticsOverviewProps {
  data: AnalyticsData | null
  loading?: boolean
}

export function AnalyticsOverview({ data, loading }: AnalyticsOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  if (!data || !data.posts || !data.cuts || !data.events) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">No analytics data available</p>
      </div>
    )
  }

  // Prepare chart data
  const chartData = [
    {
      contentType: "Posts",
      total: data.posts.total || 0,
      active: data.posts.active || 0,
      views: data.posts.totalViews || 0,
      engagement: data.posts.averageEngagement || 0,
    },
    {
      contentType: "Cuts",
      total: data.cuts.total || 0,
      active: data.cuts.active || 0,
      views: data.cuts.totalViews || 0,
      engagement: data.cuts.averageEngagement || 0,
    },
    {
      contentType: "Events",
      total: data.events.total || 0,
      active: data.events.active || 0,
      views: data.events.totalViews || 0,
      engagement: data.events.averageEngagement || 0,
    },
  ]

  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
    active: {
      label: "Active",
      color: "hsl(var(--chart-2))",
    },
    views: {
      label: "Views",
      color: "hsl(var(--chart-3))",
    },
    engagement: {
      label: "Avg Engagement",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>Post analytics summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-medium">{data.posts.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active:</span>
              <span className="font-medium">{data.posts.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Views:</span>
              <span className="font-medium">{(data.posts.totalViews || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Likes:</span>
              <span className="font-medium">{(data.posts.totalLikes || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg Engagement:</span>
              <span className="font-medium">{(data.posts.averageEngagement || 0).toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cuts</CardTitle>
            <CardDescription>Cut analytics summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-medium">{data.cuts.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active:</span>
              <span className="font-medium">{data.cuts.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Views:</span>
              <span className="font-medium">{(data.cuts.totalViews || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Likes:</span>
              <span className="font-medium">{(data.cuts.totalLikes || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg Engagement:</span>
              <span className="font-medium">{(data.cuts.averageEngagement || 0).toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>Event analytics summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-medium">{data.events.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active:</span>
              <span className="font-medium">{data.events.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Views:</span>
              <span className="font-medium">{(data.events.totalViews || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Likes:</span>
              <span className="font-medium">{(data.events.totalLikes || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg Engagement:</span>
              <span className="font-medium">{(data.events.averageEngagement || 0).toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Content Comparison</CardTitle>
          <CardDescription>Compare metrics across content types</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="contentType" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              <Bar dataKey="active" fill="var(--color-active)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
          <CardDescription>Views and engagement by content type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="contentType" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="var(--color-views)" radius={4} />
              <Bar dataKey="engagement" fill="var(--color-engagement)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
