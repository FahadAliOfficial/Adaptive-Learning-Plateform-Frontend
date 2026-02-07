"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowRight, Mail, Lock, Sparkles, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { z } from "zod"

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error: authError, clearError } = useAuth()
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  const accountStatus = typeof authError === 'string' && authError.startsWith('ACCOUNT_STATUS:')
    ? authError.split(':')[1]
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setValidationErrors({})
    clearError()
    
    // Validate form with Zod
    const validation = loginSchema.safeParse(formData)
    
    if (!validation.success) {
      // Convert Zod errors to field-level errors
      const errors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message
        }
      })
      setValidationErrors(errors)
      return
    }
    
    try {
      // Call login API via AuthContext
      await login({
        email: formData.email,
        password: formData.password,
      })
      
      // Redirect is handled in AuthContext based on user.last_active_language
      
    } catch (err: any) {
      // Error handling is done in AuthContext
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-8 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-20 blur-3xl rounded-full animate-pulse" />
            <div className="relative h-32 w-32 rounded-3xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-2xl shadow-blue-500/50 rotate-6 hover:rotate-0 transition-transform duration-500">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
              {siteName}
            </h1>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome Back! 👋
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg">
              Continue your learning journey with personalized AI-driven education
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI-Powered Learning</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <Card className="w-full shadow-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-base text-slate-600 dark:text-slate-400">
              Login to your {siteName} account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {accountStatus && (
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    {accountStatus === 'suspended'
                      ? 'Your account is suspended.'
                      : 'Your account is inactive.'}
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                    Please contact the admins to restore access. fahadaliajizansar@gmail.com
                  </p>
                </div>
              </div>
            )}

            {(!accountStatus && (authError || Object.keys(validationErrors).length > 0)) && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    {authError || "Please fix the errors below"}
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className={`h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 ${
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className={`h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 ${
                      validationErrors.password ? 'border-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" 
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
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
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
