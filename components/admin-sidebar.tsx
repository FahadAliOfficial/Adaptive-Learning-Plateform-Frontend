"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, LayoutDashboard, Users, Database, Flag, MessageSquare, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BrandLogo } from "@/components/brand-logo"

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview & Analytics"
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
    description: "View & manage users"
  },
  {
    name: "Question Bank",
    href: "/admin/questions",
    icon: Database,
    description: "Browse & edit questions"
  },
  {
    name: "Question Reports",
    href: "/admin/reports",
    icon: Flag,
    description: "User-reported questions"
  },
  {
    name: "User Queries",
    href: "/admin/queries",
    icon: MessageSquare,
    description: "Support tickets"
  },
  {
    name: "Quality Metrics",
    href: "/admin/metrics",
    icon: TrendingUp,
    description: "Question performance"
  },
]

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "RAPL AI"

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <Link href="/admin" className="flex items-center gap-2 group">
              <BrandLogo className="h-10 w-10 rounded-xl p-1.5 transition-transform group-hover:scale-110" />
              <div>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {siteName}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">Admin Panel</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname?.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  onClick={() => onClose?.()}
                >
                  <Icon className={cn(
                    "h-5 w-5 mt-0.5 flex-shrink-0",
                    isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold text-sm",
                      isActive ? "text-white" : ""
                    )}>
                      {item.name}
                    </p>
                    <p className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-white/90" : "text-slate-500 dark:text-slate-500"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full" size="sm">
                Back to Student View
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
