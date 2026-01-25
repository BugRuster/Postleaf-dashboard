"use client";

import { useState } from "react";
import { Report, resolveReport, dismissReport } from "@/lib/api/reports";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash, X } from "@phosphor-icons/react";
import { toast } from "sonner";

interface ViewReportModalProps {
  report: Report;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ViewReportModal({
  report,
  open,
  onOpenChange,
  onSuccess,
}: ViewReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const reportDetails = report.rawData;

  const handleDismiss = async () => {
    setLoading(true);
    try {
      await dismissReport(report.id);
      toast.success("Report dismissed successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to dismiss report:", error);
      toast.error("Failed to dismiss report");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const result = await resolveReport(report.id, report.contentType as 'post' | 'cut' | 'user');
      toast.success(result.message || `${report.contentType} deleted successfully`);
      setDeleteDialogOpen(false);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to delete ${report.contentType}:`, error);
      toast.error(`Failed to delete ${report.contentType}`);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!reportDetails) {
      return <p className="text-sm text-muted-foreground">Loading content...</p>;
    }

    // Post content
    if (report.contentType === "post" && reportDetails.post_id) {
      const post = reportDetails.post_id;
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Post Content</h3>
            {post.caption && (
              <p className="text-sm text-muted-foreground mb-3">{post.caption}</p>
            )}
            {post.image_url && post.image_url.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {post.image_url.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={url}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Cut content
    if (report.contentType === "cut" && reportDetails.cut_id) {
      const cut = reportDetails.cut_id;
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Cut Content</h3>
            {cut.caption && (
              <p className="text-sm text-muted-foreground mb-3">{cut.caption}</p>
            )}
            {cut.media_url && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <video
                  src={cut.media_url}
                  controls
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    // User content
    if (report.contentType === "user" && reportDetails.reported_user_id) {
      const user = reportDetails.reported_user_id;
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">User Profile</h3>
            <div className="flex items-center gap-4">
              {user.profile_picture && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                  <img
                    src={user.profile_picture}
                    alt={user.username || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium">{user.username || "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Event content (not supported yet)
    if (report.contentType === "event") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Event reports are not supported yet. This feature will be available in the future.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderActions = () => {
    if (report.contentType === "event") {
      return (
        <Button onClick={handleDismiss} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Dismiss
        </Button>
      );
    }

    return (
      <>
        <Button
          variant="outline"
          onClick={handleDismiss}
          disabled={loading}
        >
          <X className="h-4 w-4 mr-2" />
          Dismiss
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteClick}
          disabled={loading}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete {report.contentType}
        </Button>
      </>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>Report Details</DialogTitle>
              <Badge variant="outline">{report.contentType}</Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Reported by</p>
                <p className="font-medium">{report.reportedBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline">{report.status}</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Reason</p>
              <p className="text-sm font-medium">{report.reason}</p>
            </div>

            <div className="border-t pt-4">
              {renderContent()}
            </div>
          </div>

          <DialogFooter>
            {renderActions()}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {report.contentType} and mark the report as resolved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
