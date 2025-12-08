"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Code2, Play, BookOpen, TrendingUp, Plus } from "lucide-react"

const languages = [
  { name: "Python", icon: "🐍", color: "from-blue-500 to-blue-600" },
  { name: "JavaScript", icon: "📜", color: "from-yellow-500 to-yellow-600" },
  { name: "C++", icon: "⚡", color: "from-purple-500 to-purple-600" },
  { name: "Java", icon: "☕", color: "from-red-500 to-red-600" },
  { name: "TypeScript", icon: "💙", color: "from-blue-400 to-blue-500" },
  { name: "Go", icon: "🔵", color: "from-cyan-500 to-cyan-600" },
]

const difficulties = ["Easy", "Medium", "Hard"]

// Mock data for existing learning cards
const mockLearningCards = [
  {
    id: 1,
    language: "Python",
    difficulty: "Medium",
    progress: 65,
    topicsCompleted: 12,
    totalTopics: 18,
    accuracy: 87,
  },
  {
    id: 2,
    language: "JavaScript",
    difficulty: "Easy",
    progress: 40,
    topicsCompleted: 8,
    totalTopics: 20,
    accuracy: 92,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const learningCards = mockLearningCards

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8 relative">
            <div className="absolute -top-4 left-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -top-4 right-0 w-32 h-32 bg-green-500/20 rounded-full filter blur-3xl"></div>
            <div className="relative">
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                Welcome to {siteName}! 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Create your personalized learning path and start mastering programming
              </p>
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

          {/* Existing Learning Cards */}
          {learningCards.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-6 text-slate-900 dark:text-white">My Learning Paths</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {learningCards.map((card) => (
                  <Card
                    key={card.id}
                    className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 group bg-white dark:bg-slate-800"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-[50px]"></div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <CardTitle className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{card.language}</CardTitle>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                            card.difficulty === "Easy"
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                              : card.difficulty === "Medium"
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                          }`}
                        >
                          {card.difficulty}
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
                ))}
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
