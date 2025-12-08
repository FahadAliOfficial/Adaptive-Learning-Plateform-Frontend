"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, BookOpen, TrendingUp, X } from "lucide-react"

const languages = [
  { name: "Python", icon: "🐍", color: "from-blue-500 to-blue-600" },
  { name: "JavaScript", icon: "📜", color: "from-yellow-500 to-yellow-600" },
  { name: "C++", icon: "⚡", color: "from-purple-500 to-purple-600" },
  { name: "Java", icon: "☕", color: "from-red-500 to-red-600" },
  { name: "TypeScript", icon: "💙", color: "from-blue-400 to-blue-500" },
  { name: "Go", icon: "🔵", color: "from-cyan-500 to-cyan-600" },
]

const difficulties = ["Easy", "Medium", "Hard"]

// Mock data for learning cards
const mockLearningCards = [
  {
    id: 1,
    language: "Python",
    difficulty: "Medium",
    progress: 65,
    topicsCompleted: 12,
    totalTopics: 18,
    accuracy: 87,
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    language: "JavaScript",
    difficulty: "Easy",
    progress: 40,
    topicsCompleted: 8,
    totalTopics: 20,
    accuracy: 92,
    lastActivity: "1 day ago",
  },
  {
    id: 3,
    language: "C++",
    difficulty: "Hard",
    progress: 25,
    topicsCompleted: 5,
    totalTopics: 20,
    accuracy: 78,
    lastActivity: "3 days ago",
  },
]

export default function LearningsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  const handleCreateLearningPath = () => {
    if (selectedLanguage && selectedDifficulty) {
      // TODO: Create learning path logic
      console.log("Creating path:", selectedLanguage, selectedDifficulty)
      setShowCreateModal(false)
      setSelectedLanguage("")
      setSelectedDifficulty("")
      // Redirect to new learning path
      router.push("/learnings/" + (mockLearningCards.length + 1))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">My Learnings</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Track and continue your active learning paths
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="border-none bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Active Paths</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockLearningCards.length}</div>
                <p className="text-sm text-white/80 mt-1">
                  Across {new Set(mockLearningCards.map((c) => c.language)).size} languages
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Total Progress</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {mockLearningCards.reduce((acc, card) => acc + card.topicsCompleted, 0)}
                </div>
                <p className="text-sm text-white/80 mt-1">Topics completed</p>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Avg Accuracy</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round(
                    mockLearningCards.reduce((acc, card) => acc + card.accuracy, 0) /
                      mockLearningCards.length
                  )}
                  %
                </div>
                <p className="text-sm text-white/80 mt-1">
                  Across all paths
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Learning Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {mockLearningCards.map((card) => (
              <Card
                key={card.id}
                className="hover:shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{card.language}</CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        card.difficulty === "Easy"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                          : card.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {card.difficulty}
                    </span>
                  </div>
                  <CardDescription>
                    Last activity: {card.lastActivity}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{card.progress}%</span>
                    </div>
                    <Progress value={card.progress} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Topics</div>
                      <div className="font-semibold">
                        {card.topicsCompleted}/{card.totalTopics}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Accuracy</div>
                      <div className="font-semibold text-[rgb(var(--secondary))]">
                        {card.accuracy}%
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                    onClick={() => router.push(`/learnings/${card.id}`)}
                  >
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Add New Card */}
            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer bg-white dark:bg-slate-800">
              <CardContent
                className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6"
                onClick={() => setShowCreateModal(true)}
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Create New Path</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Start learning a new programming language
                </p>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-slate-700">Add Learning Path</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Create Learning Path Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <Card className="w-full max-w-4xl bg-white dark:bg-slate-800 border-none shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-500 via-green-500 to-blue-600 text-white p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Plus className="h-6 w-6" />
                    </div>
                    Create New Learning Path
                  </CardTitle>
                  <p className="text-sm text-white/80 mt-2">Select a programming language and difficulty level to start your journey</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Language Selection */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-full"></div>
                  Choose Programming Language
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.name}
                      onClick={() => setSelectedLanguage(lang.name)}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group ${
                        selectedLanguage === lang.name
                          ? "border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-500/10 to-green-500/10 shadow-lg shadow-blue-500/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-blue-500/50 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {selectedLanguage === lang.name && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{lang.icon}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"></div>
                  Select Difficulty
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedDifficulty === diff
                          ? diff === "Easy"
                            ? "border-green-500 dark:border-green-400 bg-gradient-to-br from-green-500/10 to-green-600/10 shadow-lg shadow-green-500/20"
                            : diff === "Medium"
                            ? "border-yellow-500 dark:border-yellow-400 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 shadow-lg shadow-yellow-500/20"
                            : "border-red-500 dark:border-red-400 bg-gradient-to-br from-red-500/10 to-red-600/10 shadow-lg shadow-red-500/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-blue-500/50 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {selectedDifficulty === diff && (
                        <div className={`absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center shadow-lg ${
                          diff === "Easy"
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : diff === "Medium"
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                            : "bg-gradient-to-r from-red-500 to-red-600"
                        }`}>
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="text-xl font-black text-slate-900 dark:text-white">{diff}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 text-white shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedLanguage || !selectedDifficulty}
                  onClick={handleCreateLearningPath}
                >
                  {selectedLanguage && selectedDifficulty 
                    ? `Create ${selectedLanguage} Learning Path (${selectedDifficulty})`
                    : "Select Language & Difficulty to Continue"
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
