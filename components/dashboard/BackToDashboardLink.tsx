"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

export function BackToDashboardLink() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-2 hover:bg-muted/80 mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Dashboard
    </Link>
  );
}
