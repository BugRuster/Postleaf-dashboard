"use client";

import { useEffect, useState } from "react";
import { 
  getAvailableContent, 
  createAd, 
  deleteAd, 
  updateAdLink,
  type ContentItem, 
  type Pagination 
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
import { Input } from "@/components/ui/input";
import { CreateAdModal } from "./CreateAdModal";

const CONTENT_TYPE_VARIANTS = {
  post: "default",
  cut: "secondary",
  event: "outline",
} as const;

export function AvailableContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [editingAdLink, setEditingAdLink] = useState<string | null>(null);
  const [adLinkValue, setAdLinkValue] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchContent = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data, pagination: paginationData } = await getAvailableContent(page);
      setContent(data);
      setPagination(paginationData);
    } catch (err) {
      console.error("Failed to fetch available content:", err);
      setError("Failed to load available content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleOpenModal = (item: ContentItem) => {
    setSelectedContent(item);
    setModalOpen(true);
  };

  const handleCreateAd = async (adLink?: string) => {
    if (!selectedContent) return;

    setActionLoading(selectedContent._id);
    try {
      await createAd({
        contentId: selectedContent._id,
        contentType: selectedContent.contentType,
        adLink,
      });
      await fetchContent(pagination.page);
      setError(null);
    } catch (err: any) {
      console.error("Failed to create ad:", err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Failed to create advertisement. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAd = async (item: ContentItem) => {
    if (!confirm("Are you sure you want to remove this advertisement?")) return;
    
    setActionLoading(item._id);
    try {
      await deleteAd(item._id, item.contentType);
      await fetchContent(pagination.page);
      setError(null);
    } catch (err: any) {
      console.error("Failed to delete ad:", err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Failed to remove advertisement. Please try again.";
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateAdLink = async (item: ContentItem) => {
    setActionLoading(item._id);
    try {
      await updateAdLink(item._id, item.contentType, adLinkValue);
      await fetchContent(pagination.page);
      setEditingAdLink(null);
      setAdLinkValue("");
      setError(null);
    } catch (err: any) {
      console.error("Failed to update ad link:", err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Failed to update ad link. Please try again.";
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const startEditingAdLink = (item: ContentItem) => {
    setEditingAdLink(item._id);
    setAdLinkValue("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    <>
      <CreateAdModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        content={selectedContent}
        onConfirm={handleCreateAd}
      />

      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            {error}
          </div>
        )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pagination.total} content items available
        </p>
        <Button variant="outline" size="sm" onClick={() => fetchContent(pagination.page)}>
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author ID</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No content available
                </TableCell>
              </TableRow>
            ) : (
              content.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Badge variant={CONTENT_TYPE_VARIANTS[item.contentType]}>
                      {item.contentType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium max-w-md truncate">
                    {item.content.title || item.content.caption || 'Untitled'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">
                    {(item.content.user_id || item.content.creator_id || 'Unknown').slice(0, 8)}...
                  </TableCell>
                  <TableCell>{formatDate(item.content.createdAt)}</TableCell>
                  <TableCell>
                    {item.content.is_advertisement ? (
                      <Badge variant="default">Active Ad</Badge>
                    ) : (
                      <Badge variant="outline">Available</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingAdLink === item._id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <Input
                          type="url"
                          placeholder="Enter ad link"
                          value={adLinkValue}
                          onChange={(e) => setAdLinkValue(e.target.value)}
                          className="max-w-xs"
                          disabled={actionLoading === item._id}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateAdLink(item)}
                          disabled={!adLinkValue || actionLoading === item._id}
                        >
                          {actionLoading === item._id ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingAdLink(null);
                            setAdLinkValue("");
                          }}
                          disabled={actionLoading === item._id}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        {!item.content.is_advertisement ? (
                          <Button
                            size="sm"
                            onClick={() => handleOpenModal(item)}
                            disabled={actionLoading === item._id}
                          >
                            {actionLoading === item._id ? "Creating..." : "Create Ad"}
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditingAdLink(item)}
                              disabled={actionLoading === item._id}
                            >
                              Edit Link
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteAd(item)}
                              disabled={actionLoading === item._id}
                            >
                              {actionLoading === item._id ? "Removing..." : "Remove Ad"}
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchContent(pagination.page - 1)}
              disabled={!pagination.hasPrevPage || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchContent(pagination.page + 1)}
              disabled={!pagination.hasNextPage || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
