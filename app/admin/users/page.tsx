"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, UserCheck, UserX, Edit, Mail, Calendar, Activity, Filter, Loader2, AlertCircle, Trash2, Shield } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  getUsers, 
  updateUserStatus, 
  updateUserDetails,
  resetUserPassword,
  deleteUser,
  getUserAnalytics, 
  type AdminUser, 
  type AdminUserAnalytics,
  type AdminUserUpdateRequest 
} from "@/lib/api/admin"
import { formatAPIError } from "@/lib/api/client"

// TODO: Add role-based access control when backend supports admin roles
export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<AdminUser[]>([])
  const [analytics, setAnalytics] = useState<AdminUserAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set())
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    language: "",
    status: "active" as 'active' | 'inactive' | 'suspended'
  })
  const [passwordResetForm, setPasswordResetForm] = useState({ newPassword: "", confirmPassword: "" })
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  const updateAnalyticsFromUsers = (nextUsers: AdminUser[]) => {
    const activeCount = nextUsers.filter(u => u.status === "active").length
    const inactiveCount = nextUsers.filter(u => u.status === "inactive").length
    const suspendedCount = nextUsers.filter(u => u.status === "suspended").length

    setAnalytics(prev => prev ? {
      ...prev,
      active_users: activeCount,
      inactive_users: inactiveCount,
      suspended_users: suspendedCount
    } : prev)
  }

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getUsers(searchQuery || undefined, statusFilter)
      setUsers(response.users)
      
      // Also load analytics
      const analyticsData = await getUserAnalytics()
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('Failed to load users:', err)
      setError(formatAPIError(err))
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount and when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers()
    }, 300) // Debounce search
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, statusFilter])

  // Initial load
  useEffect(() => {
    loadUsers()
  }, [])

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      setUpdatingUsers(prev => new Set(prev).add(userId))

      const response = await updateUserStatus(userId, newStatus)
      const updatedUser = response.updated_user

      setUsers(prevUsers => {
        const merged = prevUsers.map(user => user.id === userId ? { ...user, ...updatedUser } : user)
        const filtered = statusFilter === "all" ? merged : merged.filter(user => user.status === statusFilter)
        updateAnalyticsFromUsers(merged)
        return filtered
      })
    } catch (err) {
      console.error('Failed to update user status:', err)
      setError(formatAPIError(err))
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      language: user.language || "",
      status: user.status
    })
    setPasswordResetForm({ newPassword: "", confirmPassword: "" })
    setShowPasswordReset(false)
    setEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    
    try {
      setUpdatingUsers(prev => new Set(prev).add(editingUser.id))
      
      // Update user details
      const updates: AdminUserUpdateRequest = {}
      if (editForm.name !== editingUser.name) updates.name = editForm.name
      if (editForm.language !== (editingUser.language || "")) updates.language = editForm.language
      
      if (Object.keys(updates).length > 0) {
        await updateUserDetails(editingUser.id, updates)
      }
      
      // Update status if changed
      if (editForm.status !== editingUser.status) {
        await updateUserStatus(editingUser.id, editForm.status)
      }
      
      // Reset password if provided
      if (showPasswordReset && passwordResetForm.newPassword) {
        if (passwordResetForm.newPassword !== passwordResetForm.confirmPassword) {
          setError("Passwords do not match")
          return
        }
        await resetUserPassword(editingUser.id, passwordResetForm.newPassword)
      }
      
      setEditModalOpen(false)
      setEditingUser(null)
      await loadUsers()
      
    } catch (err) {
      console.error('Failed to update user:', err)
      setError(formatAPIError(err))
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(editingUser.id)
        return newSet
      })
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      setUpdatingUsers(prev => new Set(prev).add(userId))
      await deleteUser(userId)
      await loadUsers()
    } catch (err) {
      console.error('Failed to delete user:', err)
      setError(formatAPIError(err))
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  // Show loading state
  if (loading && users.length === 0) {
    return (
      <ProtectedRoute>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              View and manage platform users
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-slate-600">Loading users...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          View and manage platform users
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    analytics?.active_users || users.filter(u => u.status === "active").length
                  )}
                </p>
              </div>
              <UserCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 dark:border-yellow-900 bg-white dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Inactive Users</p>
                <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    analytics?.inactive_users || users.filter(u => u.status === "inactive").length
                  )}
                </p>
              </div>
              <Activity className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 dark:border-red-900 bg-white dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Suspended Users</p>
                <p className="text-3xl font-black text-red-600 dark:text-red-400">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    analytics?.suspended_users || users.filter(u => u.status === "suspended").length
                  )}
                </p>
              </div>
              <UserX className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl font-black">
            Users ({users.length})
            {loading && <Loader2 className="inline h-5 w-5 animate-spin ml-2" />}
          </CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">No users found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* User Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Joined {new Date(user.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3 w-3 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {user.lastActive 
                            ? `Last active ${new Date(user.lastActive).toLocaleDateString()}`
                            : 'Never active'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Language: <span className="font-semibold text-slate-900 dark:text-white">{user.language || 'Not Set'}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Sessions: <span className="font-semibold text-slate-900 dark:text-white">{user.sessionsCompleted}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Avg Mastery</span>
                          <span className="font-bold text-slate-900 dark:text-white">{user.avgMastery}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
                            style={{ width: `${user.avgMastery}%` }}
                          />
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === "active" 
                          ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                          : user.status === "inactive"
                          ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                          : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      disabled={updatingUsers.has(user.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    {/* Status Action Button */}
                                    <Select 
                                      value={user.status} 
                                      onValueChange={(newStatus: 'active' | 'inactive' | 'suspended') => handleStatusChange(user.id, newStatus)}
                                      disabled={updatingUsers.has(user.id)}
                                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={updatingUsers.has(user.id)}
                    >
                      {updatingUsers.has(user.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <DialogHeader>
        <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">Edit User: {editingUser?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
        <Label htmlFor="edit-name" className="text-slate-700 dark:text-slate-300">Display Name</Label>
        <Input
          id="edit-name"
          value={editForm.name}
          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter display name"
          className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
        />
          </div>
          
          <div className="space-y-2">
        <Label htmlFor="edit-email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
        <Input
          id="edit-email"
          value={editForm.email}
          disabled
          className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400"
          title="Email cannot be changed for security reasons"
        />
          </div>
          
          <div className="space-y-2">
        <Label htmlFor="edit-language" className="text-slate-700 dark:text-slate-300">Preferred Language</Label>
        <Select value={editForm.language || "not_set"} onValueChange={(value) => setEditForm(prev => ({ ...prev, language: value === "not_set" ? "" : value }))}>
          <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white">
        <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
        <SelectItem value="not_set">Not Set</SelectItem>
        <SelectItem value="python_3">Python</SelectItem>
        <SelectItem value="javascript_es6">JavaScript</SelectItem>
        <SelectItem value="java_17">Java</SelectItem>
        <SelectItem value="cpp_20">C++</SelectItem>
        <SelectItem value="go_1_21">Go</SelectItem>
          </SelectContent>
        </Select>
          </div>
          
          <div className="space-y-2">
        <Label htmlFor="edit-status" className="text-slate-700 dark:text-slate-300">Account Status</Label>
        <Select value={editForm.status} onValueChange={(value: 'active' | 'inactive' | 'suspended') => setEditForm(prev => ({ ...prev, status: value }))}>
          <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white">
        <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
        <SelectItem value="active">
          <div className="flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-green-500" />
        Active
          </div>
        </SelectItem>
        <SelectItem value="inactive">
          <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-yellow-500" />
        Inactive
          </div>
        </SelectItem>
        <SelectItem value="suspended">
          <div className="flex items-center gap-2">
        <UserX className="h-4 w-4 text-red-500" />
        Suspended
          </div>
        </SelectItem>
          </SelectContent>
        </Select>
          </div>
        </div>
        
        {/* User Statistics */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
          <div className="text-center">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{editingUser?.sessionsCompleted}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">Sessions</p>
          </div>
          <div className="text-center">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{editingUser?.avgMastery}%</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">Avg Mastery</p>
          </div>
          <div className="text-center">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {editingUser?.joinedAt ? new Date(editingUser.joinedAt).toLocaleDateString() : 'N/A'}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">Joined</p>
          </div>
        </div>
        
        {/* Password Reset Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Password Management</h3>
          </div>
          
          <Button
        type="button"
        variant={showPasswordReset ? "secondary" : "outline"}
        onClick={() => setShowPasswordReset(!showPasswordReset)}
        className="mb-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
        {showPasswordReset ? 'Cancel Password Reset' : 'Reset User Password'}
          </Button>
          
          {showPasswordReset && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
          <div className="space-y-2">
        <Label htmlFor="new-password" className="text-slate-700 dark:text-slate-300">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={passwordResetForm.newPassword}
          onChange={(e) => setPasswordResetForm(prev => ({ ...prev, newPassword: e.target.value }))}
          placeholder="Enter new password"
          className="bg-white dark:bg-slate-700 border-red-200 dark:border-red-900 text-slate-900 dark:text-white"
        />
          </div>
          <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-slate-700 dark:text-slate-300">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={passwordResetForm.confirmPassword}
          onChange={(e) => setPasswordResetForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
          placeholder="Confirm new password"
          className="bg-white dark:bg-slate-700 border-red-200 dark:border-red-900 text-slate-900 dark:text-white"
        />
          </div>
          {passwordResetForm.newPassword && passwordResetForm.confirmPassword && 
           passwordResetForm.newPassword !== passwordResetForm.confirmPassword && (
        <div className="col-span-full">
          <Alert className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50">
        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-700 dark:text-red-400">Passwords do not match</AlertDescription>
          </Alert>
        </div>
          )}
        </div>
          )}
        </div>
          </div>
          
          <DialogFooter>
        <Button variant="outline" onClick={() => setEditModalOpen(false)} className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
          Cancel
        </Button>
        <Button onClick={handleSaveEdit} disabled={updatingUsers.has(editingUser?.id || '')} className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white">
          {updatingUsers.has(editingUser?.id || '') ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saving...
        </>
          ) : (
        'Save Changes'
          )}
        </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  )
}
