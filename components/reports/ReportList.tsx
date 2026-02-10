"use client";

import { Report } from "@/lib/api/reports";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportListProps {
  reports: Report[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (report: Report) => void;
  loading?: boolean;
}

export function ReportList({
  reports,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  loading = false,
}: ReportListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return "default";
      case "dismissed":
        return "secondary";
      case "resolved":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getContentTypeVariant = (contentType: Report["contentType"]) => {
    switch (contentType) {
      case "post":
        return "default";
      case "cut":
        return "secondary";
      case "event":
        return "outline";
      case "user":
        return "destructive";
      case "comment":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!reports?.length ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge
                      variant={getContentTypeVariant(report.contentType)}
                      className="font-normal"
                    >
                      {report.contentType}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {report.reason}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {report.reportedBy}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(report.reportedAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(report.status)}
                      className="font-normal"
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={() => onView(report)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
