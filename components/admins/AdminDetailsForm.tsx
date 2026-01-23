"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Admin, updateAdminValidity, updateAdminCredits } from "@/lib/api/admins"
import { validitySchema, creditsSchema, type ValidityFormData, type CreditsFormData } from "@/lib/utils/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"

interface AdminDetailsFormProps {
  admin: Admin
  onUpdate: () => void
}

export function AdminDetailsForm({ admin, onUpdate }: AdminDetailsFormProps) {
  const [isUpdatingValidity, setIsUpdatingValidity] = useState(false)
  const [isUpdatingCredits, setIsUpdatingCredits] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register: registerValidity,
    handleSubmit: handleSubmitValidity,
    formState: { errors: validityErrors },
  } = useForm<ValidityFormData>({
    resolver: zodResolver(validitySchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      validity: admin.validity,
    },
  })

  const {
    register: registerCredits,
    handleSubmit: handleSubmitCredits,
    formState: { errors: creditsErrors },
  } = useForm<CreditsFormData>({
    resolver: zodResolver(creditsSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      credits: admin.credits,
    },
  })

  const onSubmitValidity = async (data: ValidityFormData) => {
    setIsUpdatingValidity(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      await updateAdminValidity(admin.id, { validity: data.validity })
      setSuccessMessage("Validity updated successfully")
      onUpdate()
    } catch (error) {
      console.error("Failed to update validity:", error)
      setErrorMessage("Failed to update validity. Please try again.")
    } finally {
      setIsUpdatingValidity(false)
    }
  }

  const onSubmitCredits = async (data: CreditsFormData) => {
    setIsUpdatingCredits(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      await updateAdminCredits(admin.id, { credits: Number(data.credits) })
      setSuccessMessage("Credits updated successfully")
      onUpdate()
    } catch (error) {
      console.error("Failed to update credits:", error)
      setErrorMessage("Failed to update credits. Please try again.")
    } finally {
      setIsUpdatingCredits(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Admin Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
          <CardDescription>Basic information about this administrator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{admin.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge variant={admin.role === "super_admin" ? "default" : "secondary"}>
                {admin.role}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Ads</p>
              <p className="text-lg">{admin.activeAds}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-lg">{new Date(admin.createdAt).toLocaleDateString()}</p>
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
          <CardDescription>Set the validity period for this admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitValidity(onSubmitValidity)} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="validity">Validity Period</FieldLabel>
              <Input
                id="validity"
                type="text"
                placeholder="e.g., 2024-12-31 or 1 year"
                {...registerValidity("validity")}
                disabled={isUpdatingValidity}
              />
              <FieldError errors={validityErrors.validity ? [validityErrors.validity] : undefined} />
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
          <CardDescription>Set the credit amount for this admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitCredits(onSubmitCredits)} className="space-y-4">
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
              <FieldError errors={creditsErrors.credits ? [creditsErrors.credits] : undefined} />
            </Field>
            <Button type="submit" disabled={isUpdatingCredits}>
              {isUpdatingCredits ? "Updating..." : "Update Credits"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
