"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GoHome } from "react-icons/go";
import { IoCalendarOutline } from "react-icons/io5";
import { Eye, Image as ImageIcon, Video } from "@phosphor-icons/react";
import { CutsIcon } from "@/components/icons/cuts-icon";
import type { ContentItem } from "@/lib/api/ads";
import Image from "next/image";

interface ContentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableContent: ContentItem[];
  onCreateAd: (contentId: string, contentType: string, adLink?: string) => Promise<void>;
  loading?: boolean;
}

export function ContentSelectionDialog({
  open,
  onOpenChange,
  availableContent,
  onCreateAd,
  loading,
}: ContentSelectionDialogProps) {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [adLink, setAdLink] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const posts = availableContent.filter(c => c.contentType === 'post');
  const cuts = availableContent.filter(c => c.contentType === 'cut');
  
  // Filter out expired events (events where event_date has passed)
  const events = availableContent.filter(c => {
    if (c.contentType !== 'event') return false;
    const content = c.content as any;
    if (!content.event_date) return true; // Include if no date set
    const eventDate = new Date(content.event_date);
    const now = new Date();
    return eventDate > now; // Only include future events
  });

  // Normalize contentType for API variance between local/production (e.g. 'post' vs 'Post')
  const contentType = selectedContent?.contentType?.toLowerCase?.();
  const requiresAdLink = contentType === 'post' || contentType === 'cut';
  // Always show Ad Link field when content is selected
  const showAdLinkField = !!selectedContent;

  const handleCreateAd = async () => {
    if (!selectedContent) return;

    setError(null);

    // Validate ad link for post and cut types
    if (requiresAdLink && !adLink.trim()) {
      setError("Ad link is required for posts and cuts");
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

    setCreating(true);
    try {
      await onCreateAd(
        selectedContent._id,
        selectedContent.contentType,
        requiresAdLink ? adLink : undefined
      );
      setSelectedContent(null);
      setAdLink("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create ad");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setSelectedContent(null);
    setAdLink("");
    setError(null);
    onOpenChange(false);
  };

  const getMediaPreview = (item: ContentItem) => {
    const content = item.content as any;
    
    if (item.contentType === 'post') {
      if (content.image_url && content.image_url.length > 0) {
        return (
          <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
            <Image
              src={content.image_url[0]}
              alt="Post preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        );
      }
      return (
        <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
          <GoHome className="h-8 w-8 text-muted-foreground" />
        </div>
      );
    }
    
    if (item.contentType === 'cut') {
      if (content.media_url) {
        return (
          <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
            <video
              src={content.media_url}
              className="w-full h-full object-cover"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Video className="h-8 w-8 text-white" weight="fill" />
            </div>
          </div>
        );
      }
      return (
        <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
          <CutsIcon className="h-8 w-8 text-muted-foreground" filled />
        </div>
      );
    }
    
    if (item.contentType === 'event') {
      if (content.event_images && content.event_images.length > 0) {
        return (
          <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
            <Image
              src={content.event_images[0]}
              alt="Event preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        );
      }
      return (
        <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
          <IoCalendarOutline className="h-8 w-8 text-muted-foreground" />
        </div>
      );
    }
    
    return null;
  };

  const getContentTypeIcon = (type: string) => {
    const normalized = type?.toLowerCase?.();
    switch (normalized) {
      case 'post':
        return <GoHome className="h-4 w-4" />;
      case 'cut':
        return <CutsIcon className="h-4 w-4" filled />;
      case 'event':
        return <IoCalendarOutline className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getContentTypeBadge = (type: string) => {
    const normalized = type?.toLowerCase?.();
    const colors = {
      post: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      cut: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      event: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    };
    return colors[normalized as keyof typeof colors] || '';
  };

  const renderContentList = (items: ContentItem[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>No content available</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
        {items.map((item) => {
          const content = item.content as any;
          const title = content.title || content.caption || 'Untitled';
          
          return (
            <Card
              key={item._id}
              className={`cursor-pointer transition-all ${
                selectedContent?._id === item._id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedContent(selectedContent?._id === item._id ? null : item)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Media Preview */}
                  <div className="w-32 flex-shrink-0">
                    {getMediaPreview(item)}
                  </div>
                  
                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold line-clamp-2 text-sm">
                        {title}
                      </h4>
                      <Badge variant="outline" className={`${getContentTypeBadge(item.contentType)} flex-shrink-0`}>
                        {getContentTypeIcon(item.contentType)}
                        <span className="ml-1 capitalize">{item.contentType}</span>
                      </Badge>
                    </div>
                    
                    {content.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {content.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{content.views || 0} views</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(content.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                      {content.type && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            {content.type === 'image' && <ImageIcon className="h-3 w-3" />}
                            {content.type === 'video' && <Video className="h-3 w-3" />}
                            <span className="capitalize">{content.type}</span>
                          </div>
                        </>
                      )}
                      {item.contentType === 'event' && content.event_date && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <IoCalendarOutline className="h-3 w-3" />
                            <span>{new Date(content.event_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Advertisement</DialogTitle>
          <DialogDescription>
            Select content to promote as an advertisement
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="posts" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">
              <GoHome className="h-4 w-4 mr-2" />
              Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="cuts">
              <CutsIcon className="h-4 w-4 mr-2" filled />
              Cuts ({cuts.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              <IoCalendarOutline className="h-4 w-4 mr-2" />
              Events ({events.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="flex-1 overflow-hidden mt-4">
            {renderContentList(posts)}
          </TabsContent>

          <TabsContent value="cuts" className="flex-1 overflow-hidden mt-4">
            {renderContentList(cuts)}
          </TabsContent>

          <TabsContent value="events" className="flex-1 overflow-hidden mt-4">
            {renderContentList(events)}
          </TabsContent>
        </Tabs>

        {selectedContent && (
          <div className="space-y-4 pt-4 border-t flex-shrink-0">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Selected Content:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getContentTypeBadge(selectedContent.contentType)}>
                    {getContentTypeIcon(selectedContent.contentType)}
                    <span className="ml-1 capitalize">{selectedContent.contentType}</span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedContent(null);
                      setAdLink("");
                      setError(null);
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-20 flex-shrink-0">
                  {getMediaPreview(selectedContent)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">
                    {(selectedContent.content as any).title || (selectedContent.content as any).caption || 'Untitled'}
                  </p>
                </div>
              </div>
            </div>

            {showAdLinkField && (
              <div className="space-y-2">
                <Label htmlFor="adLink">
                  Ad Link {requiresAdLink && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="adLink"
                  type="url"
                  placeholder="https://example.com/your-ad-link"
                  value={adLink}
                  onChange={(e) => setAdLink(e.target.value)}
                  disabled={creating}
                />
                <p className="text-xs text-muted-foreground">
                  {requiresAdLink
                    ? "Enter the URL where users will be directed when they click on this ad"
                    : "Optional: Enter the URL where users will be directed when they click on this ad"}
                </p>
                {!requiresAdLink && (
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ℹ️ Ad link is not required for events
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} disabled={creating} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateAd} disabled={creating} className="flex-1">
                {creating ? "Creating..." : "Create Advertisement"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
