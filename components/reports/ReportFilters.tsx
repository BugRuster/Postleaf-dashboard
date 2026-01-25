"use client"

import { useState } from "react"
import { ReportFilters as ReportFiltersType } from "@/lib/api/reports"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReportFiltersProps {
  onFilterChange: (filters: ReportFiltersType) => void
}

export function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const [contentType, setContentType] = useState("all")
  const [status, setStatus] = useState("all")

  const buildFilters = (
    ct: string,
    st: string
  ): ReportFiltersType => ({
    contentType: ct === "all" ? undefined : (ct as ReportFiltersType["contentType"]),
    status: st === "all" ? undefined : (st as ReportFiltersType["status"]),
  })

  const handleContentTypeChange = (value: string) => {
    setContentType(value)
    onFilterChange(buildFilters(value, status))
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFilterChange(buildFilters(contentType, value))
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={contentType} onValueChange={handleContentTypeChange}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="post">Post</SelectItem>
          <SelectItem value="cut">Cut</SelectItem>
          <SelectItem value="event">Event</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="dismissed">Dismissed</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
