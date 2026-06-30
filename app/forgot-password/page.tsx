"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { ArrowLeft, CheckCircle2, Loader2, Mail, ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BrandLogo } from "@/components/brand-logo"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { forgotPassword } from "@/lib/api/auth"
import { formatAPIError } from "@/lib/api/client"

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordForm>({ email: "" })
  const [validationError, setValidationError] = useState("")
  const [serverError, setServerError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "RAPL AI"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")
    setServerError("")
    setSuccessMessage("")

    const validation = forgotPasswordSchema.safeParse(formData)
    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message || "Enter a valid email address")
      return
    }

    try {
      setIsLoading(true)
      const result = await forgotPassword({ email: formData.email })
      setSuccessMessage(result.message)
      setShowSuccessDialog(true)
    } catch (error) {
      setServerError(formatAPIError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader className="space-y-4 text-center">
          <BrandLogo className="mx-auto h-16 w-16 rounded-2xl p-1.5 shadow-lg shadow-blue-500/30" />
          <div>
            <CardTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
              Enter your {siteName} account email to request password reset assistance.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {(validationError || serverError) && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{validationError || serverError}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ email: e.target.value })}
                  disabled={isLoading}
                  required
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Request Password Reset
                </>
              )}
            </Button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <DialogTitle className="text-center">Password Reset Request Sent</DialogTitle>
            <DialogDescription className="text-center">
              {successMessage || "Your password reset request has been received."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
