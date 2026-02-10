"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getReports,
  type Report,
  type ReportListResponse,
} from "@/lib/api/reports";
import { getUser } from "@/lib/auth/token";
import { canAccessReports } from "@/lib/auth/permissions";
import { ReportList } from "@/components/reports/ReportList";
import { ViewReportModal } from "@/components/reports/ViewReportModal";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSidebar } from "@/app/dashboard/layout";
import { Button } from "@/components/ui/button";
import { ArrowsClockwise } from "@phosphor-icons/react";

export default function ReportsPage() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Check permissions
  useEffect(() => {
    const user = getUser();
    if (
      !user ||
      user.role === "user" ||
      !canAccessReports(user.role as "admin" | "super_admin")
    ) {
      router.push("/dashboard");
    }
  }, [router]);

  const fetchReports = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: ReportListResponse = await getReports({
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
    fetchReports(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = async (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchReports(currentPage);
  };

  const handleRefresh = () => {
    fetchReports(currentPage);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reports"
        onMenuClick={toggleSidebar}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <ArrowsClockwise
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <ReportList
        reports={reports}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onView={handleView}
        loading={loading}
      />

      {selectedReport && (
        <ViewReportModal
          report={selectedReport}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
