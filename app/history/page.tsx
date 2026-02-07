"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  History, 
  Clock, 
  Trophy, 
  Target, 
  Filter, 
  Search,
  ChevronRight,
  Calendar,
  TrendingUp,
  Award
} from "lucide-react"
import { getSessionHistory, type SessionHistoryItem, type SessionHistoryFilters } from "@/lib/api/sessions"

const LANGUAGE_NAMES: Record<string, string> = {
  python_3: "Python",
  javascript_es6: "JavaScript",
  java_17: "Java",
  cpp_20: "C++",
  go_1_21: "Go",
  typescript_5: "TypeScript"
}

const SESSION_TYPE_COLORS = {
  practice: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  exam: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  review: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  diagnostic: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
}

function HistoryPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filters
  const [languageFilter, setLanguageFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchHistory()
  }, [languageFilter, typeFilter, currentPage])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const filters: SessionHistoryFilters = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      }

      if (languageFilter !== "all") {
        filters.language_id = languageFilter
      }

      if (typeFilter !== "all") {
        filters.session_type = typeFilter as any
      }

      const data = await getSessionHistory(filters)
      setSessions(data.sessions)
      setTotalCount(data.total_count)
    } catch (error) {
      console.error("Failed to fetch session history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getGradeColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-emerald-600 dark:text-emerald-400"
    if (accuracy >= 80) return "text-green-600 dark:text-green-400"
    if (accuracy >= 70) return "text-blue-600 dark:text-blue-400"
    if (accuracy >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getGradeLetter = (accuracy: number) => {
    if (accuracy >= 90) return "A+"
    if (accuracy >= 80) return "A"
    if (accuracy >= 70) return "B"
    if (accuracy >= 60) return "C"
    return "D"
  }

  const filteredSessions = sessions.filter((session) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        session.topic_name.toLowerCase().includes(term) ||
        session.major_topic_id.toLowerCase().includes(term)
      )
    }
    return true
  })

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <History className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                  Session History
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  View all your past exam sessions and results
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Sessions</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
                  </div>
                  <Trophy className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Avg. Accuracy</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {sessions.length > 0 
                        ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length)
                        : 0}%
                    </p>
                  </div>
                  <Target className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Practice Sessions</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {sessions.filter(s => s.session_type === 'practice').length}
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Exams Taken</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {sessions.filter(s => s.session_type === 'exam').length}
                    </p>
                  </div>
                  <Award className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 border-2 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Language
                  </label>
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {Object.entries(LANGUAGE_NAMES).map(([id, name]) => (
                        <SelectItem key={id} value={id}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Session Type
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="practice">Practice</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <Card className="border-2 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>All Sessions ({filteredSessions.length})</CardTitle>
              <CardDescription>Click on any session to view detailed results</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Loading sessions...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No sessions found
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {searchTerm || languageFilter !== "all" || typeFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Start practicing to build your history"}
                  </p>
                  <Button onClick={() => router.push("/practice")}>
                    Start Practice
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => router.push(`/results/${session.session_id}`)}
                      className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-slate-800"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={SESSION_TYPE_COLORS[session.session_type]}>
                              {session.session_type}
                            </Badge>
                            <Badge variant="outline">
                              {LANGUAGE_NAMES[session.language_id] || session.language_id}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 truncate">
                            {session.topic_name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(session.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(session.time_taken_seconds)}
                            </span>
                            <span>
                              {session.correct_count}/{session.question_count} correct
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className={`text-4xl font-black ${getGradeColor(session.accuracy)}`}>
                              {getGradeLetter(session.accuracy)}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {session.accuracy}%
                            </div>
                          </div>
                          <ChevronRight className="h-6 w-6 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default function HistoryPageWrapper() {
  return (
    <ProtectedRoute>
      <HistoryPage />
    </ProtectedRoute>
  )
}
