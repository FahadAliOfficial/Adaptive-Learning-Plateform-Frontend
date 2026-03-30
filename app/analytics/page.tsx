"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { MasteryHeatmap } from "@/components/mastery-heatmap"
import { RecentSessions } from "@/components/recent-sessions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatAPIError } from "@/lib/api/client"
import {
  getActiveTransferBoosts,
  getDashboardSummary,
  getRecentSynergyBonuses,
} from "@/lib/api/dashboard"
import { getLanguagePortfolio } from "@/lib/api/languages"
import { useAuth } from "@/lib/contexts/auth-context"
import { AlertTriangle, BarChart3, Clock, RefreshCw, Target, TrendingUp } from "lucide-react"

interface HeatmapConceptData {
  mastery: number
  fluency: number
  confidence: number
  last_practiced: string
  days_passed: number
}

interface RecentSessionData {
  id: string
  timestamp: string
  concept_id: string
  concept_name: string
  sub_topic: string
  score: number
  difficulty: number
  mastery_gain: number
  questions_answered: number
}

type HeatmapDataMap = Record<string, HeatmapConceptData>

interface LanguageOption {
  id: string
  name: string
  isPrimary: boolean
}

const SYNERGY_WINDOW_OPTIONS = [7, 14, 30, 60]

const ALL_LANGUAGE_OPTIONS: Array<{ id: string; name: string }> = [
  { id: "python_3", name: "Python" },
  { id: "javascript_es6", name: "JavaScript" },
  { id: "java_17", name: "Java" },
  { id: "cpp_20", name: "C++" },
  { id: "go_1_21", name: "Go" },
]

const SUPPORTED_LANGUAGE_IDS = new Set(ALL_LANGUAGE_OPTIONS.map((option) => option.id))

const LANGUAGE_NAME_FALLBACK: Record<string, string> = {
  python_3: "Python",
  javascript_es6: "JavaScript",
  java_17: "Java",
  cpp_20: "C++",
  go_1_21: "Go",
}

function mapMasteryForHeatmap(
  masteryData: Array<{
    mapping_id: string
    mastery: number
    fluency: number
    confidence: number
    last_practiced: string | null
    days_since_practice: number
  }>
): HeatmapDataMap {
  const mapped: HeatmapDataMap = {}

  for (const item of masteryData) {
    mapped[item.mapping_id] = {
      mastery: item.mastery,
      fluency: item.fluency,
      confidence: item.confidence,
      last_practiced: item.last_practiced ?? new Date().toISOString(),
      days_passed: Math.max(0, item.days_since_practice ?? 0),
    }
  }

  return mapped
}

function mapSessionsForTimeline(
  sessions: Array<{
    id: string
    timestamp: string
    concept_id: string
    concept_name: string
    sub_topic: string | null
    score: number
    difficulty: number
    mastery_gain: number
    questions_answered: number
  }>
): RecentSessionData[] {
  return sessions.map((session) => ({
    id: session.id,
    timestamp: session.timestamp,
    concept_id: session.concept_id,
    concept_name: session.concept_name,
    sub_topic: session.sub_topic ?? session.concept_id,
    score: session.score,
    difficulty: session.difficulty,
    mastery_gain: session.mastery_gain,
    questions_answered: session.questions_answered,
  }))
}

function normalizeToPercent(value: number): number {
  if (value <= 1) return value * 100
  return value
}

function AnalyticsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null)
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([])
  const [synergyWindowDays, setSynergyWindowDays] = useState(7)
  const [masteryData, setMasteryData] = useState<HeatmapDataMap>({})
  const [recentSessions, setRecentSessions] = useState<RecentSessionData[]>([])
  const [transferBoostCount, setTransferBoostCount] = useState(0)
  const [synergyBonusCount, setSynergyBonusCount] = useState(0)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Check if user has selected a language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedLanguage = localStorage.getItem('selectedLanguage')
      const profileLanguage = user?.last_active_language ?? null
      const languageToUse = selectedLanguage || profileLanguage
      
      if (!languageToUse) {
        router.push('/onboarding/language')
      } else {
        localStorage.setItem('selectedLanguage', languageToUse)
        setCurrentLanguage(languageToUse)
      }
    }
  }, [router, user])

  useEffect(() => {
    if (!currentLanguage) return
    const activeLanguage = currentLanguage

    let isMounted = true

    async function loadLanguageOptions() {
      try {
        const portfolio = await getLanguagePortfolio()
        const portfolioOptions = portfolio.languages
          .filter((language) => SUPPORTED_LANGUAGE_IDS.has(language.language_id))
          .map((language) => ({
            id: language.language_id,
            name: language.language_name,
            isPrimary: language.is_primary,
          }))

        const mergedById = new Map<string, LanguageOption>()
        for (const option of ALL_LANGUAGE_OPTIONS) {
          mergedById.set(option.id, {
            id: option.id,
            name: option.name,
            isPrimary: false,
          })
        }

        for (const option of portfolioOptions) {
          mergedById.set(option.id, option)
        }

        if (SUPPORTED_LANGUAGE_IDS.has(activeLanguage) && !mergedById.has(activeLanguage)) {
          mergedById.set(activeLanguage, {
            id: activeLanguage,
            name: LANGUAGE_NAME_FALLBACK[activeLanguage] ?? activeLanguage,
            isPrimary: false,
          })
        }

        const options = Array.from(mergedById.values()).sort((a, b) => {
          if (a.isPrimary !== b.isPrimary) {
            return a.isPrimary ? -1 : 1
          }
          return a.name.localeCompare(b.name)
        })

        if (!isMounted) return

        setLanguageOptions(options)

        if (!options.some((option) => option.id === currentLanguage)) {
          const fallbackLanguage = options.find((option) => option.isPrimary)?.id ?? options[0].id
          setCurrentLanguage(fallbackLanguage)
          localStorage.setItem('selectedLanguage', fallbackLanguage)
        }
      } catch {
        if (!isMounted) return
        setLanguageOptions([
          {
            id: activeLanguage,
            name: LANGUAGE_NAME_FALLBACK[activeLanguage] ?? activeLanguage,
            isPrimary: false,
          },
        ])
      }
    }

    loadLanguageOptions()

    return () => {
      isMounted = false
    }
  }, [currentLanguage])

  const fetchAnalyticsData = useCallback(async () => {
    if (!currentLanguage) return

    setIsLoadingData(true)
    setLoadError(null)

    try {
      const [summaryResult, transferBoostsResult, synergyBonusesResult] = await Promise.allSettled([
        getDashboardSummary(currentLanguage),
        getActiveTransferBoosts(currentLanguage),
        getRecentSynergyBonuses(currentLanguage, synergyWindowDays),
      ])

      if (summaryResult.status !== "fulfilled") {
        throw summaryResult.reason
      }

      const summary = summaryResult.value
      setMasteryData(mapMasteryForHeatmap(summary.mastery_data))
      setRecentSessions(mapSessionsForTimeline(summary.recent_sessions))
      setTransferBoostCount(transferBoostsResult.status === "fulfilled" ? transferBoostsResult.value.length : 0)
      setSynergyBonusCount(synergyBonusesResult.status === "fulfilled" ? synergyBonusesResult.value.length : 0)
    } catch (error) {
      setLoadError(formatAPIError(error))
      setMasteryData({})
      setRecentSessions([])
      setTransferBoostCount(0)
      setSynergyBonusCount(0)
    } finally {
      setIsLoadingData(false)
    }
  }, [currentLanguage, synergyWindowDays])

  const handleLanguageChange = (languageId: string) => {
    setCurrentLanguage(languageId)
    localStorage.setItem('selectedLanguage', languageId)
  }

  useEffect(() => {
    if (!currentLanguage) return
    fetchAnalyticsData()
  }, [currentLanguage, fetchAnalyticsData])

  // Calculate analytics stats
  const stats = useMemo(() => {
    const concepts = Object.values(masteryData)
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

    const totalSessions = recentSessions.length
    const avgScore = recentSessions.length > 0
      ? recentSessions.reduce((acc, session) => acc + normalizeToPercent(session.score), 0) / recentSessions.length
      : 0

    return {
      conceptsPracticed: practiced.length,
      avgMastery: Math.round(avgMastery * 100),
      avgFluency: Math.round(avgFluency * 100),
      avgConfidence: Math.round(avgConfidence * 100),
      totalSessions,
      avgScore: Math.round(avgScore),
    }
  }, [masteryData, recentSessions])

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

  // Show loading while checking language or fetching analytics
  if (!currentLanguage || isLoadingData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {!currentLanguage ? "Loading..." : "Loading your analytics..."}
          </p>
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

          <Card className="mb-6 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Analytics Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs text-slate-600 dark:text-slate-400">Language</p>
                  <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}{option.isPrimary ? " (Primary)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="mb-2 text-xs text-slate-600 dark:text-slate-400">Synergy Time Window</p>
                  <Select
                    value={String(synergyWindowDays)}
                    onValueChange={(value) => setSynergyWindowDays(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time window" />
                    </SelectTrigger>
                    <SelectContent>
                      {SYNERGY_WINDOW_OPTIONS.map((days) => (
                        <SelectItem key={days} value={String(days)}>
                          Last {days} days
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loadError && (
            <Alert className="mb-6 border-2 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40">
              <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-300" />
              <AlertDescription className="flex flex-col gap-3 text-amber-800 dark:text-amber-200 md:flex-row md:items-center md:justify-between">
                <span>Could not load analytics data: {loadError}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-300 bg-white text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-transparent dark:text-amber-200 dark:hover:bg-amber-900/50"
                  onClick={fetchAnalyticsData}
                >
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

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

          <Card className="mb-8 border-2 border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 dark:border-cyan-900/50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">Cross-Language Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {transferBoostCount > 0 || synergyBonusCount > 0
                  ? `Active transfer boosts: ${transferBoostCount}. Recent synergy bonuses (last ${synergyWindowDays} days): ${synergyBonusCount}.`
                  : "No cross-language boosts detected yet for your current language."}
              </p>
            </CardContent>
          </Card>

          {/* Mastery Heatmap */}
          <div className="mb-8">
            <MasteryHeatmap
              languageId={currentLanguage}
              masteryData={masteryData}
              onConceptClick={handleConceptClick}
            />
          </div>

          {/* Recent Sessions Timeline */}
          <div className="mb-8">
            <RecentSessions
              sessions={recentSessions}
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
