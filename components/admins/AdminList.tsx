"use client"

import { useState } from "react"
import { Admin } from "@/lib/api/admins"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface AdminListProps {
  admins: Admin[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPromote: (userId: string) => Promise<void>
  onDemote: (adminId: string) => Promise<void>
  loading?: boolean
}

export function AdminList({
  admins,
  currentPage,
  totalPages,
  onPageChange,
  onPromote,
  onDemote,
  loading = false,
}: AdminListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handlePromote = async (userId: string) => {
    setActionLoading(userId)
    try {
      await onPromote(userId)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDemote = async (adminId: string) => {
    setActionLoading(adminId)
    try {
      await onDemote(adminId)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Active Ads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === "super_admin" ? "default" : "secondary"}>
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{admin.credits}</TableCell>
                  <TableCell>{admin.validity}</TableCell>
                  <TableCell>{admin.activeAds}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/dashboard/admins/${admin.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    {admin.role === "admin" ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handlePromote(admin.id)}
                        disabled={actionLoading === admin.id}
                      >
                        {actionLoading === admin.id ? "Promoting..." : "Promote"}
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDemote(admin.id)}
                        disabled={actionLoading === admin.id}
                      >
                        {actionLoading === admin.id ? "Demoting..." : "Demote"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
