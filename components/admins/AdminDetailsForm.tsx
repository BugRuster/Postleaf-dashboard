"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Admin,
  updateAdminValidity,
  updateAdminCredits,
} from "@/lib/api/admins";
import {
  creditsSchema,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Coins, User, Calendar } from "@phosphor-icons/react";

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
  const [pendingValidityData, setPendingValidityData] = useState<number | null>(null);
  const [pendingCreditsData, setPendingCreditsData] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Validity state
  const [validityMode, setValidityMode] = useState<'15' | '30' | 'custom'>('15');
  const [customValidity, setCustomValidity] = useState<string>('');

  // Update current time every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate remaining validity time
  const calculateRemainingTime = () => {
    if (!admin.adminExpiryTime) return null;

    const expiryDate = new Date(admin.adminExpiryTime);
    console.log('Admin Expiry Time:', expiryDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }));
    
    const diffMs = expiryDate.getTime() - currentTime.getTime();

    if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
  };

  const remainingTime = calculateRemainingTime();

  const {
    register: registerCredits,
    handleSubmit: handleSubmitCredits,
    formState: { errors: creditsErrors },
  } = useForm<CreditsFormData>({
    resolver: zodResolver(creditsSchema),
    mode: "onBlur",
    defaultValues: {
      credits: admin.allocated_credits,
    },
  });

  const handleValiditySubmit = () => {
    let days: number;
    
    if (validityMode === 'custom') {
      days = parseFloat(customValidity);
      if (isNaN(days) || days <= 0) {
        setErrorMessage('Please enter a valid positive number');
        return;
      }
    } else {
      days = parseInt(validityMode);
    }

    setPendingValidityData(days);
    setValidityDialogOpen(true);
  };

  const onSubmitCredits = async (data: CreditsFormData) => {
    setPendingCreditsData(Number(data.credits));
    setCreditsDialogOpen(true);
  };

  const handleValidityConfirm = async () => {
    if (!pendingValidityData) return;

    setIsUpdatingValidity(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateAdminValidity(admin._id, {
        validity: pendingValidityData,
      });
      setSuccessMessage(`Validity updated to ${pendingValidityData} days successfully`);
      setValidityDialogOpen(false);
      setPendingValidityData(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to update validity:', error);
      setErrorMessage('Failed to update validity. Please try again.');
    } finally {
      setIsUpdatingValidity(false);
    }
  };

  const handleCreditsConfirm = async () => {
    if (pendingCreditsData === null) return;

    setIsUpdatingCredits(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateAdminCredits(admin._id, {
        credits: pendingCreditsData,
      });
      setSuccessMessage('Credits updated successfully');
      setCreditsDialogOpen(false);
      setPendingCreditsData(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to update credits:', error);
      setErrorMessage('Failed to update credits. Please try again.');
    } finally {
      setIsUpdatingCredits(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" weight="fill" />
            </div>
            <div>
              <CardTitle>Admin Information</CardTitle>
              <CardDescription>
                Basic details about this administrator
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Username</p>
              <p className="text-base font-medium">@{admin.username}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base font-medium">{admin.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge
                variant={admin.role === "super_admin" ? "default" : "secondary"}
                className="text-xs"
              >
                {admin.role === "super_admin" ? "Super Admin" : "Admin"}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Allocated Credits</p>
              <p className="text-base font-medium">{admin.allocated_credits}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Available Credits</p>
              <p className="text-base font-medium">{admin.available_credits}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-base font-medium">
                {new Date(admin.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="rounded-md bg-green-50 dark:bg-green-950 p-4 text-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Validity Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" weight="fill" />
              </div>
              <div>
                <CardTitle>Validity Period</CardTitle>
                <CardDescription>
                  Set how long this admin account remains active
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Status */}
            {remainingTime && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Current Status</p>
                  <Badge
                    variant={remainingTime.expired ? "destructive" : "default"}
                  >
                    {remainingTime.expired ? "Expired" : "Active"}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Time Remaining
                  </p>
                  {remainingTime.expired ? (
                    <p className="text-sm text-destructive">Account has expired</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col items-center px-2 py-3 bg-background rounded-lg border">
                        <span className="text-2xl font-bold">{remainingTime.days}</span>
                        <span className="text-xs text-muted-foreground mt-1">days</span>
                      </div>
                      <div className="flex flex-col items-center px-2 py-3 bg-background rounded-lg border">
                        <span className="text-2xl font-bold">{remainingTime.hours}</span>
                        <span className="text-xs text-muted-foreground mt-1">hours</span>
                      </div>
                      <div className="flex flex-col items-center px-2 py-3 bg-background rounded-lg border">
                        <span className="text-2xl font-bold">{remainingTime.minutes}</span>
                        <span className="text-xs text-muted-foreground mt-1">mins</span>
                      </div>
                      <div className="flex flex-col items-center px-2 py-3 bg-background rounded-lg border">
                        <span className="text-2xl font-bold">{remainingTime.seconds}</span>
                        <span className="text-xs text-muted-foreground mt-1">secs</span>
                      </div>
                    </div>
                  )}
                </div>

                {admin.adminExpiryTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Expires on {new Date(admin.adminExpiryTime).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Validity Options */}
            <div className="space-y-3">
              <FieldLabel>Select Validity Period</FieldLabel>
              <Tabs value={validityMode} onValueChange={(v) => setValidityMode(v as '15' | '30' | 'custom')}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="15">15 Days</TabsTrigger>
                  <TabsTrigger value="30">30 Days</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="custom" className="mt-3">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Enter number of days (e.g., 0.001, 1.5, 7)"
                    value={customValidity}
                    onChange={(e) => setCustomValidity(e.target.value)}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <Button
              onClick={handleValiditySubmit}
              disabled={isUpdatingValidity}
              className="w-full"
            >
              {isUpdatingValidity ? "Updating..." : "Update Validity"}
            </Button>
          </CardContent>
        </Card>

        {/* Update Credits Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Coins className="h-5 w-5 text-green-600 dark:text-green-400" weight="fill" />
              </div>
              <div>
                <CardTitle>Credits Management</CardTitle>
                <CardDescription>
                  Manage allocated credits for advertisements
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Credits */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Allocated Credits
                  </p>
                  <p className="text-3xl font-bold">{admin.allocated_credits}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Available Credits
                  </p>
                  <p className="text-3xl font-bold">{admin.available_credits}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Used: {admin.allocated_credits - admin.available_credits} credits
                </p>
              </div>
            </div>

            {/* Credits Form */}
            <form onSubmit={handleSubmitCredits(onSubmitCredits)} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="credits">New Allocated Credits</FieldLabel>
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
              <Button
                type="submit"
                disabled={isUpdatingCredits}
                className="w-full"
              >
                {isUpdatingCredits ? "Updating..." : "Update Credits"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

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
              <strong>@{admin.username}</strong> to{" "}
              <strong>{pendingValidityData} days</strong>?
              <br />
              <br />
              This will extend their admin access until{" "}
              {pendingValidityData && new Date(Date.now() + pendingValidityData * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}.
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
              {isUpdatingValidity ? "Updating..." : "Confirm Update"}
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
              Are you sure you want to update the allocated credits for{" "}
              <strong>@{admin.username}</strong> to{" "}
              <strong>{pendingCreditsData} credits</strong>?
              <br />
              <br />
              Current: {admin.allocated_credits} credits → New: {pendingCreditsData} credits
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
              {isUpdatingCredits ? "Updating..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
