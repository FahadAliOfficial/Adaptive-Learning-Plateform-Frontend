"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowRight, Mail, Lock, User, Sparkles } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add registration logic
    console.log("Registration submitted:", formData)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-8 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 opacity-20 blur-3xl rounded-full animate-pulse" />
            <div className="relative h-32 w-32 rounded-3xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-green-500/50 -rotate-6 hover:rotate-0 transition-transform duration-500">
              <Brain className="h-16 w-16 text-white" />
            </div>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400"
                  />
                </div>
              </div>

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
                    className="h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400"
                  />
                </div>
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
                    className="h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400"
                  />
                </div>
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
                    className="h-12 pl-10 border-slate-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" size="lg">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
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
