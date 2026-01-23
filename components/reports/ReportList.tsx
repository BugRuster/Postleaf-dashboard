"use client"

import { useState } from "react"
import { Report } from "@/lib/api/reports"
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

interface ReportListProps {
  reports: Report[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onDismiss: (reportId: string) => Promise<void>
  loading?: boolean
}

export function ReportList({
  reports,
  currentPage,
  totalPages,
  onPageChange,
  onDismiss,
  loading = false,
}: ReportListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleDismiss = async (reportId: string) => {
    setActionLoading(reportId)
    try {
      await onDismiss(reportId)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusVariant = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'default'
      case 'dismissed':
        return 'secondary'
      case 'resolved':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getContentTypeVariant = (contentType: Report['contentType']) => {
    switch (contentType) {
      case 'post':
        return 'default'
      case 'cut':
        return 'secondary'
      case 'event':
        return 'outline'
      default:
        return 'secondary'
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
              <TableHead>Content Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Reported At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports?.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant={getContentTypeVariant(report.contentType)}>
                      {report.contentType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{report.reason}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {report.description}
                  </TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>{formatDate(report.reportedAt)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {report.status === 'pending' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDismiss(report.id)}
                        disabled={actionLoading === report.id}
                      >
                        {actionLoading === report.id ? "Dismissing..." : "Dismiss"}
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
