"use client";

import { useEffect, useState } from "react";
import {
  getReports,
  dismissReport,
  type Report,
  type ReportFilters,
  type ReportListResponse,
} from "@/lib/api/reports";
import { ReportList } from "@/components/reports/ReportList";
import { ReportFilters as ReportFiltersComponent } from "@/components/reports/ReportFilters";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({});

  // Fetch reports
  const fetchReports = async (page: number, currentFilters: ReportFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response: ReportListResponse = await getReports({
        ...currentFilters,
        page,
        limit: 10,
      });
      setReports(response.reports);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(currentPage, filters);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDismiss = async (reportId: string) => {
    try {
      await dismissReport(reportId);
      // Refresh the list
      await fetchReports(currentPage, filters);
    } catch (err) {
      console.error("Failed to dismiss report:", err);
      setError("Failed to dismiss report. Please try again.");
    }
  };

  const handleFilterChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchReports(1, newFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports Management
          </h1>
          <p className="text-muted-foreground">
            Review and manage user-submitted reports
          </p>
        </div>
        <Button onClick={() => fetchReports(currentPage, filters)}>Refresh</Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      <ReportFiltersComponent onFilterChange={handleFilterChange} />

      <ReportList
        reports={reports}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDismiss={handleDismiss}
        loading={loading}
      />
    </div>
  );
}
