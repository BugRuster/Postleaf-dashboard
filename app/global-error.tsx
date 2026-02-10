"use client";

import { useEffect } from "react";

/**
 * Global Error Handler
 * Catches errors in the root layout
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "1rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              padding: "2rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              backgroundColor: "white",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#dc2626",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "1.5rem",
              }}
            >
              An unexpected error occurred. Please refresh the page or contact
              support if the problem persists.
            </p>
            {process.env.NODE_ENV === "development" && (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.375rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    color: "#4b5563",
                    wordBreak: "break-word",
                  }}
                >
                  {error.message}
                </p>
              </div>
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
