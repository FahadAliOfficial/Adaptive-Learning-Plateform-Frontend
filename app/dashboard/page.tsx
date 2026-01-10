"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { MasteryHeatmap } from "@/components/mastery-heatmap"
import { DecayAlerts } from "@/components/decay-alerts"
import { RecommendedTopicCard } from "@/components/recommended-topic-card"
import { RecentSessions } from "@/components/recent-sessions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Code2, Play, BookOpen, TrendingUp, Plus, Globe } from "lucide-react"

const languageMap: Record<string, { name: string; logo: string; color: string }> = {
  python_3: { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "from-blue-500 to-blue-600" },
  javascript_es6: { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "from-yellow-500 to-yellow-600" },
  cpp_20: { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", color: "from-purple-500 to-purple-600" },
  java_17: { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", color: "from-red-500 to-red-600" },
  typescript: { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "from-blue-400 to-blue-500" },
  go_1_21: { name: "Go", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg", color: "from-cyan-500 to-cyan-600" },
}

const difficulties = ["Easy", "Medium", "Hard"]

export default function DashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null)
  const [learningCards, setLearningCards] = useState<any[]>([])

  // TODO: In production, fetch from API - GET /api/user/learning-paths
  // Expected response: Array of learning paths with progress data

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  // Check if user has selected a language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedLanguage = localStorage.getItem('selectedLanguage')
      
      // TODO: In production, fetch from API - GET /api/user/profile
      // Expected response: { user_id, email, language_id, languages_learning[] }
      
      if (!selectedLanguage) {
        // No language selected, redirect to onboarding
        router.push('/onboarding/language')
      } else {
        setCurrentLanguage(selectedLanguage)
        
        // Check if learning card exists for this language
        const existingCards = localStorage.getItem('learningCards')
        if (existingCards) {
          setLearningCards(JSON.parse(existingCards))
        } else {
          // Create initial learning card for selected language
          const langData = languageMap[selectedLanguage]
          const initialCard = {
            id: 1,
            language_id: selectedLanguage,
            language: langData?.name || "Unknown",
            difficulty: 0.5, // Medium difficulty (0.0-1.0 scale)
            progress: 0,
            topicsCompleted: 0,
            totalTopics: 8, // 8 universal concepts
            accuracy: 0,
          }
          setLearningCards([initialCard])
          localStorage.setItem('learningCards', JSON.stringify([initialCard]))
        }
      }
    }
  }, [router])

  // TODO: In production, fetch from API - POST /api/state-vector
  // Mock mastery data for current language
  const mockMasteryData = {
    UNIV_VAR: { mastery: 0.82, last_practiced: "2026-01-05T10:00:00Z", days_passed: 1 },
    UNIV_COND: { mastery: 0.68, last_practiced: "2026-01-03T14:00:00Z", days_passed: 3 },
    UNIV_LOOP: { mastery: 0.45, last_practiced: "2025-12-28T09:00:00Z", days_passed: 9 },
    UNIV_FUNC: { mastery: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
    UNIV_COLL: { mastery: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
    UNIV_ERR: { mastery: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
    UNIV_OOP_BASIC: { mastery: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
    UNIV_OOP_ADV: { mastery: 0.0, last_practiced: "2026-01-06T00:00:00Z", days_passed: 0 },
  }

  // TODO: Calculate decay alerts from mastery data
  // Alert if current mastery < 0.5 after decay
  const mockDecayAlerts = [
    {
      concept_id: "UNIV_LOOP",
      concept_name: "Loops",
      current_mastery: 0.45 * Math.exp(-0.02 * 9), // 0.37
      original_mastery: 0.45,
      days_passed: 9,
    },
  ]

  // TODO: In production, get from RL model recommendation
  const mockRecommendation = {
    concept_id: "UNIV_LOOP",
    concept_name: "Loops",
    sub_topic: "for_loop_basics",
    target_difficulty: 0.5,
    estimated_time_minutes: 15,
    reason: "Your Loops mastery has decayed and needs reinforcement. Start with basics before advancing to nested loops.",
    prerequisite_met: true,
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
  ]

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
    // TODO: Navigate to practice configuration page
    router.push(`/practice?concept=${conceptId}&subtopic=${subTopic}`)
  }

  const handlePracticeAgain = (conceptId: string, subTopic: string) => {
    console.log("Practice again:", conceptId, subTopic)
    // TODO: Navigate to practice
    router.push(`/practice?concept=${conceptId}&subtopic=${subTopic}`)
  }

  // Show loading while checking language
  if (!currentLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  const currentLangData = languageMap[currentLanguage]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                  <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
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
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Paths</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{learningCards.length}</div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-green-100 dark:border-green-900/50 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Topics</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-green-600 dark:text-green-400">
                  {learningCards.reduce((acc, card) => acc + card.topicsCompleted, 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-yellow-100 dark:border-yellow-900/50 hover:border-yellow-500 dark:hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Accuracy</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/50 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-slate-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
                  {learningCards.length > 0
                    ? Math.round(
                        learningCards.reduce((acc, card) => acc + card.accuracy, 0) /
                          learningCards.length
                      )
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Languages</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
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
          {mockDecayAlerts.length > 0 && (
            <div className="mb-8">
              <DecayAlerts 
                alerts={mockDecayAlerts} 
                onScheduleReview={handleScheduleReview}
              />
            </div>
          )}

          {/* AI Recommended Topic */}
          <div className="mb-8">
            <RecommendedTopicCard
              recommendation={mockRecommendation}
              onStartPractice={handleStartPractice}
            />
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
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-[50px]"></div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{languageIcon}</span>
                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {card.language}
                            </CardTitle>
                          </div>
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                              difficultyLabel === "Easy"
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                : difficultyLabel === "Medium"
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                                : "bg-gradient-to-r from-red-500 to-red-600 text-white"
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
                            className="h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Accuracy</span>
                        <span className="font-black text-lg text-green-600 dark:text-green-400">
                          {card.accuracy}%
                        </span>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
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
          <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-slate-800/50 dark:to-slate-700/50 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-green-500 shadow-lg mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Ready to Learn More?</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Visit My Learnings page to create a new learning path and continue your programming journey
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
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
  )
}
