"use client";

import { useState, useMemo } from "react";
import { Admin } from "@/lib/api/admins";
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
import Link from "next/link";

interface AdminListProps {
  admins: Admin[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDemote: (userId: string) => Promise<void>;
  loading?: boolean;
}

export function AdminList({
  admins,
  currentPage,
  totalPages,
  onPageChange,
  onDemote,
  loading = false,
}: AdminListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [demoteDialogOpen, setDemoteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Filter out super_admins and apply search
  const filteredAdmins = useMemo(() => {
    return admins
      .filter((admin) => admin.role !== "super_admin")
      .filter((admin) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          admin.email.toLowerCase().includes(query) ||
          admin.username.toLowerCase().includes(query) ||
          `${admin.first_name} ${admin.last_name}`.toLowerCase().includes(query)
        );
      });
  }, [admins, searchQuery]);

  const openDemoteDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDemoteDialogOpen(true);
  };

  const handleDemoteConfirm = async () => {
    if (!selectedAdmin) return;

    setActionLoading(selectedAdmin._id);
    try {
      await onDemote(selectedAdmin._id);
      setDemoteDialogOpen(false);
      setSelectedAdmin(null);
    } finally {
      setActionLoading(null);
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
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search admins by username, email, or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  {searchQuery
                    ? "No admins found matching your search"
                    : "No admins found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell className="font-medium">
                    @{admin.username}
                  </TableCell>
                  <TableCell>
                    {admin.first_name || admin.last_name
                      ? `${admin.first_name} ${admin.last_name}`.trim()
                      : "-"}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{admin.role}</Badge>
                  </TableCell>
                  <TableCell>{admin.adminCredits}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/dashboard/admins/${admin._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDemoteDialog(admin)}
                      disabled={actionLoading === admin._id}
                    >
                      {actionLoading === admin._id ? "Demoting..." : "Demote"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Demote Confirmation Dialog */}
      <AlertDialog open={demoteDialogOpen} onOpenChange={setDemoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Admin Demotion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to demote{" "}
              <strong>@{selectedAdmin?.username}</strong> (
              {selectedAdmin?.email})? This will remove their admin privileges
              and they will become a regular user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDemoteConfirm}
              disabled={actionLoading !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? "Demoting..." : "Demote Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
