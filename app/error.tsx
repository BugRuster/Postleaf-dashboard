"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WarningCircle } from "@phosphor-icons/react";

/**
 * Global Error Page
 * Catches errors in the app directory
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <WarningCircle className="h-6 w-6 text-destructive" weight="fill" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred. Please try again or contact support if
            the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-mono text-muted-foreground break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            variant="outline"
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
