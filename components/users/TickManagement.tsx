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
import {
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  Users,
  CheckCircle,
} from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TickManagementProps {
  onSearch: (query: string) => void;
  searchResults: User[];
  onUpdateTick: (
    userId: string,
    tick: "blue" | "golden" | null,
  ) => Promise<void>;
  loading?: boolean;
  tickedUsers: User[];
  tickedUsersPagination: { page: number; limit: number };
  onFetchTickedUsers: (
    tickType: "blue" | "golden" | "both",
    page: number,
  ) => void;
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
  const [activeTab, setActiveTab] = useState("ticked");
  const [tickTypeFilter, setTickTypeFilter] = useState<
    "blue" | "golden" | "both"
  >("both");

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

  const handleUpdateTick = async (
    userId: string,
    tick: "blue" | "golden" | null,
  ) => {
    setActionLoading(userId);
    try {
      await onUpdateTick(userId, tick);
    } finally {
      setActionLoading(null);
    }
  };

  const getTickBadge = (user: User) => {
    if (user.goldenTick) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">Golden Tick</Badge>
      );
    }
    if (user.blueTick) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Blue Tick</Badge>;
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

  // Count ticks - only count from current page data
  const totalVerified = tickedUsers.length;
  const blueTickCount = tickedUsers.filter(
    (u) => u.blueTick && !u.goldenTick,
  ).length;
  const goldenTickCount = tickedUsers.filter((u) => u.goldenTick).length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ticked">
            <CheckCircle className="h-4 w-4 mr-2" weight="fill" />
            Verified Users
          </TabsTrigger>
          <TabsTrigger value="search">
            <MagnifyingGlass className="h-4 w-4 mr-2" />
            Search Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ticked" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Verified
                </CardTitle>
                <CheckCircle
                  className="h-4 w-4 text-muted-foreground"
                  weight="fill"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVerified}</div>
                <p className="text-xs text-muted-foreground">
                  Users with verification ticks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Blue Ticks
                </CardTitle>
                <div className="h-3 w-3 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blueTickCount}</div>
                <p className="text-xs text-muted-foreground">
                  Verified accounts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Golden Ticks
                </CardTitle>
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goldenTickCount}</div>
                <p className="text-xs text-muted-foreground">
                  Premium verified accounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Filter by:</span>
            <Select
              value={tickTypeFilter}
              onValueChange={(v) =>
                setTickTypeFilter(v as "blue" | "golden" | "both")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">All Verified</SelectItem>
                <SelectItem value="blue">Blue Tick Only</SelectItem>
                <SelectItem value="golden">Golden Tick Only</SelectItem>
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
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Verification</TableHead>
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
                          <p>No verified users found</p>
                          <p className="text-xs mt-1">
                            Try changing the filter or add verification ticks to
                            users
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tickedUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            @{user.username}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getTickBadge(user)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Select
                                value={getCurrentTickValue(user)}
                                onValueChange={(value) => {
                                  const tick =
                                    value === "none"
                                      ? null
                                      : (value as "blue" | "golden");
                                  handleUpdateTick(user._id, tick);
                                }}
                                disabled={actionLoading === user._id}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder="Select tick" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">
                                    Remove Tick
                                  </SelectItem>
                                  <SelectItem value="blue">
                                    Blue Tick
                                  </SelectItem>
                                  <SelectItem value="golden">
                                    Golden Tick
                                  </SelectItem>
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
                  <div className="flex items-center justify-between gap-4 px-6 py-4 border-t">
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
                        <CaretLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTickedPageChange(1)}
                        disabled={!hasMoreTicked}
                      >
                        Next
                        <CaretRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Users</CardTitle>
              <CardDescription>
                Find users by username to manage their verification ticks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Search hint */}
              {searchQuery.trim().length > 0 &&
                searchQuery.trim().length < 2 && (
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
                        <TableHead>Current Tick</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground py-8"
                          >
                            No users found matching &quot;{debouncedQuery}&quot;
                          </TableCell>
                        </TableRow>
                      ) : (
                        searchResults.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">
                              @{user.username}
                            </TableCell>
                            <TableCell>{getTickBadge(user)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Select
                                  value={getCurrentTickValue(user)}
                                  onValueChange={(value) => {
                                    const tick =
                                      value === "none"
                                        ? null
                                        : (value as "blue" | "golden");
                                    handleUpdateTick(user._id, tick);
                                  }}
                                  disabled={actionLoading === user._id}
                                >
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Select tick" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      No Tick
                                    </SelectItem>
                                    <SelectItem value="blue">
                                      Blue Tick
                                    </SelectItem>
                                    <SelectItem value="golden">
                                      Golden Tick
                                    </SelectItem>
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
                  <h3 className="mt-4 text-lg font-semibold">
                    Search for users
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enter a username to find users and manage their verification
                    ticks
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
