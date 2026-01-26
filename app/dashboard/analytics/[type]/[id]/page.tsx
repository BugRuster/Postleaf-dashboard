"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getContentAnalytics, type ContentAnalyticsData } from "@/lib/api/analytics"
import { ContentAnalytics } from "@/components/analytics/ContentAnalytics"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { useSidebar } from "@/app/dashboard/layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@phosphor-icons/react"

export default function ContentAnalyticsPage() {
  const { toggleSidebar } = useSidebar()
  const params = useParams()
  const router = useRouter()
  const contentType = params.type as 'post' | 'cut' | 'event'
  const contentId = params.id as string

  const [analyticsData, setAnalyticsData] = useState<ContentAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Validate content type
    if (!['post', 'cut', 'event'].includes(contentType)) {
      setError('Invalid content type. Must be post, cut, or event.')
      setLoading(false)
      return
    }

    const fetchContentAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getContentAnalytics(contentType, contentId)
        setAnalyticsData(data)
      } catch (err) {
        console.error('Failed to fetch content analytics:', err)
        setError('Failed to load analytics data for this content. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchContentAnalytics()
  }, [contentType, contentId])

  return (
    <div>
      <PageHeader
        title={`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Analytics`}
        onMenuClick={toggleSidebar}
        actions={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" weight="bold" />
          </Button>
        }
      />
      
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <ContentAnalytics data={analyticsData} loading={loading} />
    </div>
  )
}
