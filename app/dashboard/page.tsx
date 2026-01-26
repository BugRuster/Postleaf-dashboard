"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth/token"
import { getAdminStatus, getAdmins, type AdminStatus, type Admin } from "@/lib/api/admins"
import { getReports, type Report } from "@/lib/api/reports"
import { StatusCharts } from "@/components/dashboard/StatusCharts"
import { RecentReports } from "@/components/dashboard/RecentReports"
import { ExpiringAdmins } from "@/components/dashboard/ExpiringAdmins"
import { SuperAdminStats } from "@/components/dashboard/SuperAdminStats"
import { AdminDashboardStats } from "@/components/dashboard/AdminDashboardStats"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { useSidebar } from "@/app/dashboard/layout"
import type { User } from "@/lib/api/auth"

export default function DashboardPage() {
  const { toggleSidebar } = useSidebar()
  const [user, setUser] = useState<User | null>(null)
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null)
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [expiringAdmins, setExpiringAdmins] = useState<Admin[]>([])
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalSuperAdmins: 0,
    pendingReports: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isSuperAdmin = user?.role === 'super_admin'

  useEffect(() => {
    const userData = getUser()
    setUser(userData)

    const fetchDashboardData = async () => {
      if (!userData?._id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        if (userData.role === 'super_admin') {
          // Fetch super admin dashboard data
          const [reportsData, adminsData] = await Promise.all([
            getReports({ status: 'pending', limit: 5 }),
            getAdmins({ page: 1, limit: 100 }),
          ])

          setRecentReports(reportsData.reports)
          
          // Split admins by role
          const regularAdmins = adminsData.data.filter(admin => admin.role === 'admin')
          const superAdmins = adminsData.data.filter(admin => admin.role === 'super_admin')
          
          // Filter admins expiring in next 30 days (only regular admins)
          const now = new Date()
          const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          
          const expiring = regularAdmins
            .filter((admin) => {
              if (!admin.adminExpiryTime) return false
              const expiryDate = new Date(admin.adminExpiryTime)
              return expiryDate <= thirtyDaysFromNow && expiryDate > now
            })
            .sort((a, b) => {
              const dateA = a.adminExpiryTime ? new Date(a.adminExpiryTime).getTime() : 0
              const dateB = b.adminExpiryTime ? new Date(b.adminExpiryTime).getTime() : 0
              return dateA - dateB
            })
            .slice(0, 5)

          setExpiringAdmins(expiring)

          // Calculate stats
          setStats({
            totalAdmins: regularAdmins.length,
            totalSuperAdmins: superAdmins.length,
            pendingReports: reportsData.total,
          })
        } else {
          // Fetch regular admin dashboard data
          const status = await getAdminStatus(userData._id)
          setAdminStatus(status)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={isSuperAdmin ? 'Manage your platform' : 'Manage your content and advertisements'}
        onMenuClick={toggleSidebar}
      />
      
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {user && (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">
              Welcome back, {user.username}!
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Role:</span>{' '}
                  <span className="capitalize">{user.role.replace('_', ' ')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Super Admin Dashboard */}
          {isSuperAdmin ? (
            <>
              <SuperAdminStats
                totalAdmins={stats.totalAdmins}
                totalSuperAdmins={stats.totalSuperAdmins}
                pendingReports={stats.pendingReports}
                loading={loading}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <RecentReports reports={recentReports} loading={loading} />
                <ExpiringAdmins admins={expiringAdmins} loading={loading} />
              </div>
            </>
          ) : (
            /* Regular Admin Dashboard */
            <>
              <AdminDashboardStats adminStatus={adminStatus} loading={loading} />

              {adminStatus && <StatusCharts data={adminStatus} loading={loading} />}
            </>
          )}
        </div>
      )}
    </div>
  )
}
