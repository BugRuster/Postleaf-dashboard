"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, ChatCircle, TrendUp, FileText, Scissors, CalendarBlank } from "@phosphor-icons/react"
import type { AnalyticsData } from "@/lib/api/analytics"
import Link from "next/link"
import Image from "next/image"

interface AnalyticsOverviewProps {
  data: AnalyticsData | null
  loading?: boolean
}

export function AnalyticsOverview({ data, loading }: AnalyticsOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[140px]" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4">
        <p className="text-sm text-red-800 dark:text-red-200">No analytics data available</p>
      </div>
    )
  }

  // Prepare chart data for content overview
  const contentChartData = [
    {
      contentType: "Posts",
      count: data.posts.count || 0,
      views: data.posts.views || 0,
      likes: data.posts.likes || 0,
      comments: data.posts.comments || 0,
    },
    {
      contentType: "Cuts",
      count: data.cuts.count || 0,
      views: data.cuts.views || 0,
      likes: data.cuts.likes || 0,
      comments: data.cuts.comments || 0,
    },
    {
      contentType: "Events",
      count: data.events.count || 0,
      views: data.events.views || 0,
      registrations: data.events.registrations || 0,
    },
  ]

  // Engagement data
  const engagementData = [
    { name: "Views", value: data.totalViews || 0 },
    { name: "Likes", value: data.totalLikes || 0 },
    { name: "Comments", value: data.totalComments || 0 },
  ]

  const chartConfig = {
    count: {
      label: "Count",
      theme: {
        light: "hsl(220, 70%, 50%)",
        dark: "hsl(220, 70%, 65%)",
      },
    },
    views: {
      label: "Views",
      theme: {
        light: "hsl(200, 70%, 45%)",
        dark: "hsl(200, 70%, 60%)",
      },
    },
    likes: {
      label: "Likes",
      theme: {
        light: "hsl(340, 75%, 50%)",
        dark: "hsl(340, 75%, 65%)",
      },
    },
    comments: {
      label: "Comments",
      theme: {
        light: "hsl(160, 60%, 45%)",
        dark: "hsl(160, 60%, 60%)",
      },
    },
    value: {
      label: "Value",
      theme: {
        light: "hsl(220, 70%, 50%)",
        dark: "hsl(220, 70%, 65%)",
      },
    },
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <FileText className="h-4 w-4" weight="fill" />
      case 'cut':
        return <Scissors className="h-4 w-4" weight="fill" />
      case 'event':
        return <CalendarBlank className="h-4 w-4" weight="fill" />
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.totalViews || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.totalLikes || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <ChatCircle className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.totalComments || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total discussions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendUp className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.engagementRate || 0).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Engagement rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Content Performance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Views, likes, and comments by content type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={contentChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="contentType" 
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="var(--color-views)" radius={4} />
                <Bar dataKey="likes" fill="var(--color-likes)" radius={4} />
                <Bar dataKey="comments" fill="var(--color-comments)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Engagement Overview Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>Total engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.posts.count}</div>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Views:</span>
                <span className="font-medium">{data.posts.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Likes:</span>
                <span className="font-medium">{data.posts.likes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Comments:</span>
                <span className="font-medium">{data.posts.comments.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuts</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cuts.count}</div>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Views:</span>
                <span className="font-medium">{data.cuts.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Likes:</span>
                <span className="font-medium">{data.cuts.likes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Comments:</span>
                <span className="font-medium">{data.cuts.comments.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <CalendarBlank className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.events.count}</div>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Views:</span>
                <span className="font-medium">{data.events.views.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Ads Table */}
      {data.activeAds && data.activeAds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Advertisements</CardTitle>
            <CardDescription>Your currently running ads and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.activeAds.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div className="w-16 h-16 relative rounded overflow-hidden bg-muted">
                        {ad.imageUrl || ad.mediaUrl ? (
                          ad.type === 'cut' || (ad.type === 'post' && (ad as any).content?.type === 'video') ? (
                            <video
                              src={ad.mediaUrl || ad.imageUrl || ''}
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            />
                          ) : (
                            <Image
                              src={ad.imageUrl || ad.mediaUrl || ''}
                              alt={ad.title}
                              fill
                              className="object-cover"
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getContentIcon(ad.type)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getContentBadgeColor(ad.type)} className="flex items-center gap-1 w-fit">
                        {getContentIcon(ad.type)}
                        <span className="capitalize">{ad.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {ad.title}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" weight="fill" />
                        {ad.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {ad.type !== 'event' ? (
                        <div className="flex items-center justify-end gap-1">
                          <Heart className="h-3 w-3 text-muted-foreground" weight="fill" />
                          {ad.likes.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {ad.type !== 'event' ? (
                        <div className="flex items-center justify-end gap-1">
                          <ChatCircle className="h-3 w-3 text-muted-foreground" weight="fill" />
                          {ad.comments.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link 
                        href={`/dashboard/analytics/${ad.type}/${ad.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Top Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>Most viewed content across all types</CardDescription>
        </CardHeader>
        <CardContent>
          {data.topContent && data.topContent.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
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
                      <div className="w-16 h-16 relative rounded overflow-hidden bg-muted">
                        {content.imageUrl || content.mediaUrl ? (
                          content.type === 'cut' || (content.type === 'post' && (content as any).contentType === 'video') ? (
                            <video
                              src={content.mediaUrl || content.imageUrl || ''}
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            />
                          ) : (
                            <Image
                              src={content.imageUrl || content.mediaUrl || ''}
                              alt={content.title}
                              fill
                              className="object-cover"
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getContentIcon(content.type)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getContentBadgeColor(content.type)} className="flex items-center gap-1 w-fit">
                          {getContentIcon(content.type)}
                          <span className="capitalize">{content.type}</span>
                        </Badge>
                        {content.isAd && (
                          <Badge variant="secondary" className="text-xs">Ad</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-md truncate">
                      {content.title}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" weight="fill" />
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
