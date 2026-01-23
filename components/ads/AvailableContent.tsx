"use client";

import { useEffect, useState } from "react";
import { getAvailableContent, createAd, type Content } from "@/lib/api/ads";
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

export function AvailableContent() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch available content
  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAvailableContent();
      setContent(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch available content:", err);
      setError("Failed to load available content. Please try again.");
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleCreateAd = async (contentId: string) => {
    setActionLoading(contentId);
    try {
      // Create ad with default values (7 days from now, budget of 100)
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      await createAd({
        contentId,
        startDate,
        endDate,
        budget: 100,
      });
      
      // Refresh the list
      await fetchContent();
    } catch (err) {
      console.error("Failed to create ad:", err);
      setError("Failed to create advertisement. Please try again.");
      setContent([]);
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

  const getContentTypeVariant = (contentType: Content["type"]) => {
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
          Content available for promotion
        </p>
        <Button variant="outline" size="sm" onClick={fetchContent}>
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!content || content.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No content available for promotion
                </TableCell>
              </TableRow>
            ) : (
              content.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant={getContentTypeVariant(item.type)}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item.description}
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleCreateAd(item.id)}
                      disabled={
                        !item.isPromotable || actionLoading === item.id
                      }
                    >
                      {actionLoading === item.id
                        ? "Creating..."
                        : "Create Ad"}
                    </Button>
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
