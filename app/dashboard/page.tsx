"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { MasteryHeatmap } from "@/components/mastery-heatmap"
import { DecayAlerts } from "@/components/decay-alerts"
import { RecommendedTopicCard } from "@/components/recommended-topic-card"
import { RecentSessions } from "@/components/recent-sessions"
import { TransferBoostAlert } from "@/components/transfer-boost-alert"
import { SynergyNotifications } from "@/components/synergy-notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Code2, Play, BookOpen, TrendingUp, Plus, Globe } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { 
  getDashboardSummary, 
  getActiveTransferBoosts, 
  getRecentSynergyBonuses,
  type DashboardSummary,
  type TransferBoost,
  type SynergyBonus,
  type RecommendedTopic
} from "@/lib/api/dashboard"

const languageMap: Record<string, { name: string; logo: string; color: string }> = {
  python_3: { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "from-blue-500 to-blue-600" },
  javascript_es6: { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "from-yellow-500 to-yellow-600" },
  cpp_20: { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", color: "from-purple-500 to-purple-600" },
  java_17: { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", color: "from-red-500 to-red-600" },
  go_1_21: { name: "Go", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg", color: "from-cyan-500 to-cyan-600" },
}

const difficulties = ["Easy", "Medium", "Hard"]

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null)
  const [learningCards, setLearningCards] = useState<any[]>([])
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [transferBoosts, setTransferBoosts] = useState<TransferBoost[]>([])
  const [synergyBonuses, setSynergyBonuses] = useState<SynergyBonus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "RAPL AI"

  // Check if user has selected a language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedLanguage = localStorage.getItem('selectedLanguage')
      
      // If user has language in their profile but not in localStorage, sync it
      if (!selectedLanguage && user?.last_active_language) {
        localStorage.setItem('selectedLanguage', user.last_active_language)
        setCurrentLanguage(user.last_active_language)
        return
      }
      
      if (!selectedLanguage && !user?.last_active_language) {
        // No language selected, redirect to onboarding
        router.push('/onboarding/language')
      } else {
        // Use localStorage language or fall back to user's profile language
        const languageToUse = selectedLanguage || user?.last_active_language || null
        setCurrentLanguage(languageToUse)
        
        // Check if learning card exists for this language
        const existingCards = localStorage.getItem('learningCards')
        if (existingCards) {
          setLearningCards(JSON.parse(existingCards))
        } else {
          // Create initial learning card for selected language
          const langData = languageMap[languageToUse || '']
          const initialCard = {
            id: 1,
            language_id: languageToUse,
            language: langData?.name || "Unknown",
            difficulty: 0.5,
            progress: 0,
            topicsCompleted: 0,
            totalTopics: 8,
            accuracy: 0,
          }
          setLearningCards([initialCard])
          localStorage.setItem('learningCards', JSON.stringify([initialCard]))
        }
      }
    }
  }, [router, user])

  // Fetch dashboard data when language is set
  useEffect(() => {
    if (!currentLanguage) return
    const languageId = currentLanguage

    async function fetchDashboardData() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch main dashboard summary (mastery, decay, RL recommendation, recent sessions)
        const summary = await getDashboardSummary(languageId)
        setDashboardData(summary)
        
        // Fetch transfer boosts and synergy bonuses (lower priority)
        try {
          const [boosts, bonuses] = await Promise.all([
            getActiveTransferBoosts(languageId),
            getRecentSynergyBonuses(languageId, 7)
          ])
          setTransferBoosts(boosts)
          setSynergyBonuses(bonuses)
        } catch (err) {
          // Non-critical - continue even if these fail
          console.warn("Failed to fetch transfer/synergy data:", err)
        }
        
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [currentLanguage])

  // Handlers
  const handleConceptClick = (conceptId: string) => {
    console.log("Concept clicked:", conceptId)
    // TODO: Navigate to practice page with concept pre-selected
    router.push(`/practice?concept=${conceptId}`)
  }

  const handleScheduleReview = (conceptId: string) => {
    console.log("Schedule review for:", conceptId)
    // TODO: Call API to schedule review
    // TODO: Navigate to practice with review mode
    router.push(`/practice?concept=${conceptId}&mode=review`)
  }

  const handleStartPractice = (conceptId: string, subTopic: string) => {
    console.log("Start practice:", conceptId, subTopic)
    // Navigate to practice with RL recommendation data
    const recommendation = dashboardData?.recommendation
    if (recommendation && recommendation.concept_id === conceptId) {
      // User clicked the RL-recommended topic - pass all RL data via URL params
      const difficulty = recommendation.target_difficulty
      const actionId = (recommendation as any).action_id || null  // If backend includes action_id
      
      router.push(`/practice?concept=${conceptId}&difficulty=${difficulty}&mode=exam${actionId ? `&rl_action_id=${actionId}` : ''}`)
    } else {
      // User clicked a different topic - regular practice mode
      router.push(`/practice?concept=${conceptId}&subtopic=${subTopic}`)
    }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  const currentLangData = languageMap[currentLanguage]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8 relative">
            <div className="absolute -top-4 left-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -top-4 right-0 w-32 h-32 bg-green-500/20 rounded-full filter blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">
                    Welcome to {siteName}! 👋
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    Create your personalized learning path and start mastering programming
                  </p>
                </div>
                
                {/* Current Language Badge */}
                {currentLangData && (
                  <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={currentLangData.logo} 
                          alt={`${currentLangData.name} logo`} 
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Learning</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{currentLangData.name}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push('/onboarding/language')}
                          className="ml-2"
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="relative overflow-hidden border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Paths</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{learningCards.length}</div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-green-100 dark:border-green-900/50 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Topics</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-green-600 dark:text-green-400">
                  {dashboardData?.mastery_data?.filter(m => m.mastery > 0).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-yellow-100 dark:border-yellow-900/50 hover:border-yellow-500 dark:hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Accuracy</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-slate-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
                  {dashboardData?.recent_sessions && dashboardData.recent_sessions.length > 0
                    ? Math.round(
                        dashboardData.recent_sessions.reduce((acc, session) => acc + session.score, 0) /
                          dashboardData.recent_sessions.length
                      )
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Languages</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {new Set(learningCards.map((c) => c.language)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Knowledge Decay Alerts */}
          {dashboardData?.decay_alerts && dashboardData.decay_alerts.length > 0 && (
            <div className="mb-8">
              <DecayAlerts 
                alerts={dashboardData.decay_alerts} 
                onScheduleReview={handleScheduleReview}
              />
            </div>
          )}

          {/* Cross-Language Transfer Boosts */}
          {transferBoosts.length > 0 && (
            <div className="mb-8">
              <TransferBoostAlert boosts={transferBoosts} />
            </div>
          )}

          {/* Synergy Bonuses */}
          {synergyBonuses.length > 0 && (
            <div className="mb-8">
              <SynergyNotifications bonuses={synergyBonuses} />
            </div>
          )}

          {/* AI Recommended Topic */}
          <div className="mb-8">
            {isLoading ? (
              <Card className="border-2 border-slate-200 dark:border-slate-700">
                <CardContent className="p-8">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <RecommendedTopicCard
                recommendation={dashboardData?.recommendation || null}
                onStartPractice={handleStartPractice}
              />
            )}
          </div>

          {/* Existing Learning Cards */}
          {learningCards.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-6 text-slate-900 dark:text-white">My Learning Paths</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {learningCards.map((card) => {
                  // Convert difficulty scale (0.0-1.0) to Easy/Medium/Hard for display
                  const getDifficultyLabel = (diff: number) => {
                    if (diff < 0.4) return "Easy"
                    if (diff < 0.7) return "Medium"
                    return "Hard"
                  }
                  
                  const difficultyLabel = getDifficultyLabel(card.difficulty)
                  const languageIcon = languageMap[card.language_id]?.logo || "📚"
                  
                  return (
                    <Card
                      key={card.id}
                      className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 group bg-white dark:bg-slate-800"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-[50px]"></div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <img 
                              src={languageIcon} 
                              alt={`${card.language} logo`} 
                              className="w-8 h-8 object-contain"
                            />
                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {card.language}
                            </CardTitle>
                          </div>
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                              difficultyLabel === "Easy"
                                ? "bg-green-600 text-white"
                                : difficultyLabel === "Medium"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {difficultyLabel}
                          </span>
                        </div>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                          {card.topicsCompleted} / {card.totalTopics} topics completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Progress</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{card.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Accuracy</span>
                        <span className="font-black text-lg text-green-600 dark:text-green-400">
                          {card.accuracy}%
                        </span>
                      </div>

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                        onClick={() =>
                          router.push(`/learnings/${card.id}`)
                        }
                      >
                        Open Learning Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 bg-slate-50 dark:bg-slate-800/50 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 shadow-lg mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Ready to Learn More?</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Visit My Learnings page to create a new learning path and continue your programming journey
                </p>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
                  onClick={() => router.push("/learnings")}
                >
                  Go to My Learnings
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      </div>
    </ProtectedRoute>
  )
}
