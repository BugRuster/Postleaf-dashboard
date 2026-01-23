"use client";

import { useState, useEffect } from "react";
import { User, TickType } from "@/lib/api/users";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface TickManagementProps {
  onSearch: (query: string) => void;
  searchResults: User[];
  onUpdateTick: (userId: string, tick: TickType | null) => Promise<void>;
  loading?: boolean;
}

export function TickManagement({
  onSearch,
  searchResults,
  onUpdateTick,
  loading = false,
}: TickManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

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
    }
  }, [debouncedQuery, onSearch]);

  const handleUpdateTick = async (userId: string, tick: TickType | null) => {
    setActionLoading(userId);
    try {
      await onUpdateTick(userId, tick);
    } finally {
      setActionLoading(null);
    }
  };

  const getTickBadge = (tick: TickType | null) => {
    if (!tick) {
      return <Badge variant="outline">No Tick</Badge>;
    }
    return (
      <Badge variant={tick === "golden" ? "default" : "secondary"}>
        {tick === "golden" ? "Golden Tick" : "Blue Tick"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
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
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getTickBadge(user.tick)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={user.tick || "none"}
                          onValueChange={(value) => {
                            const tick =
                              value === "none"
                                ? null
                                : (value as TickType);
                            handleUpdateTick(user.id, tick);
                          }}
                          disabled={actionLoading === user.id}
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
                        {actionLoading === user.id && (
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
    </div>
  );
}
