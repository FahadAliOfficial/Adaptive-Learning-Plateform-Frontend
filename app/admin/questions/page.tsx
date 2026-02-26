"use client"

import { useState, useEffect, useRef } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { 
  Search, Edit, Trash2, CheckCircle, XCircle, Filter, Code, 
  AlertTriangle, TrendingDown, Plus, RefreshCw, BarChart3, Bell
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getAllQuestions,
  getPendingQuestions,
  getLowQualityQuestions,
  updateQuestion,
  deleteQuestion,
  bulkActionQuestions,
  approveQuestion,
  rejectQuestion,
  generateQuestions,
  getQuestionAnalytics,
  type AdminQuestion,
  type AdminQuestionListResponse,
  type QuestionFilters,
  type QuestionGenerateRequest
} from "@/lib/api/questions-admin"
import {
  getCurriculum,
  getTopicsForLanguage,
  type LanguageCurriculum,
  type CurriculumTopic
} from "@/lib/api/curriculum"

// Language display names
const LANGUAGE_NAMES: Record<string, string> = {
  python_3: "Python",
  javascript_es6: "JavaScript",
  java_17: "Java",
  cpp_20: "C++",
  go_1_21: "Go"
}

export default function QuestionBankPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(false)
  
  // Curriculum data
  const [curriculum, setCurriculum] = useState<LanguageCurriculum[]>([])
  const [availableTopics, setAvailableTopics] = useState<CurriculumTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null)
  
  // All Questions state
  const [allQuestions, setAllQuestions] = useState<AdminQuestion[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [verifiedCount, setVerifiedCount] = useState(0)
  const [unverifiedCount, setUnverifiedCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Pending Questions state
  const [pendingQuestions, setPendingQuestions] = useState<any[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  
  // Low Quality Questions state
  const [lowQualityQuestions, setLowQualityQuestions] = useState<AdminQuestion[]>([])
  const [lowQualityCount, setLowQualityCount] = useState(0)
  
  // Filters
  const [filters, setFilters] = useState<QuestionFilters>({
    page: 1,
    limit: 20
  })
  
  // Selected questions for bulk actions
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set())
  
  // Generation form
  const [genForm, setGenForm] = useState<QuestionGenerateRequest>({
    topic: "",
    language_id: "python_3",
    mapping_id: "UNIV_LOOP",
    difficulty: 0.5,
    count: 10,
    sub_topic: ""
  })
  const [generating, setGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<{
    active: boolean
    total: number
    generated: number
    failed: number
    taskId: string
    initialTotalCount: number
  } | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [dismissedPopup, setDismissedPopup] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Load curriculum on mount
  useEffect(() => {
    loadCurriculum()
  }, [])

  // Load all tab data on initial mount to populate counts
  useEffect(() => {
    fetchAllQuestions()
    fetchPendingQuestions()
    fetchLowQualityQuestions()
  }, []) // Run once on mount

  // Update available topics when language changes
  useEffect(() => {
    if (curriculum.length > 0) {
      const topics = getTopicsForLanguage(curriculum, genForm.language_id)
      setAvailableTopics(topics)
      
      // Reset topic selection when language changes
      setSelectedTopic(null)
      setGenForm(prev => ({ ...prev, mapping_id: "", topic: "", sub_topic: "" }))
    }
  }, [genForm.language_id, curriculum])

  const loadCurriculum = async () => {
    const data = await getCurriculum()
    setCurriculum(data)
  }

  // Refetch data when filters change or tab switches (but not on initial mount)
  // Skip refetch during active generation to reduce API spam
  useEffect(() => {
    // Skip during active generation (polling handles updates)
    if (generationProgress?.active) {
      console.log('⏸️ Skipping tab/filter refresh during active generation')
      return
    }
    
    // Fetch data for active tab only
    if (activeTab === "all") {
      fetchAllQuestions()
    } else if (activeTab === "pending") {
      fetchPendingQuestions()
    } else if (activeTab === "low-quality") {
      fetchLowQualityQuestions()
    }
  }, [activeTab, filters, generationProgress?.active])

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  // Auto-refresh when generation is active
  useEffect(() => {
    if (!generationProgress?.active) return

    let pollCount = 0
    const MAX_POLLS = 40 // Max 2 minutes at 3s intervals

    console.log('🔄 Starting generation polling (optimized batch mode)')

    const interval = setInterval(async () => {
      pollCount++

      // Safety cutoff - stop polling after max attempts
      if (pollCount > MAX_POLLS) {
        console.warn('⏱️ Generation polling timeout - stopping auto-refresh')
        setGenerationProgress(null)
        setGenerating(false)
        return
      }

      console.log(`📊 Poll ${pollCount}/${MAX_POLLS} - Checking generation progress...`)

      // OPTIMIZED: Only fetch what we need during generation
      // Don't fetch low-quality questions during polling (not needed for progress tracking)
      const [allQuestionsResponse, pendingResponse] = await Promise.all([
        getAllQuestions(filters),
        getPendingQuestions(filters.language_id, filters.mapping_id, 50)
      ])

      // Update counts from responses
      const currentTotalCount = allQuestionsResponse.total_count
      setTotalCount(currentTotalCount)
      setPendingCount(pendingResponse.total_pending)

      // Calculate generated count using total questions (includes auto-approved + pending)
      const newGenerated = currentTotalCount - generationProgress.initialTotalCount
      
      console.log(`✅ Generated: ${newGenerated}/${generationProgress.total} questions`)
      
      setGenerationProgress(prev => prev ? { 
        ...prev, 
        generated: Math.max(0, newGenerated) // Ensure non-negative
      } : null)

      // Check if generation is complete
      const elapsed = Date.now() - (generationProgress as any).startTime
      const estimatedTime = generationProgress.total * 300 // 0.3s per question (batch mode)
      
      if (elapsed > estimatedTime + 5000) { // Wait 5s after estimated time
        console.log('✨ Generation complete - stopping polling')
        
        // Final fetch to get accurate counts
        await fetchLowQualityQuestions(true)
        
        // Use the fresh total count for final calculation (includes auto-approved)
        const actualGenerated = Math.max(0, currentTotalCount - generationProgress.initialTotalCount)
        const failed = generationProgress.total - actualGenerated
        const autoApproved = allQuestionsResponse.verified_count - (generationProgress as any).initialVerifiedCount || 0
        const needsReview = pendingResponse.total_pending - (generationProgress as any).initialPendingCount || 0
        
        setGenerationProgress(null)
        setGenerating(false)
        setDismissedPopup(false)
        
        // Show completion report
        const reviewMessage = needsReview > 0 
          ? `${needsReview} question(s) need review in the "Pending Review" tab.`
          : 'All questions were auto-approved (quality >= 70%)!'
        
        alert(
          `✅ Generation Complete!\n\n` +
          `Total Requested: ${generationProgress.total}\n` +
          `Successfully Generated: ${actualGenerated}\n` +
          `Auto-Approved: ${autoApproved}\n` +
          `Failed/Duplicates: ${failed}\n\n` +
          reviewMessage
        )
      }
    }, 3000) // Poll every 3 seconds during active generation

    return () => {
      console.log('🛑 Cleaning up generation polling interval')
      clearInterval(interval)
    }
  }, [generationProgress?.active]) // Only depend on active state

  const fetchAllQuestions = async (skipLoading = false) => {
    // Only show loading on initial/manual fetch, not during auto-refresh or user actions
    if (!generationProgress?.active && !skipLoading) {
      setLoading(true)
    }
    try {
      const response = await getAllQuestions(filters)
      setAllQuestions(response.questions)
      setTotalCount(response.total_count)
      setVerifiedCount(response.verified_count)
      setUnverifiedCount(response.unverified_count)
    } catch (error) {
      console.error("Failed to fetch questions:", error)
    } finally {
      if (!generationProgress?.active && !skipLoading) {
        setLoading(false)
      }
    }
  }

  const fetchPendingQuestions = async (skipLoading = false) => {
    // Only show loading on initial/manual fetch, not during auto-refresh or user actions
    if (!generationProgress?.active && !skipLoading) {
      setLoading(true)
    }
    try {
      const response = await getPendingQuestions(filters.language_id, filters.mapping_id, 50)
      setPendingQuestions(response.questions)
      setPendingCount(response.total_pending)
    } catch (error) {
      console.error("Failed to fetch pending questions:", error)
    } finally {
      if (!generationProgress?.active && !skipLoading) {
        setLoading(false)
      }
    }
  }

  const fetchLowQualityQuestions = async (skipLoading = false) => {
    // Only show loading on initial/manual fetch, not during auto-refresh or user actions
    if (!generationProgress?.active && !skipLoading) {
      setLoading(true)
    }
    try {
      const response = await getLowQualityQuestions(50)
      setLowQualityQuestions(response.questions)
      setLowQualityCount(response.total_count)
    } catch (error) {
      console.error("Failed to fetch low quality questions:", error)
    } finally {
      if (!generationProgress?.active && !skipLoading) {
        setLoading(false)
      }
    }
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return
    }
    
    try {
      await deleteQuestion(questionId)
      // Refresh only current tab and total counts
      if (activeTab === "all") {
        fetchAllQuestions(true)
      } else if (activeTab === "pending") {
        fetchPendingQuestions(true)
        fetchAllQuestions(true) // Update total count
      } else if (activeTab === "low-quality") {
        fetchLowQualityQuestions(true)
        fetchAllQuestions(true) // Update total count
      }
    } catch (error) {
      console.error("Failed to delete question:", error)
      alert("Failed to delete question")
    }
  }

  const handleApprove = async (questionId: string) => {
    try {
      await approveQuestion(questionId)
      // Only refresh pending tab and total counts
      fetchPendingQuestions(true) // Skip loading to prevent scroll reset
      fetchAllQuestions(true) // Update verified/unverified counts
    } catch (error) {
      console.error("Failed to approve question:", error)
      alert("Failed to approve question")
    }
  }

  const handleReject = async (questionId: string) => {
    if (!confirm("Are you sure you want to reject and delete this question?")) {
      return
    }
    
    try {
      await rejectQuestion(questionId)
      // Only refresh pending tab and total counts
      fetchPendingQuestions(true) // Skip loading to prevent scroll reset
      fetchAllQuestions(true) // Update total count
    } catch (error) {
      console.error("Failed to reject question:", error)
      alert("Failed to reject question")
    }
  }

  const handleUpdate = async (questionId: string, updates: any) => {
    try {
      await updateQuestion(questionId, updates)
      setEditingQuestion(null)
      fetchAllQuestions()
      fetchPendingQuestions()
      alert("Question updated successfully!")
    } catch (error) {
      console.error("Failed to update question:", error)
      alert("Failed to update question")
    }
  }

  const handleBulkApprove = async () => {
    if (selectedQuestions.size === 0) return
    
    try {
      await bulkActionQuestions({
        question_ids: Array.from(selectedQuestions),
        action: "approve"
      })
      setSelectedQuestions(new Set())
      // Only refresh pending tab and counts
      fetchPendingQuestions(true)
      fetchAllQuestions(true)
    } catch (error) {
      console.error("Failed to bulk approve:", error)
      alert("Failed to bulk approve questions")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedQuestions.size === 0) return
    if (!confirm(`Delete ${selectedQuestions.size} questions permanently?`)) return
    
    try {
      await bulkActionQuestions({
        question_ids: Array.from(selectedQuestions),
        action: "delete"
      })
      setSelectedQuestions(new Set())
      // Refresh current tab and counts
      if (activeTab === "all") {
        fetchAllQuestions(true)
      } else if (activeTab === "pending") {
        fetchPendingQuestions(true)
        fetchAllQuestions(true)
      } else if (activeTab === "low-quality") {
        fetchLowQualityQuestions(true)
        fetchAllQuestions(true)
      }
    } catch (error) {
      console.error("Failed to bulk delete:", error)
      alert("Failed to bulk delete questions")
    }
  }

  const handleGenerate = async () => {
    if (!genForm.topic || !genForm.mapping_id) {
      alert("Please select a topic")
      return
    }
    
    setGenerating(true)
    try {
      const response = await generateQuestions(genForm)
      
      console.log(`🚀 Generation started: ${genForm.count} questions (Task: ${response.task_id.slice(0, 8)})`)
      console.log(`⏱️ Estimated time: ${response.estimated_time_seconds}s (batch mode)`)
      
      // Set generation progress tracker (track total count for auto-approved + pending)
      setGenerationProgress({
        active: true,
        total: genForm.count,
        generated: 0,
        failed: 0,
        taskId: response.task_id,
        initialTotalCount: totalCount,
        initialPendingCount: pendingCount,
        initialVerifiedCount: verifiedCount,
        startTime: Date.now()
      } as any)
      setDismissedPopup(false)
      
      // Switch to pending tab to see questions appear
      setActiveTab("pending")
      
      // Reset form
      const currentLang = genForm.language_id
      setGenForm({
        topic: "",
        language_id: currentLang, // Keep language
        mapping_id: "",
        difficulty: 0.5,
        count: 10,
        sub_topic: ""
      })
      setSelectedTopic(null)
    } catch (error) {
      console.error("Failed to generate questions:", error)
      alert("Failed to generate questions")
      setGenerating(false)
    }
  }

  const handleTopicChange = (topicName: string) => {
    const topic = availableTopics.find(t => t.name === topicName)
    if (topic) {
      setSelectedTopic(topic)
      setGenForm({
        ...genForm,
        topic: topic.name,
        mapping_id: topic.mapping_id,
        sub_topic: "" // Reset subtopic when topic changes
      })
    }
  }

  const toggleSelectQuestion = (questionId: string) => {
    const newSet = new Set(selectedQuestions)
    if (newSet.has(questionId)) {
      newSet.delete(questionId)
    } else {
      newSet.add(questionId)
    }
    setSelectedQuestions(newSet)
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.4) return { label: "Easy", color: "text-green-600 dark:text-green-400" }
    if (difficulty < 0.7) return { label: "Medium", color: "text-yellow-600 dark:text-yellow-400" }
    return { label: "Hard", color: "text-red-600 dark:text-red-400" }
  }

  const renderQuestionCard = (q: AdminQuestion, showActions = true, isPending = false) => {
    const difficultyInfo = getDifficultyLabel(q.difficulty)
    const accuracyRate = q.times_used > 0 ? ((q.times_correct / q.times_used) * 100).toFixed(1) : "N/A"

    return (
      <div
        key={q.id}
        className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all bg-slate-50 dark:bg-slate-800/50"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            {showActions && !isPending && (
              <input
                type="checkbox"
                checked={selectedQuestions.has(q.id)}
                onChange={() => toggleSelectQuestion(q.id)}
                className="h-4 w-4 rounded border-slate-300"
              />
            )}
            <span className="px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold">
              {q.id.slice(0, 8)}
            </span>
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
              {LANGUAGE_NAMES[q.language_id] || q.language_id}
            </Badge>
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
              {q.mapping_id}
            </Badge>
            <Badge className={difficultyInfo.color}>
              {difficultyInfo.label}
            </Badge>
            {q.is_verified ? (
              <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400">
                <XCircle className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
            <Badge variant="outline">
              Quality: {(q.quality_score * 100).toFixed(0)}%
            </Badge>
            {q.times_used > 0 && (
              <Badge variant="outline">
                Used: {q.times_used} | Accuracy: {accuracyRate}%
              </Badge>
            )}
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
            {new Date(q.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Question Content */}
        <div className="mb-3">
          <pre className="text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-sans">
            {q.question_data.question_text}
          </pre>
          {q.question_data.code_snippet && (
            <pre className="mt-2 text-sm font-mono bg-slate-800 dark:bg-black text-green-400 dark:text-green-300 p-3 rounded-lg overflow-x-auto">
              <code>{q.question_data.code_snippet}</code>
            </pre>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          {q.question_data.options.map((option, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm ${
                option.is_correct
                  ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-400 font-semibold border-2 border-green-500"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              }`}
            >
              <span className="font-bold mr-2">{option.id}.</span>
              {option.text}
            </div>
          ))}
        </div>

        {/* Explanation */}
        {q.question_data.explanation && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">💡 Explanation</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {q.question_data.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {q.sub_topic && (
                <>Sub-topic: <span className="font-semibold">{q.sub_topic}</span></>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isPending ? (
                <>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    onClick={() => handleApprove(q.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingQuestion(q)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(q.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingQuestion(q)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(q.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <ProtectedRoute>
      {/* Generation Progress Indicator */}
      {generationProgress?.active && !dismissedPopup && (
        <div className="fixed top-20 right-6 z-50 bg-white dark:bg-slate-800 border-2 border-orange-500 rounded-lg shadow-2xl p-4 min-w-[280px] animate-in slide-in-from-right">
          <div className="flex items-start gap-3">
            <div className="relative">
              <RefreshCw className="h-8 w-8 text-orange-500 animate-spin" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                Generating Questions
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Requested:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{generationProgress.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Generated:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{generationProgress.generated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Remaining:</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {Math.max(0, generationProgress.total - generationProgress.generated)}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${(pendingCount / generationProgress.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Task ID: {generationProgress.taskId.slice(0, 8)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-xs"
            onClick={() => {
              setDismissedPopup(true)
            }}
          >
            Minimize
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Question Bank Management
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Manage, review, and generate questions for the platform
            </p>
          </div>
          
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className={`h-6 w-6 ${generationProgress?.active ? 'text-orange-500 animate-bounce' : 'text-slate-600 dark:text-slate-400'}`} />
              {generationProgress?.active && (
                <span className="absolute top-2 right-2 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl z-50">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                </div>
                
                {generationProgress?.active ? (
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="h-5 w-5 text-orange-500 animate-spin mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Generating Questions
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Requested:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{generationProgress.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Generated:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{generationProgress.generated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Remaining:</span>
                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                              {Math.max(0, generationProgress.total - generationProgress.generated)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                            style={{ width: `${(generationProgress.generated / generationProgress.total) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          Task: {generationProgress.taskId.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Questions</p>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {totalCount}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">Verified</p>
              <p className="text-3xl font-black text-green-600 dark:text-green-400">
                {verifiedCount}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 dark:border-yellow-900">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">Pending Review</p>
              <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
                {pendingCount}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 dark:border-red-900">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">Low Quality</p>
              <p className="text-3xl font-black text-red-600 dark:text-red-400">
                {lowQualityCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Edit Question Dialog */}
        <Dialog open={!!editingQuestion} onOpenChange={(open) => !open && setEditingQuestion(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">Edit Question</DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Make changes to the question. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            {editingQuestion && (
              <div className="space-y-4 py-4">
                {/* Question Text */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Question Text</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    defaultValue={editingQuestion.question_data.question_text}
                    onChange={(e) => {
                      setEditingQuestion({
                        ...editingQuestion,
                        question_data: {
                          ...editingQuestion.question_data,
                          question_text: e.target.value
                        }
                      })
                    }}
                  />
                </div>

                {/* Code Snippet */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Code Snippet (optional)</label>
                  <textarea
                    className="w-full min-h-[150px] p-3 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-sm bg-slate-800 dark:bg-slate-950 text-green-400 dark:text-green-300"
                    defaultValue={editingQuestion.question_data.code_snippet || ''}
                    onChange={(e) => {
                      setEditingQuestion({
                        ...editingQuestion,
                        question_data: {
                          ...editingQuestion.question_data,
                          code_snippet: e.target.value || null
                        }
                      })
                    }}
                  />
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Answer Options</label>
                  {editingQuestion.question_data.options.map((option: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{option.id}.</span>
                        <input
                          type="checkbox"
                          checked={option.is_correct}
                          onChange={(e) => {
                            const newOptions = [...editingQuestion.question_data.options]
                            newOptions[index] = { ...option, is_correct: e.target.checked }
                            setEditingQuestion({
                              ...editingQuestion,
                              question_data: {
                                ...editingQuestion.question_data,
                                options: newOptions
                              }
                            })
                          }}
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-800 dark:checked:bg-blue-600"
                        />
                      </div>
                      <input
                        type="text"
                        defaultValue={option.text}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.question_data.options]
                          newOptions[index] = { ...option, text: e.target.value }
                          setEditingQuestion({
                            ...editingQuestion,
                            question_data: {
                              ...editingQuestion.question_data,
                              options: newOptions
                            }
                          })
                        }}
                        className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Explanation</label>
                  <textarea
                    className="w-full min-h-[80px] p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    defaultValue={editingQuestion.question_data.explanation || ''}
                    onChange={(e) => {
                      setEditingQuestion({
                        ...editingQuestion,
                        question_data: {
                          ...editingQuestion.question_data,
                          explanation: e.target.value
                        }
                      })
                    }}
                  />
                </div>

                {/* Difficulty Slider */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Difficulty Level: {editingQuestion.difficulty_level?.toFixed(1) || '0.5'}</label>
                  <Slider
                    value={[editingQuestion.difficulty_level || 0.5]}
                    onValueChange={([value]) => {
                      setEditingQuestion({
                        ...editingQuestion,
                        difficulty_level: value
                      })
                    }}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                    onClick={() => setEditingQuestion(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    onClick={() => handleUpdate(editingQuestion.id, {
                      question_data: editingQuestion.question_data,
                      difficulty_level: editingQuestion.difficulty_level
                    })}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Main Content - Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="pending">Pending Review ({pendingCount})</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
          </TabsList>

          {/* All Questions Tab */}
          <TabsContent value="all" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search question content..."
                      value={filters.search || ""}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={filters.language_id || "all"}
                    onValueChange={(value) => setFilters({ ...filters, language_id: value === "all" ? undefined : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="python_3">Python</SelectItem>
                      <SelectItem value="javascript_es6">JavaScript</SelectItem>
                      <SelectItem value="java_17">Java</SelectItem>
                      <SelectItem value="cpp_20">C++</SelectItem>
                      <SelectItem value="go_1_21">Go</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.is_verified === undefined ? "all" : filters.is_verified ? "verified" : "unverified"}
                    onValueChange={(value) => setFilters({ ...filters, is_verified: value === "all" ? undefined : value === "verified" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified Only</SelectItem>
                      <SelectItem value="unverified">Unverified Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions Toolbar */}
            {selectedQuestions.size > 0 && (
              <Card className="border-2 border-orange-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {selectedQuestions.size} question(s) selected
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleBulkApprove}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve All
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedQuestions(new Set())}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle>All Questions ({totalCount})</CardTitle>
                <CardDescription>Browse and manage all platform questions</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Loading...</div>
                ) : allQuestions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No questions found</div>
                ) : (
                  <div className="space-y-4">
                    {allQuestions.map((q) => renderQuestionCard(q))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Review Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Review ({pendingCount})</CardTitle>
                <CardDescription>Approve or reject AI-generated questions</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Loading...</div>
                ) : pendingQuestions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No pending questions</div>
                ) : (
                  <div className="space-y-4">
                    {pendingQuestions.map((q) => renderQuestionCard(q as AdminQuestion, true, true))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Low Quality Tab */}
          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Questions</CardTitle>
                <CardDescription>Create new questions using AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language *</Label>
                    <Select
                      value={genForm.language_id}
                      onValueChange={(value) => setGenForm({ ...genForm, language_id: value })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python_3">Python</SelectItem>
                        <SelectItem value="javascript_es6">JavaScript</SelectItem>
                        <SelectItem value="java_17">Java</SelectItem>
                        <SelectItem value="cpp_20">C++</SelectItem>
                        <SelectItem value="go_1_21">Go</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic *</Label>
                    <Select
                      value={selectedTopic?.name || ""}
                      onValueChange={handleTopicChange}
                    >
                      <SelectTrigger id="topic">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTopics.map((topic) => (
                          <SelectItem key={topic.major_topic_id} value={topic.name}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedTopic && (
                      <p className="text-xs text-slate-500">
                        Concept: {selectedTopic.mapping_id}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtopic">Sub-topic (Optional)</Label>
                    <Select
                      value={genForm.sub_topic || "any_subtopic"}
                      onValueChange={(value) => setGenForm({ ...genForm, sub_topic: value === "any_subtopic" ? "" : value })}
                      disabled={!selectedTopic}
                    >
                      <SelectTrigger id="subtopic">
                        <SelectValue placeholder={selectedTopic ? "Select a sub-topic" : "Select topic first"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any_subtopic">Any sub-topic</SelectItem>
                        {selectedTopic?.sub_topics.map((subTopic) => (
                          <SelectItem key={subTopic} value={subTopic}>
                            {subTopic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="count">Number of Questions (1-50)</Label>
                    <Input
                      id="count"
                      type="number"
                      min={1}
                      max={50}
                      value={genForm.count}
                      onChange={(e) => setGenForm({ ...genForm, count: parseInt(e.target.value) || 10 })}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="difficulty">
                      Question Difficulty: {genForm.difficulty.toFixed(2)} ({getDifficultyLabel(genForm.difficulty).label})
                    </Label>
                    <Slider
                      id="difficulty"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[genForm.difficulty]}
                      onValueChange={(value) => setGenForm({ ...genForm, difficulty: value[0] })}
                      className="mb-2"
                    />
                    <p className="text-xs text-slate-500">
                      Controls how challenging the generated questions will be
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={generating || !selectedTopic}
                    className="w-full h-12 text-base bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Generating {genForm.count} questions...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Generate {genForm.count} Questions
                      </>
                    )}
                  </Button>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Note:</strong> Generation runs in the background. Check the &quot;Pending Review&quot; tab in ~{genForm.count * 4} seconds to review generated questions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
