"use client"

import { useCallback, useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Bell, CheckCircle2, Loader2, Palette, RefreshCw, Save, Shield, User } from "lucide-react"
import { changePassword, getMe, getNotificationPreferences, updateNotificationPreferences } from "@/lib/api/auth"
import { formatAPIError } from "@/lib/api/client"
import type { NotificationPreferences, User as UserProfile } from "@/lib/types/auth"

type Notice = {
  type: "success" | "error"
  text: string
}

type NotificationKey = keyof NotificationPreferences

const defaultNotifications: NotificationPreferences = {
  email_notifications: true,
  test_reminders: true,
  weekly_progress: true,
  achievement_alerts: true,
}

const notificationOptions: Array<{
  key: NotificationKey
  title: string
  description: string
}> = [
  {
    key: "email_notifications",
    title: "Email Notifications",
    description: "Receive email updates about your learning progress",
  },
  {
    key: "test_reminders",
    title: "Test Reminders",
    description: "Get reminders to complete pending tests",
  },
  {
    key: "weekly_progress",
    title: "Weekly Progress Report",
    description: "Receive weekly summaries of your learning activity",
  },
  {
    key: "achievement_alerts",
    title: "Achievement Alerts",
    description: "Get notified when you unlock achievements",
  },
]

function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [notifications, setNotifications] = useState<NotificationPreferences>(defaultNotifications)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [savingPreference, setSavingPreference] = useState<NotificationKey | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false)

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "RAPL AI"

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      setNotice(null)
      const [profileData, preferenceData] = await Promise.all([
        getMe(),
        getNotificationPreferences(),
      ])
      setProfile(profileData)
      setNotifications(preferenceData)
    } catch (error) {
      setNotice({
        type: "error",
        text: formatAPIError(error),
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const username = profile?.email.split("@")[0] || "Not available"
  const joinedAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "Not available"

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotice(null)

    if (passwordData.newPassword.length < 6) {
      setNotice({ type: "error", text: "New password must be at least 6 characters." })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotice({ type: "error", text: "New password and confirmation do not match." })
      return
    }

    try {
      setIsSavingPassword(true)
      const result = await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setNotice({ type: "success", text: result.message || "Password changed successfully." })
      setShowPasswordResetDialog(true)
    } catch (error) {
      setNotice({ type: "error", text: formatAPIError(error) })
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleNotificationToggle = async (key: NotificationKey) => {
    const previous = notifications
    const next = {
      ...notifications,
      [key]: !notifications[key],
    }

    setNotifications(next)
    setSavingPreference(key)
    setNotice(null)

    try {
      const saved = await updateNotificationPreferences(next)
      setNotifications(saved)
      setNotice({ type: "success", text: "Notification preferences saved." })
    } catch (error) {
      setNotifications(previous)
      setNotice({ type: "error", text: formatAPIError(error) })
    } finally {
      setSavingPreference(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Manage your account settings and preferences
              </p>
            </div>
            <Button variant="outline" onClick={loadSettings} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          {notice && (
            <div
              className={`mb-6 rounded-lg border p-4 flex items-start gap-3 ${
                notice.type === "success"
                  ? "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-100"
              }`}
            >
              {notice.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{notice.text}</p>
            </div>
          )}

          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Profile Information
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Profile data loaded from the backend account record
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile?.email || ""} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Active Language</Label>
                    <Input id="language" value={profile?.last_active_language || "Not selected"} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joined">Joined</Label>
                    <Input id="joined" value={joinedAt} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exams">Total Exams Taken</Label>
                    <Input id="exams" value={profile?.total_exams_taken?.toString() || "0"} disabled />
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Name and username editing are not available because those fields are not present in the current backend schema.
                </p>
              </CardContent>
            </Card>

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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Theme</div>
                    <div className="text-sm text-muted-foreground">
                      Toggle between light and dark mode
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  Notifications
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Manage your backend-saved notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationOptions.map((option) => {
                    const checked = notifications[option.key]
                    const saving = savingPreference === option.key

                    return (
                      <div key={option.key} className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">{option.title}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNotificationToggle(option.key)}
                          disabled={savingPreference !== null}
                          aria-pressed={checked}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
                            checked ? "bg-[rgb(var(--primary))]" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white transition-transform ${
                              checked ? "translate-x-6" : "translate-x-1"
                            }`}
                          >
                            {saving && <Loader2 className="h-3 w-3 animate-spin text-slate-600" />}
                          </span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  Security
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Change your password using the backend authentication API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      disabled={isSavingPassword}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        minLength={6}
                        disabled={isSavingPassword}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        disabled={isSavingPassword}
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="outline" className="gap-2" disabled={isSavingPassword}>
                    {isSavingPassword ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={showPasswordResetDialog} onOpenChange={setShowPasswordResetDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <DialogTitle className="text-center">Password Reset Successful</DialogTitle>
            <DialogDescription className="text-center">
              Your password has been changed successfully. Use the new password the next time you sign in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowPasswordResetDialog(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function SettingsPageWrapper() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  )
}
