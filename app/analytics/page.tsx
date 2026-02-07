"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { MasteryHeatmap } from "@/components/mastery-heatmap"
import { RecentSessions } from "@/components/recent-sessions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Target, Clock } from "lucide-react"

function AnalyticsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null)

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  // Check if user has selected a language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedLanguage = localStorage.getItem('selectedLanguage')
      
      if (!selectedLanguage) {
        router.push('/onboarding/language')
      } else {
        setCurrentLanguage(selectedLanguage)
      }
    }
  }, [router])

  // TODO: In production, fetch from API - POST /api/state-vector
  // Mock mastery data for current language
  const mockMasteryData = {
    UNIV_VAR: { mastery: 0.82, fluency: 0.75, confidence: 0.88, last_practiced: "2026-01-05T10:00:00Z", days_passed: 1 },
    UNIV_COND: { mastery: 0.68, fluency: 0.70, confidence: 0.65, last_practiced: "2026-01-03T14:00:00Z", days_passed: 3 },
    UNIV_LOOP: { mastery: 0.45, fluency: 0.50, confidence: 0.42, last_practiced: "2025-12-28T09:00:00Z", days_passed: 9 },
    UNIV_FUNC: { mastery: 0.0, fluency: 0.0, confidence: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
    UNIV_COLL: { mastery: 0.0, fluency: 0.0, confidence: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
    UNIV_ERR: { mastery: 0.0, fluency: 0.0, confidence: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
    UNIV_OOP_BASIC: { mastery: 0.0, fluency: 0.0, confidence: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
    UNIV_OOP_ADV: { mastery: 0.0, fluency: 0.0, confidence: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
  }

  // TODO: In production, fetch from API - GET /api/sessions/recent
  const mockRecentSessions = [
    {
      id: "1",
      timestamp: "2026-01-05T14:30:00Z",
      concept_id: "UNIV_VAR",
      concept_name: "Variables & Data Types",
      sub_topic: "variable_scope",
      score: 0.85,
      difficulty: 0.65,
      mastery_gain: 0.08,
      questions_answered: 10,
    },
    {
      id: "2",
      timestamp: "2026-01-03T10:15:00Z",
      concept_id: "UNIV_COND",
      concept_name: "Conditionals",
      sub_topic: "if_else_basics",
      score: 0.70,
      difficulty: 0.50,
      mastery_gain: 0.05,
      questions_answered: 8,
    },
    {
      id: "3",
      timestamp: "2025-12-28T16:45:00Z",
      concept_id: "UNIV_LOOP",
      concept_name: "Loops",
      sub_topic: "for_loop_basics",
      score: 0.60,
      difficulty: 0.45,
      mastery_gain: 0.03,
      questions_answered: 12,
    },
  ]

  // Calculate analytics stats
  const calculateStats = () => {
    const concepts = Object.values(mockMasteryData)
    const practiced = concepts.filter(c => c.mastery > 0)
    const avgMastery = practiced.length > 0 
      ? practiced.reduce((acc, c) => acc + c.mastery, 0) / practiced.length 
      : 0
    const avgFluency = practiced.length > 0
      ? practiced.reduce((acc, c) => acc + c.fluency, 0) / practiced.length
      : 0
    const avgConfidence = practiced.length > 0
      ? practiced.reduce((acc, c) => acc + c.confidence, 0) / practiced.length
      : 0
    
    const totalSessions = mockRecentSessions.length
    const avgScore = mockRecentSessions.length > 0
      ? mockRecentSessions.reduce((acc, s) => acc + s.score, 0) / mockRecentSessions.length
      : 0

    return {
      conceptsPracticed: practiced.length,
      avgMastery: Math.round(avgMastery * 100),
      avgFluency: Math.round(avgFluency * 100),
      avgConfidence: Math.round(avgConfidence * 100),
      totalSessions,
      avgScore: Math.round(avgScore * 100),
    }
  }

  const stats = calculateStats()

  // Handlers
  const handleConceptClick = (conceptId: string) => {
    console.log("Concept clicked:", conceptId)
    // TODO: Navigate to practice page with concept pre-selected
    router.push(`/practice?concept=${conceptId}`)
  }

  const handlePracticeAgain = (conceptId: string, subTopic: string) => {
    console.log("Practice again:", conceptId, subTopic)
    // TODO: Navigate to practice
    router.push(`/practice?concept=${conceptId}&subtopic=${subTopic}`)
  }

  // Show loading while checking language
  if (!currentLanguage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">
              Analytics & Insights
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Deep dive into your learning progress and performance
            </p>
          </div>

          {/* Analytics Stats */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <Card className="relative overflow-hidden border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Concepts Practiced</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{stats.conceptsPracticed}/8</div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Mastery</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.avgMastery}%</div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-green-100 dark:border-green-900/50 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Fluency</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-green-600 dark:text-green-400">{stats.avgFluency}%</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Time Efficiency</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Confidence</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{stats.avgConfidence}%</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Score Stability</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-cyan-100 dark:border-cyan-900/50 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Sessions</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{stats.totalSessions}</div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-yellow-100 dark:border-yellow-900/50 hover:border-yellow-500 dark:hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Score</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5 text-slate-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400">{stats.avgScore}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Mastery Heatmap */}
          <div className="mb-8">
            <MasteryHeatmap
              languageId={currentLanguage}
              masteryData={mockMasteryData}
              onConceptClick={handleConceptClick}
            />
          </div>

          {/* Recent Sessions Timeline */}
          <div className="mb-8">
            <RecentSessions
              sessions={mockRecentSessions}
              onPracticeAgain={handlePracticeAgain}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AnalyticsPageWrapper() {
  return (
    <ProtectedRoute>
      <AnalyticsPage />
    </ProtectedRoute>
  )
}
