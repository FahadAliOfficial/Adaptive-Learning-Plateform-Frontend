"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react"

// Mock MCQ data
const mockQuestions = [
  {
    id: 1,
    question: "What is the output of the following Python code: print(2 ** 3)?",
    options: ["5", "6", "8", "9"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which data type is used to store text in Python?",
    options: ["int", "str", "float", "bool"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What keyword is used to define a function in Python?",
    options: ["function", "def", "func", "define"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Which of the following is a mutable data type in Python?",
    options: ["tuple", "string", "list", "integer"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What does the 'len()' function return?",
    options: [
      "The type of an object",
      "The length of an object",
      "The value of an object",
      "The memory address",
    ],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: "Which operator is used for floor division in Python?",
    options: ["/", "//", "%", "**"],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "What is the correct way to create a dictionary in Python?",
    options: [
      "dict = []",
      "dict = ()",
      "dict = {}",
      "dict = <>",
    ],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: "Which method is used to add an element to the end of a list?",
    options: ["add()", "append()", "insert()", "extend()"],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "What is the output of: bool(0)?",
    options: ["True", "False", "0", "None"],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: "Which keyword is used to create a class in Python?",
    options: ["class", "Class", "def", "object"],
    correctAnswer: 0,
  },
]

export default function TestPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex })
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate results and redirect to results page
    router.push(`/results/${params.id}?test=completed`)
  }

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100
  const answeredCount = Object.keys(answers).length

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

              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">Python Assessment</h1>
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
                  <span>Question {currentQuestion + 1} of {mockQuestions.length}</span>
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
                  {mockQuestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`h-10 w-10 rounded-lg border-2 font-semibold transition-all ${
                        currentQuestion === index
                          ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-cyan-600 text-white shadow-lg shadow-indigo-500/50"
                          : answers[index] !== undefined
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
                  {mockQuestions[currentQuestion].question}
                </div>

                {/* Options */}
                <RadioGroup
                  value={answers[currentQuestion]?.toString()}
                  onValueChange={(value) =>
                    handleAnswerSelect(currentQuestion, parseInt(value))
                  }
                >
                  <div className="space-y-3">
                    {mockQuestions[currentQuestion].options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer ${
                          answers[currentQuestion] === index
                            ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950 dark:to-cyan-950 shadow-md"
                            : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                        onClick={() => handleAnswerSelect(currentQuestion, index)}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-base"
                        >
                          {option}
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

                  {currentQuestion === mockQuestions.length - 1 ? (
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
                    answeredCount < mockQuestions.length 
                      ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border-red-200 dark:border-red-800"
                      : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700"
                  }`}>
                    <div className={`text-sm font-medium ${
                      answeredCount < mockQuestions.length 
                        ? "text-red-700 dark:text-red-400" 
                        : "text-slate-700 dark:text-slate-400"
                    }`}>
                      Unanswered
                    </div>
                    <div className={`text-3xl font-bold mt-1 ${
                      answeredCount < mockQuestions.length 
                        ? "text-red-600 dark:text-red-300" 
                        : "text-slate-600 dark:text-slate-300"
                    }`}>
                      {mockQuestions.length - answeredCount}
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                {answeredCount < mockQuestions.length && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 dark:text-red-400 text-xs font-bold">!</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                        {mockQuestions.length - answeredCount} question{mockQuestions.length - answeredCount > 1 ? 's' : ''} remain unanswered
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
                    onClick={handleSubmit} 
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
