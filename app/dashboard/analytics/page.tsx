"use client"

import { useEffect, useState } from "react"
import { getAnalytics, type AnalyticsData } from "@/lib/api/analytics"
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview"

export default function AnalyticsPage() {
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
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <AnalyticsOverview data={analyticsData} loading={loading} />
    </div>
  )
}
