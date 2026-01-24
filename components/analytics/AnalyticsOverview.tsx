"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, Scissors, CalendarBlank } from "@phosphor-icons/react/dist/ssr"
import type { AnalyticsData } from "@/lib/api/analytics"
import Link from "next/link"

interface AnalyticsOverviewProps {
  data: AnalyticsData | null
  loading?: boolean
}

export function AnalyticsOverview({ data, loading }: AnalyticsOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-[140px]" />
          <Skeleton className="h-[140px]" />
          <Skeleton className="h-[140px]" />
          <Skeleton className="h-[140px]" />
        </div>
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  if (!data) {
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
      count: data.posts.count || 0,
      views: data.posts.views || 0,
    },
    {
      contentType: "Cuts",
      count: data.cuts.count || 0,
      views: data.cuts.views || 0,
    },
    {
      contentType: "Events",
      count: data.events.count || 0,
      views: data.events.views || 0,
    },
  ]

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
    views: {
      label: "Views",
      color: "hsl(var(--chart-2))",
    },
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <FileText className="h-4 w-4" />
      case 'cut':
        return <Scissors className="h-4 w-4" />
      case 'event':
        return <CalendarBlank className="h-4 w-4" />
      default:
        return null
    }
  }

  const getContentBadgeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'default'
      case 'cut':
        return 'secondary'
      case 'event':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.posts.count}</div>
            <p className="text-xs text-muted-foreground mt-1">{data.posts.views.toLocaleString()} views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuts</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cuts.count}</div>
            <p className="text-xs text-muted-foreground mt-1">{data.cuts.views.toLocaleString()} views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <CalendarBlank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.events.count}</div>
            <p className="text-xs text-muted-foreground mt-1">{data.events.views.toLocaleString()} views</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Content Overview</CardTitle>
          <CardDescription>Content count and views by type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="contentType" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              <Bar dataKey="views" fill="var(--color-views)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Content</CardTitle>
          <CardDescription>Most viewed content across all types</CardDescription>
        </CardHeader>
        <CardContent>
          {data.topContent && data.topContent.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topContent.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <Badge variant={getContentBadgeColor(content.type)} className="flex items-center gap-1 w-fit">
                        {getContentIcon(content.type)}
                        <span className="capitalize">{content.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-md truncate">
                      {content.title}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {content.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link 
                        href={`/dashboard/analytics/${content.type}/${content.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No content data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
