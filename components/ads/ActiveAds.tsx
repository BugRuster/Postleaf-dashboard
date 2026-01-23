"use client";

import { useEffect, useState } from "react";
import {
  getActiveAds,
  updateAd,
  deleteAd,
  type Advertisement,
} from "@/lib/api/ads";
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

export function ActiveAds() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch active ads
  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveAds();
      setAds(data);
    } catch (err) {
      console.error("Failed to fetch active ads:", err);
      setError("Failed to load active ads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleToggleStatus = async (
    adId: string,
    currentStatus: Advertisement["status"]
  ) => {
    setActionLoading(adId);
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      await updateAd(adId, { status: newStatus });
      // Refresh the list
      await fetchAds();
    } catch (err) {
      console.error("Failed to update ad:", err);
      setError("Failed to update advertisement. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (adId: string) => {
    setActionLoading(adId);
    try {
      await deleteAd(adId);
      // Refresh the list
      await fetchAds();
    } catch (err) {
      console.error("Failed to delete ad:", err);
      setError("Failed to delete advertisement. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusVariant = (status: Advertisement["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "paused":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getContentTypeVariant = (contentType: Advertisement["contentType"]) => {
    switch (contentType) {
      case "post":
        return "default";
      case "cut":
        return "secondary";
      case "event":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Your active advertisements
        </p>
        <Button variant="outline" size="sm" onClick={fetchAds}>
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Content ID</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  No active advertisements
                </TableCell>
              </TableRow>
            ) : (
              ads?.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <Badge variant={getContentTypeVariant(ad.contentType)}>
                      {ad.contentType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {ad.contentId.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{formatDate(ad.startDate)}</TableCell>
                  <TableCell>{formatDate(ad.endDate)}</TableCell>
                  <TableCell>${ad.budget}</TableCell>
                  <TableCell>${ad.spent}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(ad.status)}>
                      {ad.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {ad.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(ad.id, ad.status)}
                          disabled={actionLoading === ad.id}
                        >
                          {actionLoading === ad.id
                            ? "Updating..."
                            : ad.status === "active"
                            ? "Pause"
                            : "Resume"}
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(ad.id)}
                        disabled={actionLoading === ad.id}
                      >
                        {actionLoading === ad.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
