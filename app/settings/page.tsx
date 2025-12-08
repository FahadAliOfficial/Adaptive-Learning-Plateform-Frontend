"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Bell, Shield, Palette, Save } from "lucide-react"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    testReminders: true,
    weeklyProgress: false,
    achievementAlerts: true,
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add profile update logic
    console.log("Profile updated:", profileData)
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Profile Information
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({ ...profileData, username: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  Appearance
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Customize the look and feel of {siteName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Theme</div>
                      <div className="text-sm text-muted-foreground">
                        Toggle between light and dark mode
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="font-medium mb-3">Color Preview</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50" />
                        <div className="text-xs text-center text-slate-600 dark:text-slate-400">
                          Primary
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50" />
                        <div className="text-xs text-center text-slate-600 dark:text-slate-400">
                          Secondary
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50" />
                        <div className="text-xs text-center text-slate-600 dark:text-slate-400">
                          Accent
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  Notifications
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Receive email updates about your learning progress
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: !notifications.emailNotifications,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.emailNotifications
                          ? "bg-[rgb(var(--primary))]"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.emailNotifications
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Test Reminders</div>
                      <div className="text-sm text-muted-foreground">
                        Get reminders to complete pending tests
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          testReminders: !notifications.testReminders,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.testReminders
                          ? "bg-[rgb(var(--primary))]"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.testReminders
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Progress Report</div>
                      <div className="text-sm text-muted-foreground">
                        Receive weekly summaries of your learning activity
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          weeklyProgress: !notifications.weeklyProgress,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.weeklyProgress
                          ? "bg-[rgb(var(--primary))]"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.weeklyProgress
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Achievement Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when you unlock achievements
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          achievementAlerts: !notifications.achievementAlerts,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.achievementAlerts
                          ? "bg-[rgb(var(--primary))]"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.achievementAlerts
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  Security
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Password</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Change your password to keep your account secure
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="font-medium mb-2">Two-Factor Authentication</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="font-medium mb-2 text-destructive">
                    Delete Account
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
