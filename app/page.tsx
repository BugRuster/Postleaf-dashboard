"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth/token"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      // Redirect authenticated users to dashboard
      router.push("/dashboard")
    } else {
      // Redirect unauthenticated users to login
      router.push("/login")
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}