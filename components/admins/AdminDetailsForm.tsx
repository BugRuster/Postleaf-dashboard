"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Admin,
  updateAdminValidity,
  updateAdminCredits,
} from "@/lib/api/admins";
import {
  validitySchema,
  creditsSchema,
  type ValidityFormData,
  type CreditsFormData,
} from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
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

interface AdminDetailsFormProps {
  admin: Admin;
  onUpdate: () => void;
}

export function AdminDetailsForm({ admin, onUpdate }: AdminDetailsFormProps) {
  const [isUpdatingValidity, setIsUpdatingValidity] = useState(false);
  const [isUpdatingCredits, setIsUpdatingCredits] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validityDialogOpen, setValidityDialogOpen] = useState(false);
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
  const [pendingValidityData, setPendingValidityData] =
    useState<ValidityFormData | null>(null);
  const [pendingCreditsData, setPendingCreditsData] =
    useState<CreditsFormData | null>(null);

  // Calculate remaining validity time
  const calculateRemainingTime = () => {
    if (!admin.adminExpiryTime) return null;

    const now = new Date();
    const expiryDate = new Date(admin.adminExpiryTime);
    const diffMs = expiryDate.getTime() - now.getTime();

    if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
  };

  const remainingTime = calculateRemainingTime();

  const {
    register: registerValidity,
    handleSubmit: handleSubmitValidity,
    formState: { errors: validityErrors },
  } = useForm<ValidityFormData>({
    resolver: zodResolver(validitySchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      validity: admin.adminValidity || undefined,
    },
  });

  const {
    register: registerCredits,
    handleSubmit: handleSubmitCredits,
    formState: { errors: creditsErrors },
  } = useForm<CreditsFormData>({
    resolver: zodResolver(creditsSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      credits: admin.adminCredits,
    },
  });

  const onSubmitValidity = async (data: ValidityFormData) => {
    setPendingValidityData(data);
    setValidityDialogOpen(true);
  };

  const handleValidityConfirm = async () => {
    if (!pendingValidityData) return;

    setIsUpdatingValidity(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Send validity as a number to the API
      await updateAdminValidity(admin._id, {
        validity: pendingValidityData.validity,
      });
      setSuccessMessage("Validity updated successfully");
      setValidityDialogOpen(false);
      setPendingValidityData(null);
      onUpdate();
    } catch (error) {
      console.error("Failed to update validity:", error);
      setErrorMessage("Failed to update validity. Please try again.");
    } finally {
      setIsUpdatingValidity(false);
    }
  };

  const onSubmitCredits = async (data: CreditsFormData) => {
    setPendingCreditsData(data);
    setCreditsDialogOpen(true);
  };

  const handleCreditsConfirm = async () => {
    if (!pendingCreditsData) return;

    setIsUpdatingCredits(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateAdminCredits(admin._id, {
        credits: Number(pendingCreditsData.credits),
      });
      setSuccessMessage("Credits updated successfully");
      setCreditsDialogOpen(false);
      setPendingCreditsData(null);
      onUpdate();
    } catch (error) {
      console.error("Failed to update credits:", error);
      setErrorMessage("Failed to update credits. Please try again.");
    } finally {
      setIsUpdatingCredits(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
          <CardDescription>
            Basic information about this administrator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{admin.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge
                variant={admin.role === "super_admin" ? "default" : "secondary"}
              >
                {admin.role}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Ads
              </p>
              <p className="text-lg">0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p className="text-lg">
                {new Date(admin.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 text-green-800">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {errorMessage}
        </div>
      )}

      {/* Update Validity Card */}
      <Card>
        <CardHeader>
          <CardTitle>Update Validity</CardTitle>
          <CardDescription>
            Set the validity period in days for this admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Status and Time Remaining */}
          {remainingTime && (
            <div className="mb-6 p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Status
                </p>
                <Badge
                  variant={remainingTime.expired ? "destructive" : "default"}
                >
                  {remainingTime.expired ? "Expired" : "Active"}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Time Remaining
                </p>
                {remainingTime.expired ? (
                  <p className="text-sm text-destructive">No time remaining</p>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center px-3 py-2 bg-background rounded-md">
                      <span className="text-2xl font-bold">{remainingTime.days}</span>
                      <span className="text-xs text-muted-foreground">days</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-2 bg-background rounded-md">
                      <span className="text-2xl font-bold">{remainingTime.hours}</span>
                      <span className="text-xs text-muted-foreground">hrs</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-2 bg-background rounded-md">
                      <span className="text-2xl font-bold">{remainingTime.minutes}</span>
                      <span className="text-xs text-muted-foreground">mins</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmitValidity(onSubmitValidity)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel htmlFor="validity">Validity Period (Days)</FieldLabel>
              <Input
                id="validity"
                type="number"
                min="1"
                max="30"
                placeholder="Enter number of days (max 30)"
                {...registerValidity("validity", { valueAsNumber: true })}
                disabled={isUpdatingValidity}
              />
              <FieldError
                errors={
                  validityErrors.validity
                    ? [validityErrors.validity]
                    : undefined
                }
              />
            </Field>
            <Button type="submit" disabled={isUpdatingValidity}>
              {isUpdatingValidity ? "Updating..." : "Update Validity"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Update Credits Card */}
      <Card>
        <CardHeader>
          <CardTitle>Update Credits</CardTitle>
          <CardDescription>
            Set the credit amount for this admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmitCredits(onSubmitCredits)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel htmlFor="credits">Credits</FieldLabel>
              <Input
                id="credits"
                type="number"
                min="0"
                placeholder="Enter credit amount"
                {...registerCredits("credits", { valueAsNumber: true })}
                disabled={isUpdatingCredits}
              />
              <FieldError
                errors={
                  creditsErrors.credits ? [creditsErrors.credits] : undefined
                }
              />
            </Field>
            <Button type="submit" disabled={isUpdatingCredits}>
              {isUpdatingCredits ? "Updating..." : "Update Credits"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Validity Confirmation Dialog */}
      <AlertDialog
        open={validityDialogOpen}
        onOpenChange={setValidityDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Validity Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the validity period for{" "}
              <strong>@{admin.username}</strong> ({admin.email}) to{" "}
              <strong>{pendingValidityData?.validity} days</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingValidity}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleValidityConfirm}
              disabled={isUpdatingValidity}
            >
              {isUpdatingValidity ? "Updating..." : "Update Validity"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Credits Confirmation Dialog */}
      <AlertDialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Credits Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the credits for{" "}
              <strong>@{admin.username}</strong> ({admin.email}) to{" "}
              <strong>{pendingCreditsData?.credits} credits</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingCredits}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCreditsConfirm}
              disabled={isUpdatingCredits}
            >
              {isUpdatingCredits ? "Updating..." : "Update Credits"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
