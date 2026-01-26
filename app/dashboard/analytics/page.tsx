"use client"

import { useEffect, useState } from "react"
import { getAnalytics, type AnalyticsData } from "@/lib/api/analytics"
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { useSidebar } from "@/app/dashboard/layout"

export default function AnalyticsPage() {
  const { toggleSidebar } = useSidebar()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAnalytics()
        setAnalyticsData(data)
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
        setError('Failed to load analytics data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div>
      <PageHeader
        title="Analytics"
        onMenuClick={toggleSidebar}
      />
      
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <AnalyticsOverview data={analyticsData} loading={loading} />
    </div>
  )
}
