"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  PlayCircle,
  Lock,
  Lightbulb,
  Loader2,
} from "lucide-react"
import { getCurriculum, getTopicsForLanguage, getTopicByMappingId, getStudentProgress, type TopicProgress, type StudentProgressResponse } from "@/lib/api/curriculum"
import { getRLRecommendation } from "@/lib/api/rl"
import { startExamSession } from "@/lib/api/exam"
import { useAuth } from "@/lib/contexts/auth-context"

function LearningDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [progressData, setProgressData] = useState<StudentProgressResponse | null>(null)
  const [isStartingQuickPractice, setIsStartingQuickPractice] = useState<string | null>(null)

  // Fetch student progress data from backend
  useEffect(() => {
    const fetchStudentProgress = async () => {
      const languageId = Array.isArray(params.id) ? params.id[0] : params.id
      if (!languageId) return

      setIsLoading(true)
      try {
        const data = await getStudentProgress(languageId)
        setProgressData(data)
      } catch (error) {
        console.error("Failed to load student progress:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStudentProgress()
  }, [params.id])

  if (isLoading || !progressData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your progress...</p>
        </div>
      </div>
    )
  }

  const { topics, stats, language_name } = progressData
  
  // Calculate difficulty based on average mastery
  const difficulty = stats.avg_mastery

  // Convert difficulty to label
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.4) return "Beginner"
    if (difficulty < 0.7) return "Intermediate"
    return "Advanced"
  }

  // Format last activity timestamp
  const formatLastActivity = (timestamp: string | null): string => {
    if (!timestamp) return "Never"
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const handleDemoTest = () => {
    router.push(`/test/${params.id}?demo=true`)
  }

  const handleQuickStart = async (conceptId: string, isCompleted: boolean) => {
    /**
     * Quick Start Handler:
     * - Completed topics → Navigate to practice page with concept pre-filled (Practice Mode)
     * - Not completed → Use RL recommendation to start exam with AI-recommended settings (Exam Mode)
     */
    const languageId = Array.isArray(params.id) ? params.id[0] : params.id
    if (!languageId || !user?.id) {
      alert("Please login to continue")
      return
    }

    setIsStartingQuickPractice(conceptId)
    
    try {
      if (isCompleted) {
        // "Practice Again" - Navigate to practice page with concept pre-filled
        localStorage.setItem("selectedLanguage", languageId)
        router.push(`/practice?concept=${conceptId}&mode=practice`)
      } else {
        // "Start Learning" - Use RL recommendation and start exam
        localStorage.setItem("selectedLanguage", languageId)
        const recommendation = await getRLRecommendation({
          user_id: user.id,
          language_id: languageId,
          strategy: 'ppo',
          deterministic: true
        })

        // Start exam session with RL-recommended settings
        const response = await startExamSession({
          user_id: user.id,
          language_id: languageId,
          major_topic_id: recommendation.major_topic_id,
          session_type: 'exam'
        })

        // Get topic name from curriculum
        const curriculum = await getCurriculum()
        const topic = getTopicByMappingId(curriculum, languageId, recommendation.mapping_id)
        
        const sessionConfig = {
          session_id: response.session_id,
          mapping_id: recommendation.mapping_id,
          major_topic_id: recommendation.major_topic_id,
          concept_name: topic?.name || 'Assessment',
          difficulty: recommendation.difficulty,
          question_count: 15, // Default for RL exam
          mode: 'exam',
          language_id: languageId
        }
        localStorage.setItem('currentSession', JSON.stringify(sessionConfig))

        router.push(`/test/${response.session_id}`)
      }
    } catch (error: any) {
      console.error('Failed to start quick practice:', error)
      alert(error?.data?.detail || error?.message || 'Failed to start session. Please try again.')
    } finally {
      setIsStartingQuickPractice(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{language_name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  getDifficultyLabel(difficulty) === "Beginner"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                    : getDifficultyLabel(difficulty) === "Intermediate"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                {getDifficultyLabel(difficulty)}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Master {stats.total_topics} core programming concepts sequentially
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Concepts</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total_topics}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Core programming topics
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Mastered</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-green-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.completed_topics}/{stats.total_topics}
                </div>
                <Progress
                  value={stats.total_topics === 0 ? 0 : (stats.completed_topics / stats.total_topics) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Accuracy</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.avg_accuracy}%
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Across completed topics
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Activity</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-orange-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatLastActivity(stats.last_activity)}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Keep the momentum!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Topics Section - Sequential Learning Path */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Learning Path</h2>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Complete topics in order to unlock the next
              </div>
            </div>

            <div className="grid gap-4">
              {topics.map((topic) => {
                const isLocked = !topic.accessible
                const isRecommended = topic.recommended || false
                const isCompleted = topic.completed
                const mastery = Math.round(topic.mastery * 100)

                return (
                  <Card
                    key={topic.mapping_id}
                    className={`transition-all relative ${
                      isLocked
                        ? "opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Order Number */}
                          <div className={`
                            flex items-center justify-center h-10 w-10 rounded-full font-bold text-lg shrink-0
                            ${isCompleted 
                              ? "bg-green-600 text-white" 
                              : isLocked 
                              ? "bg-slate-200 dark:bg-slate-700 text-slate-400"
                              : "bg-blue-600 text-white"
                            }
                          `}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-6 w-6" />
                            ) : isLocked ? (
                              <Lock className="h-5 w-5" />
                            ) : (
                              topic.order
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <CardTitle className="text-xl text-slate-900 dark:text-white">
                                {topic.name}
                              </CardTitle>
                              
                              {isRecommended && !isCompleted && !isLocked && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                  <Lightbulb className="h-3 w-3" />
                                  Recommended
                                </span>
                              )}
                              
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Mastered
                                </span>
                              )}
                              
                              {isLocked && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                  <Lock className="h-3 w-3" />
                                  Locked
                                </span>
                              )}
                            </div>
                            
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              {topic.description}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Mastery Score */}
                        {!isLocked && topic.mastery > 0 && (
                          <div className="text-right shrink-0">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Mastery</div>
                            <div className={`text-2xl font-bold ${
                              mastery >= 75 
                                ? "text-green-600 dark:text-green-400"
                                : mastery >= 50
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-orange-600 dark:text-orange-400"
                            }`}>
                              {mastery}%
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    {!isLocked && (
                      <CardContent className="space-y-4">
                        {/* Mastery Progress Bar */}
                        {topic.mastery > 0 && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-slate-600 dark:text-slate-400">Progress</span>
                              <span className="font-semibold text-slate-900 dark:text-white">{mastery}%</span>
                            </div>
                            <Progress value={mastery} />
                          </div>
                        )}

                        {/* Action Button */}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickStart(topic.mapping_id, isCompleted)
                          }}
                          disabled={isStartingQuickPractice === topic.mapping_id}
                        >
                          {isStartingQuickPractice === topic.mapping_id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Starting...
                            </>
                          ) : (
                            isCompleted ? "Practice Again" : "Start Learning"
                          )}
                        </Button>
                      </CardContent>
                    )}

                    {/* Locked State Message */}
                    {isLocked && (
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Lock className="h-4 w-4" />
                          <span>Complete previous topics to unlock</span>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function LearningDetailPageWrapper() {
  return (
    <ProtectedRoute>
      <LearningDetailPage />
    </ProtectedRoute>
  )
}
