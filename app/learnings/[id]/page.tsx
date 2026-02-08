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
import { getCurriculum, getTopicsForLanguage, getTopicByMappingId } from "@/lib/api/curriculum"
import { getRLRecommendation } from "@/lib/api/rl"
import { startExamSession } from "@/lib/api/exam"
import { useAuth } from "@/lib/contexts/auth-context"

type CoreConcept = {
  id: string
  name: string
  description: string
  order: number
}

// Fallback concepts (used if curriculum fetch fails)
const DEFAULT_CORE_CONCEPTS: CoreConcept[] = [
  {
    id: "UNIV_SYN_LOGIC",
    name: "Programming Logic Foundations",
    description: "Entry points, execution flow, and basic logic",
    order: 1,
  },
  {
    id: "UNIV_SYN_PREC",
    name: "Syntax Precision",
    description: "Syntax rules, scoping, and coding standards",
    order: 2,
  },
  {
    id: "UNIV_VAR",
    name: "Variables and Types",
    description: "Data storage, primitives, and basic values",
    order: 3,
  },
  {
    id: "UNIV_COND",
    name: "Conditionals",
    description: "Decision-making with if/else logic",
    order: 4,
  },
  {
    id: "UNIV_LOOP",
    name: "Iteration",
    description: "Loops, ranges, and repetition",
    order: 5,
  },
  {
    id: "UNIV_FUNC",
    name: "Functions",
    description: "Reusable code blocks and parameters",
    order: 6,
  },
  {
    id: "UNIV_COLL",
    name: "Data Structures",
    description: "Lists, dictionaries, and collections",
    order: 7,
  },
  {
    id: "UNIV_OOP",
    name: "OOP Basics",
    description: "Classes, objects, and inheritance",
    order: 8,
  },
]

// TODO: Remove mock data - fetch from backend
// API Endpoint: GET /api/learning-paths/{id}
// Expected Response: {
//   language_id: string,
//   language_name: string,
//   difficulty: number (0.0-1.0),
//   total_topics: number,
//   completed_topics: number,
//   avg_accuracy: number,
//   last_activity: ISO date string,
//   has_taken_demo: boolean,
//   topics: Array<{
//     concept_id: string,
//     mastery: number (0.0-1.0),
//     fluency: number,
//     confidence: number,
//     last_practiced: ISO date,
//     is_accessible: boolean,
//     is_recommended: boolean,
//     prerequisite_met: boolean
//   }>
// }
const mockLearningData = {
  language: "Python",
  difficulty: 0.5, // 0.0-1.0 scale
  totalTopics: 8,
  completedTopics: 3,
  accuracy: 75,
  lastActivity: "2 hours ago",
  hasTakenDemo: true,
  // Topic accessibility data from backend
  topicStatus: {
    UNIV_SYN_LOGIC: { mastery: 0.82, accessible: true, recommended: false, completed: true, accuracy: 85 },
    UNIV_SYN_PREC: { mastery: 0.68, accessible: true, recommended: false, completed: true, accuracy: 78 },
    UNIV_VAR: { mastery: 0.45, accessible: true, recommended: true, completed: false, accuracy: 65 },
    UNIV_COND: { mastery: 0.0, accessible: true, recommended: true, completed: false, accuracy: 0 },
    UNIV_LOOP: { mastery: 0.0, accessible: false, recommended: false, completed: false, accuracy: 0 },
    UNIV_FUNC: { mastery: 0.0, accessible: false, recommended: false, completed: false, accuracy: 0 },
    UNIV_COLL: { mastery: 0.0, accessible: false, recommended: false, completed: false, accuracy: 0 },
    UNIV_OOP: { mastery: 0.0, accessible: false, recommended: false, completed: false, accuracy: 0 },
  },
}

function LearningDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDemoPrompt, setShowDemoPrompt] = useState(!mockLearningData.hasTakenDemo)
  const [learningData, setLearningData] = useState(mockLearningData)
  const [coreConcepts, setCoreConcepts] = useState<CoreConcept[]>(DEFAULT_CORE_CONCEPTS)
  const [isStartingQuickPractice, setIsStartingQuickPractice] = useState<string | null>(null)

  // TODO: Fetch learning path data from backend on mount
  useEffect(() => {
    const fetchLearningPath = async () => {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/learning-paths/${params.id}`)
      // const data = await response.json()
      // setLearningData(data)

      const languageId = Array.isArray(params.id) ? params.id[0] : params.id
      if (!languageId) return

      try {
        const curriculum = await getCurriculum()
        const topics = getTopicsForLanguage(curriculum, languageId)
        if (topics.length === 0) {
          setCoreConcepts(DEFAULT_CORE_CONCEPTS)
          return
        }

        const concepts = topics.map((topic, index) => ({
          id: topic.mapping_id,
          name: topic.name,
          description: topic.sub_topics?.length
            ? `Covers: ${topic.sub_topics.slice(0, 3).join(", ")}`
            : "Core concept",
          order: index + 1,
        }))
        setCoreConcepts(concepts)
      } catch (error) {
        console.error("Failed to load curriculum:", error)
        setCoreConcepts(DEFAULT_CORE_CONCEPTS)
      }
    }
    fetchLearningPath()
  }, [params.id])

  const data = learningData
  const totalTopics = coreConcepts.length || data.totalTopics

  const getTopicStatus = (conceptId: string) => {
    const status = data.topicStatus[conceptId as keyof typeof data.topicStatus]
    if (status) return status
    return { mastery: 0, accessible: false, recommended: false, completed: false, accuracy: 0 }
  }

  // Convert difficulty to label
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.4) return "Easy"
    if (difficulty < 0.7) return "Medium"
    return "Hard"
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
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{data.language}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  getDifficultyLabel(data.difficulty) === "Easy"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                    : getDifficultyLabel(data.difficulty) === "Medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                {getDifficultyLabel(data.difficulty)}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Master {totalTopics} core programming concepts sequentially
            </p>
          </div>

          {/* Demo Test Prompt */}
          {showDemoPrompt && (
            <Card className="mb-8 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-200">
                  <div className="h-9 w-9 rounded-lg bg-yellow-500 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  Take Demo Test First
                </CardTitle>
                <CardDescription className="text-yellow-800 dark:text-yellow-300">
                  Start with a demo test to assess your current knowledge level and get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDemoTest} className="gap-2 bg-yellow-600 hover:bg-yellow-500 text-white">
                  <PlayCircle className="h-4 w-4" />
                  Take Demo Test
                </Button>
              </CardContent>
            </Card>
          )}

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
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalTopics}</div>
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
                  {data.completedTopics}/{totalTopics}
                </div>
                <Progress
                  value={totalTopics === 0 ? 0 : (data.completedTopics / totalTopics) * 100}
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
                  {data.accuracy}%
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
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{data.lastActivity}</div>
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
              {coreConcepts.map((concept) => {
                const status = getTopicStatus(concept.id)
                const isLocked = !status.accessible
                const isRecommended = status.recommended
                const isCompleted = status.completed
                const mastery = Math.round(status.mastery * 100)

                return (
                  <Card
                    key={concept.id}
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
                              concept.order
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <CardTitle className="text-xl text-slate-900 dark:text-white">
                                {concept.name}
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
                              {concept.description}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Mastery Score */}
                        {!isLocked && status.mastery > 0 && (
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
                        {status.mastery > 0 && (
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
                            handleQuickStart(concept.id, isCompleted)
                          }}
                          disabled={isStartingQuickPractice === concept.id}
                        >
                          {isStartingQuickPractice === concept.id ? (
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
