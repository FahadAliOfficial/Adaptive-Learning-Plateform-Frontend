"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  PlayCircle,
} from "lucide-react"

// Mock data
const mockLearningData = {
  language: "Python",
  difficulty: "Medium",
  totalTopics: 18,
  completedTopics: 12,
  accuracy: 87,
  lastActivity: "2 hours ago",
  hasTakenDemo: true,
  topics: [
    {
      id: 1,
      name: "Variables & Data Types",
      subtopics: ["Integers", "Strings", "Lists", "Dictionaries"],
      completed: true,
      accuracy: 92,
    },
    {
      id: 2,
      name: "Control Flow",
      subtopics: ["If-Else", "Loops", "Break & Continue"],
      completed: true,
      accuracy: 88,
    },
    {
      id: 3,
      name: "Functions",
      subtopics: ["Definition", "Parameters", "Return Values", "Lambda"],
      completed: true,
      accuracy: 85,
    },
    {
      id: 4,
      name: "Object-Oriented Programming",
      subtopics: ["Classes", "Objects", "Inheritance", "Polymorphism"],
      completed: false,
      accuracy: 0,
    },
    {
      id: 5,
      name: "File Handling",
      subtopics: ["Read", "Write", "Append", "Context Managers"],
      completed: false,
      accuracy: 0,
    },
  ],
}

export default function LearningDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [numQuestions, setNumQuestions] = useState(10)
  const [showDemoPrompt, setShowDemoPrompt] = useState(!mockLearningData.hasTakenDemo)

  const data = mockLearningData

  const handleStartTest = (topicId: number) => {
    router.push(`/test/${params.id}?topic=${topicId}&questions=${numQuestions}`)
  }

  const handleDemoTest = () => {
    router.push(`/test/${params.id}?demo=true`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">{data.language}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  data.difficulty === "Easy"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                    : data.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                {data.difficulty}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Track your progress and practice with MCQs
            </p>
          </div>

          {/* Demo Test Prompt */}
          {showDemoPrompt && (
            <Card className="mb-8 border-none bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  Take Demo Test First
                </CardTitle>
                <CardDescription className="text-white/90">
                  Start with a demo test to assess your current knowledge level and get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDemoTest} className="gap-2 bg-white text-orange-600 hover:bg-white/90">
                  <PlayCircle className="h-4 w-4" />
                  Take Demo Test
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="border-none bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Total Topics</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.totalTopics}</div>
                <p className="text-sm text-white/80 mt-1">
                  Across all subtopics
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Completed</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data.completedTopics}
                </div>
                <Progress
                  value={(data.completedTopics / data.totalTopics) * 100}
                  className="mt-2 bg-white/20"
                />
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Accuracy</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data.accuracy}%
                </div>
                <p className="text-sm text-white/80 mt-1">
                  Average across topics
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Last Activity</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.lastActivity}</div>
                <p className="text-sm text-white/80 mt-1">
                  Keep the streak going!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Topics Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Core Topics</h2>

            <div className="grid gap-6">
              {data.topics.map((topic) => (
                <Card
                  key={topic.id}
                  className={`transition-all bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${
                    selectedTopic === topic.id
                      ? "border-2 border-blue-500 shadow-xl shadow-blue-500/20"
                      : "hover:shadow-lg"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{topic.name}</CardTitle>
                          {topic.completed && (
                            <CheckCircle2 className="h-5 w-5 text-[rgb(var(--secondary))]" />
                          )}
                        </div>
                        <CardDescription>
                          {topic.subtopics.length} subtopics
                        </CardDescription>
                      </div>
                      {topic.completed && (
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Accuracy</div>
                          <div className="text-lg font-bold text-[rgb(var(--secondary))]">
                            {topic.accuracy}%
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subtopics */}
                    <div>
                      <div className="text-sm font-medium mb-2">Subtopics:</div>
                      <div className="flex flex-wrap gap-2">
                        {topic.subtopics.map((subtopic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-muted rounded-full text-xs"
                          >
                            {subtopic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Test Configuration */}
                    {selectedTopic === topic.id && (
                      <div className="border-t pt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`questions-${topic.id}`}>
                            Number of MCQs
                          </Label>
                          <Input
                            id={`questions-${topic.id}`}
                            type="number"
                            min="5"
                            max="50"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                            className="max-w-xs"
                          />
                        </div>
                        <Button
                          onClick={() => handleStartTest(topic.id)}
                          variant="outline"
                          className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 dark:border-white dark:text-white rounded-lg font-semibold transition-all duration-300"
                        >
                          Start Test
                        </Button>
                      </div>
                    )}

                    {selectedTopic !== topic.id && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTopic(topic.id)}
                        className="w-full"
                      >
                        Practice This Topic
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
