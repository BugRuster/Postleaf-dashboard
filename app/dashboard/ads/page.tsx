"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableContent } from "@/components/ads/AvailableContent";
import { ActiveAds } from "@/components/ads/ActiveAds";

export default function AdsPage() {
  const [activeTab, setActiveTab] = useState("available");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Advertisement Management
        </h1>
        <p className="text-muted-foreground">
          Create and manage advertisements for your content
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="available">Available Content</TabsTrigger>
          <TabsTrigger value="active">Active Ads</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <AvailableContent />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <ActiveAds />
        </TabsContent>
      </Tabs>
    </div>
  );
}
