"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { selectQuestions, submitExam, type SelectedQuestion, type QuestionOption } from "@/lib/api/exam"


type QuestionItem = SelectedQuestion

function TestPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [sessionConfig, setSessionConfig] = useState<any>(null)
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<string, number>>({})
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null)

  // Load session config from localStorage and fetch questions
  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedSession = localStorage.getItem('currentSession')
    if (!storedSession) {
      router.push('/practice')
      return
    }

    const config = JSON.parse(storedSession)
    setSessionConfig(config)

    const fetchQuestions = async () => {
      if (!user?.id) return

      setIsLoading(true)
      setLoadError(null)
      try {
        const response = await selectQuestions({
          user_id: user.id,
          language_id: config.language_id,
          mapping_id: config.mapping_id,
          target_difficulty: config.difficulty,
          count: config.question_count,
          difficulty_tolerance: 0.1,
          mode: config.mode,
          seen_ratio: config.mode === 'practice' ? 0.4 : config.mode === 'review' ? 0.5 : 0
        })

        setQuestions(response.questions)
        setSessionStartedAt(Date.now())

        // Adjust timer based on mode
        if (config.mode === 'exam') {
          setTimeLeft(config.question_count * 90) // 1.5 minutes per question
        } else {
          setTimeLeft(config.question_count * 180) // 3 minutes per question for practice/review
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error)
        setQuestions([])
        setLoadError('Unable to load questions right now. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [router, user?.id])

  // Timer + per-question time tracking
  useEffect(() => {
    if (!questions.length) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })

      const currentId = questions[currentQuestion]?.id
      if (currentId) {
        setQuestionTimeSpent((prev) => ({
          ...prev,
          [currentId]: (prev[currentId] || 0) + 1
        }))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [questions.length, currentQuestion])

  const getExpectedTime = (difficulty: number) => {
    return Math.round(60 + (difficulty * 60))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async (forceSubmit = false) => {
    if (!sessionConfig || !user?.id) return

    const answeredCount = questions.filter((question) => answers[question.id]).length

    if (!forceSubmit && answeredCount < questions.length) {
      setShowSubmitConfirm(true)
      return
    }

    try {
      const resultsPayload = questions.map((q) => {
        const selected = answers[q.id] || ""
        const correct = q.question_data.options.find((opt) => opt.is_correct)?.id || ""
        const selectedOption = q.question_data.options.find((opt) => opt.id === selected)

        // Get proper sub_topic: prefer direct field, then from question_data, then mapping_id
        const subTopic = q.sub_topic || 
                        q.question_data.sub_topic || 
                        q.mapping_id || 
                        sessionConfig?.concept_name || 
                        "General Topic"

        return {
          q_id: q.id,
          sub_topic: subTopic,
          difficulty: q.difficulty,
          is_correct: selected === correct,
          selected_choice: selected,
          correct_choice: correct,
          time_spent: questionTimeSpent[q.id] || 1,
          expected_time: getExpectedTime(q.difficulty),
          error_type: selectedOption?.error_type || null,
          question_text: q.question_data.question_text,
          code_snippet: q.question_data.code_snippet || null,
          options: q.question_data.options as QuestionOption[],
          explanation: q.question_data.explanation || null
        }
      })

      const totalTimeSeconds = sessionStartedAt
        ? Math.max(1, Math.round((Date.now() - sessionStartedAt) / 1000))
        : Math.max(1, questions.length * 60)

      await submitExam({
        user_id: user.id,
        session_id: sessionConfig.session_id,
        language_id: sessionConfig.language_id,
        major_topic_id: sessionConfig.major_topic_id,
        session_type: sessionConfig.mode,
        results: resultsPayload,
        total_time_seconds: totalTimeSeconds
      })

      router.push(`/results/${params.id}`)
    } catch (error: any) {
      console.error('Failed to submit exam:', error)
      console.error('Error details:', error?.data?.detail || error?.message || 'Unknown error')
    }
  }

  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0
  const answeredCount = questions.reduce(
    (count, question) => count + (answers[question.id] ? 1 : 0),
    0
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (loadError || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No questions available</div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {loadError || 'We could not find questions for this session.'}
          </p>
          <Button onClick={() => router.push('/practice')}>
            Back to Practice
          </Button>
        </div>
      </div>
    )
  }

  const currentItem = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Top Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="h-10 w-10 p-0 flex items-center justify-center rounded-md"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                {sessionConfig?.concept_name || 'Python Assessment'}
              </h1>
            </div>

            <Card className={`border-none shadow-lg ${
              timeLeft < 300 
                ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/50" 
                : "bg-gradient-to-br from-indigo-500 to-cyan-600 text-white shadow-indigo-500/50"
            }`}>
              <CardContent className="flex items-center gap-2 p-3">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-bold">
                  {formatTime(timeLeft)}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          {/* Left Sidebar - Question Navigator */}
          <div className="space-y-4">
            {/* Progress Card */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-base text-slate-900 dark:text-white">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{answeredCount} answered</span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Question Navigator */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg sticky top-[200px]">
              <CardHeader>
                <CardTitle className="text-base text-slate-900 dark:text-white">Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-5 gap-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                  {questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`h-10 w-10 rounded-lg border-2 font-semibold transition-all ${
                        currentQuestion === index
                          ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-cyan-600 text-white shadow-lg shadow-indigo-500/50"
                          : answers[question.id] !== undefined
                          ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                          : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded border-2 border-indigo-500 bg-gradient-to-br from-indigo-500 to-cyan-600" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded border-2 border-green-500 bg-green-50 dark:bg-green-950" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
                    <span>Not Answered</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={() => setShowSubmitConfirm(true)} 
                  className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
                >
                  <Flag className="h-4 w-4" />
                  Submit Test
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Question Card */}
          <div>
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-cyan-600 text-white">
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Question */}
                <div className="text-lg font-medium text-slate-900 dark:text-white">
                  {currentItem?.question_data.question_text}
                </div>

                {currentItem?.question_data.code_snippet && (
                  <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto">
                    {currentItem.question_data.code_snippet}
                  </pre>
                )}

                {/* Options */}
                <RadioGroup
                  value={currentItem ? answers[currentItem.id] ?? "" : ""}
                  onValueChange={(value) =>
                    currentItem && handleAnswerSelect(currentItem.id, value)
                  }
                >
                  <div className="space-y-3">
                    {currentItem?.question_data.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer ${
                          currentItem && answers[currentItem.id] === option.id
                            ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950 dark:to-cyan-950 shadow-md"
                            : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                        onClick={() => currentItem && handleAnswerSelect(currentItem.id, option.id)}
                      >
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="flex-1 cursor-pointer text-base"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentQuestion === questions.length - 1 ? (
                    <Button onClick={() => setShowSubmitConfirm(true)} className="gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700">
                      <Flag className="h-4 w-4" />
                      Submit Test
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 text-white">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <Card className="w-full max-w-lg bg-white dark:bg-slate-800 border-none shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-600 text-white p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Flag className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Submit Test?</CardTitle>
                    <p className="text-sm text-white/80 mt-1">Review your answers before submitting</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm font-medium text-green-700 dark:text-green-400">Answered</div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-300 mt-1">{answeredCount}</div>
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    answeredCount < questions.length 
                      ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border-red-200 dark:border-red-800"
                      : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700"
                  }`}>
                    <div className={`text-sm font-medium ${
                      answeredCount < questions.length 
                        ? "text-red-700 dark:text-red-400" 
                        : "text-slate-700 dark:text-slate-400"
                    }`}>
                      Unanswered
                    </div>
                    <div className={`text-3xl font-bold mt-1 ${
                      answeredCount < questions.length 
                        ? "text-red-600 dark:text-red-300" 
                        : "text-slate-600 dark:text-slate-300"
                    }`}>
                      {questions.length - answeredCount}
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                {answeredCount < questions.length && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 dark:text-red-400 text-xs font-bold">!</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                        {questions.length - answeredCount} question{questions.length - answeredCount > 1 ? 's' : ''} remain unanswered
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        Unanswered questions will be marked as incorrect
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="flex-1 h-12 text-base border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Review Answers
                  </Button>
                  <Button 
                    onClick={() => handleSubmit(true)} 
                    className="flex-1 h-12 text-base bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-600 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-700 shadow-lg"
                  >
                    Submit Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TestPageWrapper() {
  return (
    <ProtectedRoute>
      <TestPage />
    </ProtectedRoute>
  )
}
