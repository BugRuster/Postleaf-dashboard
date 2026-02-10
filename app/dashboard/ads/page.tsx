"use client";

import { useEffect, useState } from "react";
import {
  getAvailableContent,
  createAd,
  deleteAd,
  updateAdLink,
  type ContentItem,
} from "@/lib/api/ads";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "@phosphor-icons/react";
import { ActiveAdsView } from "@/components/ads/ActiveAdsView";
import { ContentSelectionDialog } from "@/components/ads/ContentSelectionDialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSidebar } from "@/app/dashboard/layout";

export default function AdsPage() {
  const { toggleSidebar } = useSidebar();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter active ads and available content
  // Handle both is_advertisement (posts/cuts) and advertisement (events)
  const activeAds = content.filter((c) => {
    if (c.contentType === "event") {
      return (c.content as any).advertisement === true;
    }
    return c.content.is_advertisement === true;
  });

  const availableContent = content.filter((c) => {
    if (c.contentType === "event") {
      return (c.content as any).advertisement !== true;
    }
    return c.content.is_advertisement !== true;
  });

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAvailableContent(1, 100); // Fetch more items
      setContent(data);
    } catch (err) {
      console.error("Failed to fetch content:", err);
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleCreateAd = async (
    contentId: string,
    contentType: string,
    adLink?: string,
  ) => {
    try {
      await createAd({
        contentId,
        contentType: contentType as "post" | "cut" | "event",
        adLink,
      });
      await fetchContent();
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create advertisement.";
      setError(errorMessage);
      throw err;
    }
  };

  const handleUpdateLink = async (
    contentId: string,
    contentType: string,
    adLink: string,
  ) => {
    try {
      await updateAdLink(
        contentId,
        contentType as "post" | "cut" | "event",
        adLink,
      );
      await fetchContent();
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update ad link.";
      setError(errorMessage);
      throw err;
    }
  };

  const handleRemoveAd = async (contentId: string, contentType: string) => {
    try {
      await deleteAd(contentId, contentType as "post" | "cut" | "event");
      await fetchContent();
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to remove advertisement.";
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advertisement Management"
        description="Create and manage advertisements for your content"
        onMenuClick={toggleSidebar}
        actions={
          <Button onClick={() => setDialogOpen(true)} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ad
          </Button>
        }
      />

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Active Ads Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="h-5 w-5" weight="fill" />
          <h2 className="text-xl font-semibold">Active Advertisements</h2>
          <span className="text-sm text-muted-foreground">
            ({activeAds.length})
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[200px] rounded-lg border bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : activeAds.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Megaphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Active Advertisements
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first advertisement to start promoting your content
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Ad
            </Button>
          </div>
        ) : (
          <ActiveAdsView
            ads={activeAds}
            onUpdateLink={handleUpdateLink}
            onRemoveAd={handleRemoveAd}
            loading={loading}
          />
        )}
      </div>

      {/* Content Selection Dialog */}
      <ContentSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        availableContent={availableContent}
        onCreateAd={handleCreateAd}
        loading={loading}
      />
    </div>
  );
}
