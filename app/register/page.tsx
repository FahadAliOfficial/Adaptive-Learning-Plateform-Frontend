"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Mail, Lock, Sparkles, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { formatAPIError } from "@/lib/api/client"
import { BrandLogo } from "@/components/brand-logo"
import { z } from "zod"

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerAuth, isLoading, error: authError, clearError } = useAuth()
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  })
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "RAPL AI"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setValidationErrors({})
    clearError()
    
    // Validate form with Zod
    const validation = registerSchema.safeParse(formData)
    
    if (!validation.success) {
      // Convert Zod errors to field-level errors
      const errors: Record<string, string> = {}
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message
        }
      })
      setValidationErrors(errors)
      return
    }
    
    try {
      // Register without language and experience - user will set during onboarding
      await registerAuth({
        email: formData.email,
        password: formData.password,
      })
      
      // AuthContext will handle redirect to onboarding
      
    } catch (err: any) {
      // Error handling is done in AuthContext
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-8 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 opacity-20 blur-3xl rounded-full animate-pulse" />
            <BrandLogo className="relative h-32 w-32 rounded-3xl p-2 shadow-2xl shadow-green-500/30 -rotate-6 hover:rotate-0 transition-transform duration-500" />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 via-blue-500 to-green-600 bg-clip-text text-transparent animate-gradient-x">
              {siteName}
            </h1>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Start Your Journey 🚀
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg">
              Join thousands of students mastering programming through AI-powered adaptive learning
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Personalized Learning Paths</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <Card className="w-full shadow-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-base text-slate-600 dark:text-slate-400">
              Sign up to start learning with {siteName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {(authError || Object.keys(validationErrors).length > 0) && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    {authError || "Please fix the errors below"}
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={`h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 ${
                      validationErrors.email ? 'border-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className={`h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 ${
                      validationErrors.password ? 'border-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className={`h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 ${
                      validationErrors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" 
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-800 text-slate-500">or</span>
                </div>
              </div>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-green-600 dark:text-green-400 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
