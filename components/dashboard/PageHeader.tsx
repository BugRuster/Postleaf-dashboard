"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  onMenuClick: () => void;
}

export function PageHeader({
  title,
  description,
  actions,
  onMenuClick,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted lg:hidden"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Header content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
