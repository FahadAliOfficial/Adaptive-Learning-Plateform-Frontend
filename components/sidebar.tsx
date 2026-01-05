"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Settings, LogOut, X, Brain, Menu, Sparkles, User, Target } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "from-blue-600 to-blue-500",
    hoverColor: "hover:bg-blue-50 dark:hover:bg-blue-950",
    activeColor: "bg-gradient-to-r from-blue-600 to-blue-500"
  },
  {
    name: "Practice",
    href: "/practice",
    icon: Target,
    color: "from-orange-600 to-orange-500",
    hoverColor: "hover:bg-orange-50 dark:hover:bg-orange-950",
    activeColor: "bg-gradient-to-r from-orange-600 to-orange-500"
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: Sparkles,
    color: "from-purple-600 to-pink-500",
    hoverColor: "hover:bg-purple-50 dark:hover:bg-purple-950",
    activeColor: "bg-gradient-to-r from-purple-600 to-pink-500"
  },
  {
    name: "My Learnings",
    href: "/learnings",
    icon: BookOpen,
    color: "from-green-600 to-green-500",
    hoverColor: "hover:bg-green-50 dark:hover:bg-green-950",
    activeColor: "bg-gradient-to-r from-green-600 to-green-500"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    color: "from-purple-600 to-purple-500",
    hoverColor: "hover:bg-purple-50 dark:hover:bg-purple-950",
    activeColor: "bg-gradient-to-r from-purple-600 to-purple-500"
  },
]

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-slate-800 shadow-lg hover:scale-110 transition-transform"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {(isOpen || isMobileOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => {
            onClose?.()
            setIsMobileOpen(false)
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen || isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  {siteName}
                </span>
                <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
                  AI Learning Platform
                </span>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-8 w-8"
              onClick={() => {
                onClose?.()
                setIsMobileOpen(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">Student</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Pro Member
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 mb-2">
              MENU
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  onClick={() => {
                    onClose?.()
                    setIsMobileOpen(false)
                  }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-2">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
              <ThemeToggle />
            </div>
            
            {/* Logout Button */}
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
              onClick={() => {
                onClose?.()
                setIsMobileOpen(false)
              }}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
