"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContentItem } from "@/lib/api/ads";

interface CreateAdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ContentItem | null;
  onConfirm: (adLink?: string) => Promise<void>;
}

export function CreateAdModal({
  open,
  onOpenChange,
  content,
  onConfirm,
}: CreateAdModalProps) {
  const [adLink, setAdLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiresAdLink = content?.contentType === "post" || content?.contentType === "cut";

  const handleConfirm = async () => {
    setError(null);

    // Validate ad link for post and cut types
    if (requiresAdLink && !adLink.trim()) {
      setError("Ad link is required for this content type");
      return;
    }

    // Basic URL validation
    if (requiresAdLink && adLink.trim()) {
      try {
        new URL(adLink);
      } catch {
        setError("Please enter a valid URL");
        return;
      }
    }

    setLoading(true);
    try {
      await onConfirm(requiresAdLink ? adLink : undefined);
      setAdLink("");
      onOpenChange(false);
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to create advertisement. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAdLink("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Advertisement</DialogTitle>
          <DialogDescription>
            {requiresAdLink
              ? "Enter the ad link for this content to create an advertisement."
              : "Confirm to create an advertisement for this event."}
          </DialogDescription>
        </DialogHeader>

        {content && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Content Type:</span>
                <span className="text-sm capitalize">{content.contentType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Title:</span>
                <span className="text-sm truncate max-w-[200px]">
                  {content.content.title || content.content.caption || "Untitled"}
                </span>
              </div>
            </div>

            {requiresAdLink && (
              <div className="space-y-2">
                <Label htmlFor="adLink">
                  Ad Link <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="adLink"
                  type="url"
                  placeholder="https://example.com/your-ad-link"
                  value={adLink}
                  onChange={(e) => setAdLink(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL where users will be directed when they click on this ad
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Creating..." : "Create Ad"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
