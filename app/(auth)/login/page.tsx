"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { login, type LoginRequest } from "@/lib/api/auth"
import { setToken, setUser } from "@/lib/auth/token"
import { loginSchema, type LoginFormData } from "@/lib/utils/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Validate on blur for better UX
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Determine if identifier is email or username
      const isEmail = data.identifier.includes('@')
      
      // Prepare login payload based on identifier type
      const loginPayload: LoginRequest = isEmail 
        ? { email: data.identifier, password: data.password }
        : { username: data.identifier, password: data.password }
      
      const response = await login(loginPayload)
      
      // Check if user is admin or super_admin
      if (!response.data.user.isAdmin || (response.data.role !== 'admin' && response.data.role !== 'super_admin')) {
        setErrorMessage("Access denied. Only admins and super admins can access this dashboard.")
        setIsLoading(false)
        return
      }
      
      // Extract token and user data from the nested response structure
      const authToken = response.data.token
      const userData = response.data.user
      
      // Store the token and user data in localStorage
      setToken(authToken)
      setUser(userData)
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: unknown) {
      // Handle different error types
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } }
        const status = axiosError.response?.status
        if (status === 401 || status === 400) {
          setErrorMessage("Invalid username/email or password. Please try again.")
        } else if (status === 403) {
          setErrorMessage("Access denied. You don't have permission to log in.")
        } else {
          setErrorMessage("An error occurred. Please try again later.")
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        setErrorMessage("Unable to connect to server. Please check your internet connection.")
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard Login</CardTitle>
          <CardDescription>
            Enter your username or email and password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username/Email Field */}
            <Field>
              <FieldLabel htmlFor="identifier">Username or Email</FieldLabel>
              <Input
                id="identifier"
                type="text"
                placeholder="username or admin@example.com"
                {...register("identifier")}
                disabled={isLoading}
              />
              <FieldError errors={errors.identifier ? [errors.identifier] : undefined} />
            </Field>

            {/* Password Field */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                disabled={isLoading}
              />
              <FieldError errors={errors.password ? [errors.password] : undefined} />
            </Field>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
