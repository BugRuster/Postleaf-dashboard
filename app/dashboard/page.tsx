"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth/token"
import { getAdminStatus, type AdminStatus } from "@/lib/api/admins"
import { StatusCard } from "@/components/dashboard/StatusCard"
import { StatusCharts } from "@/components/dashboard/StatusCharts"
import type { User } from "@/lib/api/auth"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userData = getUser()
    setUser(userData)

    // Fetch admin status
    const fetchAdminStatus = async () => {
      if (!userData?._id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const status = await getAdminStatus(userData._id)
        setAdminStatus(status)
      } catch (err) {
        console.error('Failed to fetch admin status:', err)
        setError('Failed to load admin status. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAdminStatus()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Home</h1>
      
      {user && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Username:</span> {user.username}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Admin Status</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatusCard
                title="Role"
                value={adminStatus?.role || '-'}
                loading={loading}
              />
              <StatusCard
                title="Credits"
                value={adminStatus?.credits || 0}
                loading={loading}
              />
              <StatusCard
                title="Validity"
                value={adminStatus?.validity || '-'}
                loading={loading}
              />
              <StatusCard
                title="Active Ads"
                value={adminStatus?.activeAds || 0}
                loading={loading}
              />
            </div>
          </div>

          {adminStatus && (
            <StatusCharts data={adminStatus} loading={loading} />
          )}
        </div>
      )}
    </div>
  )
}
