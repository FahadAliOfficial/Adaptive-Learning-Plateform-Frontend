"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, BookOpen, TrendingUp, X, Loader2, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getLanguagePortfolio, addLanguage, type LanguageStats } from "@/lib/api/languages"

const languages = [
  { id: "python_3", name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "from-blue-500 to-blue-600" },
  { id: "javascript_es6", name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "from-yellow-500 to-yellow-600" },
  { id: "cpp_20", name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", color: "from-purple-500 to-purple-600" },
  { id: "java_17", name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", color: "from-red-500 to-red-600" },
  { id: "go_1_21", name: "Go", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg", color: "from-cyan-500 to-cyan-600" },
]

function LearningsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [portfolio, setPortfolio] = useState<LanguageStats[]>([])
  const [primaryLanguage, setPrimaryLanguage] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    setIsLoading(true)
    try {
      const data = await getLanguagePortfolio()
      setPortfolio(data.languages)
      setPrimaryLanguage(data.primary_language)
    } catch (error) {
      console.error("Failed to fetch language portfolio:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLearningPath = async () => {
    if (!selectedLanguage) return

    setIsAdding(true)
    try {
      await addLanguage(selectedLanguage, selectedDifficulty)
      await fetchPortfolio() // Refresh portfolio
      setShowCreateModal(false)
      setSelectedLanguage("")
      setSelectedDifficulty("beginner")
    } catch (error: any) {
      console.error("Failed to add language:", error)
      alert(error?.data?.detail || "Failed to add language. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

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

  const getLanguageLogo = (languageId: string): string => {
    const lang = languages.find(l => l.id === languageId)
    return lang?.logo || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your learning paths...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">My Learnings</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Track and continue your active learning paths
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="relative overflow-hidden border-2 border-green-100 dark:border-green-900/50 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Paths</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-green-600 dark:text-green-400">{portfolio.length}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {portfolio.length === 1 ? 'Language' : 'Languages'} learning
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Progress</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {portfolio.reduce((acc, lang) => acc + lang.topics_completed, 0)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Topics completed</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Accuracy</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {portfolio.length > 0
                    ? Math.round(portfolio.reduce((acc, lang) => acc + lang.avg_accuracy, 0) / portfolio.length)
                    : 0}%
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Across all paths
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Learning Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {portfolio.map((lang) => {
              const progress = Math.round(lang.avg_mastery * 100)
              
              return (
                <Card
                  key={lang.language_id}
                  className="hover:shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800 relative overflow-hidden flex flex-col"
                >
                  {/* Primary badge */}
                  {lang.is_primary && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-none shadow-lg">
                        Primary
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <img 
                        src={getLanguageLogo(lang.language_id)} 
                        alt={`${lang.language_name} logo`} 
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-xl">{lang.language_name}</CardTitle>
                        {lang.transfer_boost && (
                          <Badge variant="outline" className="mt-1 text-xs border-green-500 text-green-700 dark:text-green-400">
                            +{Math.round(lang.transfer_boost.acceleration_factor * 100)}% boost
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      Last activity: {formatLastActivity(lang.last_practiced)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-4 flex-1">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Mastery</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Topics</div>
                        <div className="font-semibold">
                          {lang.topics_completed}/{lang.total_topics}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Accuracy</div>
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          {Math.round(lang.avg_accuracy)}%
                        </div>
                      </div>
                    </div>

                    {lang.transfer_boost && (
                      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-3 text-xs">
                        <div className="flex items-center gap-2 text-green-800 dark:text-green-200 font-medium mb-1">
                          <ArrowRight className="h-3 w-3" />
                          Transfer Boost Active
                        </div>
                        <p className="text-green-700 dark:text-green-300">
                          Learning from {lang.transfer_boost.from_language_name} ({Math.round(lang.transfer_boost.source_mastery * 100)}% mastery)
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-slate-700"
                        onClick={() => router.push(`/learnings/${lang.language_id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                        onClick={() => {
                          // Set this language as active and go to practice
                          localStorage.setItem('selectedLanguage', lang.language_id)
                          router.push('/practice')
                        }}
                      >
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

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
                    Add New Language
                  </CardTitle>
                  <p className="text-sm text-white/80 mt-2">Select a programming language to add to your learning portfolio</p>
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
                  {languages
                    .filter(lang => !portfolio.some(p => p.language_id === lang.id))
                    .map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group ${
                        selectedLanguage === lang.id
                          ? "border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-500/10 to-green-500/10 shadow-lg shadow-blue-500/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-blue-500/50 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {selectedLanguage === lang.id && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="mb-3 group-hover:scale-110 transition-transform flex items-center justify-center">
                        <img 
                          src={lang.logo} 
                          alt={`${lang.name} logo`} 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{lang.name}</div>
                    </button>
                  ))}
                </div>
                
                {portfolio.length >= 5 && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Maximum 5 languages reached. Remove a language to add a new one.
                    </p>
                  </div>
                )}
              </div>

              {/* Difficulty Selection */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-full"></div>
                  Your Experience Level
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      id: "beginner",
                      label: "Beginner",
                      emoji: "🌱",
                      description: "New to this language",
                      color: "from-green-500/10 to-emerald-500/10",
                      border: "border-green-500 dark:border-green-400",
                      badge: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
                    },
                    {
                      id: "intermediate",
                      label: "Intermediate",
                      emoji: "📈",
                      description: "Know the basics already",
                      color: "from-blue-500/10 to-cyan-500/10",
                      border: "border-blue-500 dark:border-blue-400",
                      badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
                    },
                    {
                      id: "advanced",
                      label: "Advanced",
                      emoji: "🔥",
                      description: "Experienced, want a challenge",
                      color: "from-purple-500/10 to-violet-500/10",
                      border: "border-purple-500 dark:border-purple-400",
                      badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
                    },
                  ].map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left ${
                        selectedDifficulty === level.id
                          ? `${level.border} bg-gradient-to-br ${level.color} shadow-lg`
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {selectedDifficulty === level.id && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="text-3xl mb-2">{level.emoji}</div>
                      <div className="font-bold text-slate-900 dark:text-white mb-1">{level.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{level.description}</div>
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
                  onClick={() => {
                    setShowCreateModal(false)
                    setSelectedLanguage("")
                    setSelectedDifficulty("beginner")
                  }}
                  disabled={isAdding}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 text-white shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedLanguage || isAdding}
                  onClick={handleCreateLearningPath}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Language...
                    </>
                  ) : selectedLanguage ? (
                    `Add ${languages.find(l => l.id === selectedLanguage)?.name || 'Language'}`
                  ) : (
                    "Select Language to Continue"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function LearningsPageWrapper() {
  return (
    <ProtectedRoute>
      <LearningsPage />
    </ProtectedRoute>
  )
}
