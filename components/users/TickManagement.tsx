"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/api/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MagnifyingGlass, CaretLeft, CaretRight, Users } from "@phosphor-icons/react";

interface TickManagementProps {
  onSearch: (query: string) => void;
  searchResults: User[];
  onUpdateTick: (userId: string, tick: 'blue' | 'golden' | null) => Promise<void>;
  loading?: boolean;
  // Users with tick tab
  tickedUsers: User[];
  tickedUsersPagination: { page: number; limit: number };
  onFetchTickedUsers: (tickType: "blue" | "golden" | "both", page: number) => void;
  loadingTickedUsers?: boolean;
}

export function TickManagement({
  onSearch,
  searchResults,
  onUpdateTick,
  loading = false,
  tickedUsers,
  tickedUsersPagination,
  onFetchTickedUsers,
  loadingTickedUsers = false,
}: TickManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [tickTypeFilter, setTickTypeFilter] = useState<"blue" | "golden" | "both">("both");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      onSearch(debouncedQuery);
    } else if (debouncedQuery.trim().length === 0) {
      // Clear results when search is cleared
      onSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // Trigger ticked users fetch when on ticked tab or tickType changes
  useEffect(() => {
    if (activeTab === "ticked") {
      onFetchTickedUsers(tickTypeFilter, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, tickTypeFilter]);

  const handleUpdateTick = async (userId: string, tick: 'blue' | 'golden' | null) => {
    setActionLoading(userId);
    try {
      await onUpdateTick(userId, tick);
    } finally {
      setActionLoading(null);
    }
  };

  const getTickBadge = (user: User) => {
    if (user.goldenTick) {
      return <Badge variant="default">Golden Tick</Badge>;
    }
    if (user.blueTick) {
      return <Badge variant="secondary">Blue Tick</Badge>;
    }
    return <Badge variant="outline">No Tick</Badge>;
  };

  const getCurrentTickValue = (user: User) => {
    if (user.goldenTick) return "golden";
    if (user.blueTick) return "blue";
    return "none";
  };

  const handleTickedPageChange = (delta: number) => {
    const nextPage = tickedUsersPagination.page + delta;
    if (nextPage >= 1) {
      onFetchTickedUsers(tickTypeFilter, nextPage);
    }
  };

  const hasMoreTicked = tickedUsers.length >= tickedUsersPagination.limit;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="search">Search users</TabsTrigger>
        <TabsTrigger value="ticked">Users with tick</TabsTrigger>
      </TabsList>

      <TabsContent value="search" className="space-y-6 mt-6">
        {/* Search Input */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Search hint */}
        {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
          <p className="text-sm text-muted-foreground">
            Enter at least 2 characters to search
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {/* Search Results */}
        {!loading && debouncedQuery.trim().length >= 2 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Tick</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  searchResults.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getTickBadge(user)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={getCurrentTickValue(user)}
                            onValueChange={(value) => {
                              const tick = value === "none" ? null : (value as 'blue' | 'golden');
                              handleUpdateTick(user._id, tick);
                            }}
                            disabled={actionLoading === user._id}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select tick" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Tick</SelectItem>
                              <SelectItem value="blue">Blue Tick</SelectItem>
                              <SelectItem value="golden">Golden Tick</SelectItem>
                            </SelectContent>
                          </Select>
                          {actionLoading === user._id && (
                            <span className="text-sm text-muted-foreground">
                              Updating...
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Empty state when no search */}
        {!loading && debouncedQuery.trim().length < 2 && (
          <div className="rounded-md border border-dashed p-12 text-center">
            <MagnifyingGlass className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Search for users</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter a username or email to search for users and manage their
              verification ticks
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="ticked" className="space-y-6 mt-6">
        {/* Tick type filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by tick:</span>
          <Select
            value={tickTypeFilter}
            onValueChange={(v) => setTickTypeFilter(v as "blue" | "golden" | "both")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="blue">Blue only</SelectItem>
              <SelectItem value="golden">Golden only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading state */}
        {loadingTickedUsers && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {/* Ticked users table */}
        {!loadingTickedUsers && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Tick</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-12"
                    >
                      <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                      <p>No users with blue or golden tick found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  tickedUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getTickBadge(user)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={getCurrentTickValue(user)}
                            onValueChange={(value) => {
                              const tick = value === "none" ? null : (value as 'blue' | 'golden');
                              handleUpdateTick(user._id, tick);
                            }}
                            disabled={actionLoading === user._id}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select tick" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Tick</SelectItem>
                              <SelectItem value="blue">Blue Tick</SelectItem>
                              <SelectItem value="golden">Golden Tick</SelectItem>
                            </SelectContent>
                          </Select>
                          {actionLoading === user._id && (
                            <span className="text-sm text-muted-foreground">
                              Updating...
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {tickedUsers.length > 0 && (
              <div className="flex items-center justify-between gap-4 px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {tickedUsersPagination.page}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTickedPageChange(-1)}
                    disabled={tickedUsersPagination.page <= 1}
                  >
                    <CaretLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTickedPageChange(1)}
                    disabled={!hasMoreTicked}
                  >
                    Next
                    <CaretRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
