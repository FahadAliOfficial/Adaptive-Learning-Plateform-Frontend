"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Menu, Brain, Sparkles } from "lucide-react"

interface NavbarProps {
  onMenuClick?: () => void
  showMenu?: boolean
}

export function Navbar({ onMenuClick, showMenu = false }: NavbarProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-blue-100/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm">
      <div className="container flex h-20 items-center px-4">
        {showMenu && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden hover:bg-blue-50 dark:hover:bg-slate-800"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
              {siteName}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-1">
              AI-Powered Learning
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 ml-8">
          <Link href="/#features">
            <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
              Features
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950">
              How It Works
            </Button>
          </Link>
          <Link href="/#testimonials">
            <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950">
              Testimonials
            </Button>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all font-semibold">
              <Sparkles className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
