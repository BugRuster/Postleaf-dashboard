"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Link as LinkIcon, Trash, PencilSimple, Image as ImageIcon, Video, CalendarBlank } from "@phosphor-icons/react";
import type { ContentItem } from "@/lib/api/ads";
import Image from "next/image";

interface ActiveAdsViewProps {
  ads: ContentItem[];
  onUpdateLink: (contentId: string, contentType: string, link: string) => Promise<void>;
  onRemoveAd: (contentId: string, contentType: string) => Promise<void>;
  loading?: boolean;
}

export function ActiveAdsView({ ads, onUpdateLink, onRemoveAd, loading }: ActiveAdsViewProps) {
  const [editingAd, setEditingAd] = useState<ContentItem | null>(null);
  const [adLink, setAdLink] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleEditLink = (ad: ContentItem) => {
    setEditingAd(ad);
    setAdLink((ad.content as any).ad_link || "");
  };

  const handleUpdateLink = async () => {
    if (!editingAd) return;

    // Validate for posts and cuts
    const requiresLink = editingAd.contentType === 'post' || editingAd.contentType === 'cut';
    if (requiresLink && !adLink.trim()) {
      return;
    }

    setUpdating(true);
    try {
      await onUpdateLink(editingAd._id, editingAd.contentType, adLink);
      setEditingAd(null);
      setAdLink("");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (ad: ContentItem) => {
    if (!confirm("Are you sure you want to remove this advertisement?")) return;
    await onRemoveAd(ad._id, ad.contentType);
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'cut':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
      case 'event':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getMediaPreview = (item: ContentItem) => {
    const content = item.content as any;
    
    if (item.contentType === 'post') {
      if (content.image_url && content.image_url.length > 0) {
        return (
          <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
            <Image
              src={content.image_url[0]}
              alt="Post preview"
              fill
              className="object-cover"
              unoptimized
            />
            {content.type === 'image' && (
              <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Image
              </div>
            )}
          </div>
        );
      }
    }
    
    if (item.contentType === 'cut') {
      if (content.media_url) {
        return (
          <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
            <video
              src={content.media_url}
              className="w-full h-full object-cover"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Video className="h-12 w-12 text-white" weight="fill" />
            </div>
            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Video className="h-3 w-3" />
              Video
            </div>
          </div>
        );
      }
    }
    
    if (item.contentType === 'event') {
      if (content.event_images && content.event_images.length > 0) {
        return (
          <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
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
    }
    
    return (
      <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-sm text-muted-foreground">Text Content</p>
        </div>
      </div>
    );
  };

  if (ads.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => {
          const content = ad.content as any;
          const title = content.title || content.caption || 'Untitled';
          
          return (
            <Card key={ad._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Media Preview */}
              {getMediaPreview(ad)}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className={getContentTypeColor(ad.contentType)}>
                    {ad.contentType}
                  </Badge>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Content Info */}
                <div>
                  <h3 className="font-semibold line-clamp-2 mb-2">
                    {title}
                  </h3>
                  {content.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {content.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{content.views || 0}</span>
                  </div>
                  {ad.contentType !== 'event' && content.ad_link && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <span>Link set</span>
                    </div>
                  )}
                  {ad.contentType === 'event' && content.event_date && (
                    <div className="flex items-center gap-1">
                      <CalendarBlank className="h-4 w-4" />
                      <span>{new Date(content.event_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                  )}
                </div>

                {/* Ad Link Display */}
                {ad.contentType !== 'event' && content.ad_link && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Ad Link:</p>
                    <a
                      href={content.ad_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate block"
                    >
                      {content.ad_link}
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  {ad.contentType !== 'event' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditLink(ad)}
                    >
                      <PencilSimple className="h-4 w-4 mr-1" />
                      {content.ad_link ? 'Edit Link' : 'Add Link'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemove(ad)}
                    className={ad.contentType === 'event' ? 'flex-1' : ''}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Link Dialog */}
      <Dialog open={!!editingAd} onOpenChange={(open) => !open && setEditingAd(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {(editingAd?.content as any)?.ad_link ? 'Update' : 'Add'} Ad Link
            </DialogTitle>
            <DialogDescription>
              {editingAd?.contentType === 'event' 
                ? 'Ad link is optional for events'
                : 'Enter the URL where users will be directed when they click on this ad'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingAd && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">
                  {(editingAd.content as any).title || (editingAd.content as any).caption || 'Untitled'}
                </p>
                <Badge variant="outline" className={getContentTypeColor(editingAd.contentType)}>
                  {editingAd.contentType}
                </Badge>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="adLink">
                Ad Link {editingAd?.contentType !== 'event' && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="adLink"
                type="url"
                placeholder="https://example.com/your-ad-link"
                value={adLink}
                onChange={(e) => setAdLink(e.target.value)}
                disabled={updating}
              />
              {editingAd?.contentType === 'event' && (
                <p className="text-xs text-muted-foreground">
                  Optional: Add a link for users to get more information about the event
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAd(null)} disabled={updating}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLink} disabled={updating}>
              {updating ? "Updating..." : "Update Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
