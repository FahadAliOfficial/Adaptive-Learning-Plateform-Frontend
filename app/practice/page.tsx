"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Target, 
  Gauge, 
  Hash, 
  Zap, 
  PlayCircle,
  Variable,
  GitBranch,
  RefreshCw,
  FunctionSquare,
  Database,
  AlertTriangle,
  Box,
  Boxes
} from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { getCurriculum, getTopicByMappingId, getTopicsForLanguage, type LanguageCurriculum } from "@/lib/api/curriculum"
import { startExamSession } from "@/lib/api/exam"

const CONCEPT_META: Record<string, { icon: typeof Target; color: string }> = {
  UNIV_SYN_LOGIC: { icon: Variable, color: "from-blue-600 to-blue-500" },
  UNIV_SYN_PREC: { icon: GitBranch, color: "from-green-600 to-green-500" },
  UNIV_VAR: { icon: Variable, color: "from-blue-600 to-blue-500" },
  UNIV_COND: { icon: GitBranch, color: "from-green-600 to-green-500" },
  UNIV_LOOP: { icon: RefreshCw, color: "from-purple-600 to-purple-500" },
  UNIV_FUNC: { icon: FunctionSquare, color: "from-orange-600 to-orange-500" },
  UNIV_COLL: { icon: Database, color: "from-pink-600 to-pink-500" },
  UNIV_ERR: { icon: AlertTriangle, color: "from-red-600 to-red-500" },
  UNIV_OOP: { icon: Box, color: "from-yellow-600 to-yellow-500" },
  UNIV_OOP_BASIC: { icon: Box, color: "from-yellow-600 to-yellow-500" },
  UNIV_OOP_ADV: { icon: Boxes, color: "from-indigo-600 to-indigo-500" },
}

const DEFAULT_CONCEPT_META = { icon: Target, color: "from-slate-600 to-slate-500" }

const MODES = [
  { 
    id: "practice", 
    name: "Practice Mode", 
    description: "Learn with hints and explanations",
    icon: Target,
    color: "from-blue-600 to-blue-500"
  },
  { 
    id: "exam", 
    name: "Exam Mode", 
    description: "Test your knowledge under pressure",
    icon: Zap,
    color: "from-red-600 to-red-500"
  },
  { 
    id: "review", 
    name: "Review Mode", 
    description: "Reinforce concepts you've decayed",
    icon: RefreshCw,
    color: "from-green-600 to-green-500"
  },
]

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 40, 50]

const DIFFICULTY_LABELS = [
  { value: 0.3, label: "Easy", color: "text-green-600 dark:text-green-400" },
  { value: 0.5, label: "Medium", color: "text-yellow-600 dark:text-yellow-400" },
  { value: 0.7, label: "Hard", color: "text-orange-600 dark:text-orange-400" },
  { value: 1.0, label: "Expert", color: "text-red-600 dark:text-red-400" },
]

function PracticeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null)
  const [curriculum, setCurriculum] = useState<LanguageCurriculum[]>([])
  const [isStarting, setIsStarting] = useState(false)

  // Configuration state
  const [selectedConcept, setSelectedConcept] = useState<string>("")
  const [difficulty, setDifficulty] = useState<number>(0.5)
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [mode, setMode] = useState<string>("practice")

  // Check language and pre-fill from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedLanguage = localStorage.getItem('selectedLanguage')
      
      if (!selectedLanguage) {
        router.push('/onboarding/language')
      } else {
        setCurrentLanguage(selectedLanguage)
        loadCurriculum()

        // Pre-fill from URL params
        const conceptParam = searchParams.get('concept')
        const modeParam = searchParams.get('mode')
        
        if (conceptParam) {
          setSelectedConcept(conceptParam)
        }
        if (modeParam && ['practice', 'exam', 'review'].includes(modeParam)) {
          setMode(modeParam)
        }
      }
    }
  }, [router, searchParams])

  const loadCurriculum = async () => {
    const data = await getCurriculum()
    setCurriculum(data)
  }

  const getDifficultyLabel = () => {
    if (difficulty <= 0.4) return DIFFICULTY_LABELS[0]
    if (difficulty <= 0.6) return DIFFICULTY_LABELS[1]
    if (difficulty <= 0.8) return DIFFICULTY_LABELS[2]
    return DIFFICULTY_LABELS[3]
  }

  const handleStartPractice = async () => {
    if (!selectedConcept) {
      alert("Please select a concept to practice")
      return
    }

    if (!currentLanguage || !user?.id) {
      alert("Please login and select a language before starting")
      return
    }

    const topic = getTopicByMappingId(curriculum, currentLanguage, selectedConcept)
    if (!topic) {
      alert("Selected topic not found for this language")
      return
    }

    setIsStarting(true)
    try {
      const response = await startExamSession({
        user_id: user.id,
        language_id: currentLanguage,
        major_topic_id: topic.major_topic_id,
        session_type: mode as "practice" | "exam" | "review"
      })

      const sessionConfig = {
        session_id: response.session_id,
        mapping_id: selectedConcept,
        major_topic_id: topic.major_topic_id,
        concept_name: topic.name,
        difficulty,
        question_count: questionCount,
        mode,
        language_id: currentLanguage
      }
      localStorage.setItem('currentSession', JSON.stringify(sessionConfig))

      router.push(`/test/${response.session_id}`)
    } catch (error: any) {
      console.error("Failed to start session:", error)
      const errorMessage = error?.data?.detail || error?.message || "Failed to start session. Please try again."
      alert(errorMessage)
    } finally {
      setIsStarting(false)
    }
  }

  const difficultyLabel = getDifficultyLabel()
  const availableConcepts = currentLanguage ? getTopicsForLanguage(curriculum, currentLanguage) : []
  const selectedConceptInfo = availableConcepts.find((topic) => topic.mapping_id === selectedConcept)
  const selectedConceptMeta = selectedConceptInfo
    ? (CONCEPT_META[selectedConceptInfo.mapping_id] || DEFAULT_CONCEPT_META)
    : null
  const selectedMode = MODES.find(m => m.id === mode)

  if (!currentLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              Configure Your Practice
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Choose your topic, difficulty, and mode to start learning
            </p>
          </div>

          <div className="grid gap-6">
            {/* Concept Selection */}
            <Card className="border-2 border-purple-200 dark:border-purple-900/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Select Concept</CardTitle>
                    <CardDescription>Choose the topic you want to practice</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Select value={selectedConcept} onValueChange={setSelectedConcept}>
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Choose a concept..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableConcepts.map((concept) => {
                      const meta = CONCEPT_META[concept.mapping_id] || DEFAULT_CONCEPT_META
                      const Icon = meta.icon
                      return (
                        <SelectItem key={concept.mapping_id} value={concept.mapping_id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{concept.name}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                {selectedConceptInfo && selectedConceptMeta && (
                  <div className={`mt-4 p-4 rounded-lg bg-gradient-to-r ${selectedConceptMeta.color} bg-opacity-10 border-2 border-purple-200 dark:border-purple-900/50`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${selectedConceptMeta.color} flex items-center justify-center shadow-lg`}>
                        <selectedConceptMeta.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {selectedConceptInfo.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Ready to practice this concept
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Difficulty Slider */}
            <Card className="border-2 border-blue-200 dark:border-blue-900/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                    <Gauge className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Difficulty Level</CardTitle>
                    <CardDescription>Adjust the challenge to match your skill</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Current Level:</Label>
                    <span className={`text-2xl font-black ${difficultyLabel.color}`}>
                      {difficultyLabel.label}
                    </span>
                  </div>

                  <Slider
                    value={[difficulty]}
                    onValueChange={(values) => setDifficulty(values[0])}
                    min={0.3}
                    max={1.0}
                    step={0.05}
                    className="w-full"
                  />

                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Easy (0.3)</span>
                    <span>Medium (0.5)</span>
                    <span>Hard (0.7)</span>
                    <span>Expert (1.0)</span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    Current value: <span className="font-bold">{difficulty.toFixed(2)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Question Count */}
            <Card className="border-2 border-green-200 dark:border-green-900/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-lg">
                    <Hash className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Number of Questions</CardTitle>
                    <CardDescription>How many questions do you want to practice?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Select value={questionCount.toString()} onValueChange={(val) => setQuestionCount(parseInt(val))}>
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_COUNTS.map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count} questions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    Estimated time: <span className="font-bold text-green-600 dark:text-green-400">
                      ~{Math.ceil(questionCount * 1.5)} minutes
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mode Selection */}
            <Card className="border-2 border-yellow-200 dark:border-yellow-900/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center shadow-lg">
                    <Zap className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle>Practice Mode</CardTitle>
                    <CardDescription>Choose how you want to learn</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {MODES.map((modeOption) => {
                    const Icon = modeOption.icon
                    const isSelected = mode === modeOption.id
                    
                    return (
                      <button
                        key={modeOption.id}
                        onClick={() => setMode(modeOption.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-lg shadow-purple-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${modeOption.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-900 dark:text-white'}`}>
                              {modeOption.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {modeOption.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Start Button */}
            <Button
              onClick={handleStartPractice}
              disabled={!selectedConcept || isStarting}
              className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <PlayCircle className="h-6 w-6 mr-3" />
              {isStarting ? "Starting..." : "Start Practice Session"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading practice session...</p>
          </div>
        </div>
      }>
        <PracticeContent />
      </Suspense>
    </ProtectedRoute>
  )
}
