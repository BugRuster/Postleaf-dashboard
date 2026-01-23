"use client";

import { useState, useEffect, useRef } from "react";
import { getAllUsers, searchUsers, User } from "@/lib/api/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface UserSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPromote: (userId: string) => Promise<void>;
}

export function UserSelectionModal({
  open,
  onOpenChange,
  onPromote,
}: UserSelectionModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Load users function
  const loadUsers = async (reset: boolean = false) => {
    if (loadingRef.current) return;
    if (!reset && !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await getAllUsers(reset ? undefined : cursor);
      setUsers((prev) => reset ? response.data.users : [...prev, ...response.data.users]);
      setCursor(response.data.meta.cursor);
      setHasMore(response.data.meta.hasMore);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // Search users function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setUsers([]);
      setCursor(undefined);
      setHasMore(true);
      await loadUsers(true);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    try {
      const response = await searchUsers(query);
      setUsers(response.results);
      setHasMore(false);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, open]);

  // Infinite scroll observer
  useEffect(() => {
    if (!open || !observerTarget.current || isSearching || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadUsers();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isSearching, hasMore]);

  // Load initial data when modal opens
  useEffect(() => {
    if (open) {
      setUsers([]);
      setCursor(undefined);
      setHasMore(true);
      setSearchQuery("");
      setIsSearching(false);
      loadUsers(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const openPromoteDialog = (user: User) => {
    setSelectedUser(user);
    setPromoteDialogOpen(true);
  };

  const handlePromoteConfirm = async () => {
    if (!selectedUser) return;
    
    setPromotingUserId(selectedUser._id);
    try {
      await onPromote(selectedUser._id);
      setPromoteDialogOpen(false);
      setSelectedUser(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to promote user:", error);
    } finally {
      setPromotingUserId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select User to Promote</DialogTitle>
          <DialogDescription>
            Search for a user and promote them to admin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <Input
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">@{user.username}</p>
                  {(user.first_name || user.last_name) && (
                    <p className="text-sm text-muted-foreground truncate">
                      {user.first_name} {user.last_name}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => openPromoteDialog(user)}
                  disabled={promotingUserId === user._id}
                >
                  {promotingUserId === user._id ? "Promoting..." : "Promote"}
                </Button>
              </div>
            ))}

            {loading && (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            )}

            {!isSearching && hasMore && (
              <div ref={observerTarget} className="h-4" />
            )}

            {!loading && users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No users found" : "No users available"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Promote Confirmation Dialog */}
      <AlertDialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm User Promotion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote <strong>@{selectedUser?.username}</strong>
              {selectedUser?.first_name && selectedUser?.last_name && (
                <> ({selectedUser.first_name} {selectedUser.last_name})</>
              )} to admin? 
              This will grant them administrative privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={promotingUserId !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePromoteConfirm}
              disabled={promotingUserId !== null}
            >
              {promotingUserId ? "Promoting..." : "Promote to Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
