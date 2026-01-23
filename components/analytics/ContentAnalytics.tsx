"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Area, AreaChart } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { ContentAnalyticsData } from "@/lib/api/analytics"

interface ContentAnalyticsProps {
  data: ContentAnalyticsData | null
  loading?: boolean
}

export function ContentAnalytics({ data, loading }: ContentAnalyticsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[150px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  if (!data || !data.timeline) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">No analytics data available for this content</p>
      </div>
    )
  }

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--chart-1))",
    },
    likes: {
      label: "Likes",
      color: "hsl(var(--chart-2))",
    },
    shares: {
      label: "Shares",
      color: "hsl(var(--chart-3))",
    },
    comments: {
      label: "Comments",
      color: "hsl(var(--chart-4))",
    },
    engagement: {
      label: "Engagement",
      color: "hsl(var(--chart-5))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Content Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>
                Detailed metrics for {data.contentType} #{data.contentId}
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {data.contentType}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Views</CardDescription>
            <CardTitle className="text-3xl">{(data.views || 0).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Likes</CardDescription>
            <CardTitle className="text-3xl">{(data.likes || 0).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Shares</CardDescription>
            <CardTitle className="text-3xl">{(data.shares || 0).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Comments</CardDescription>
            <CardTitle className="text-3xl">{(data.comments || 0).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Engagement Rate</CardDescription>
            <CardTitle className="text-3xl">{(data.engagementRate || 0).toFixed(2)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Timeline Chart - Views */}
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
          <CardDescription>Daily view count timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <AreaChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="var(--color-views)" 
                fill="var(--color-views)" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Timeline Chart - Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics Over Time</CardTitle>
          <CardDescription>Daily engagement breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <LineChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="var(--color-likes)" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="shares" 
                stroke="var(--color-shares)" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="comments" 
                stroke="var(--color-comments)" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Timeline Chart - Engagement Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Rate Over Time</CardTitle>
          <CardDescription>Daily engagement rate percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <AreaChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="var(--color-engagement)" 
                fill="var(--color-engagement)" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
