"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, GitBranch, RefreshCw, Code, Database, AlertCircle, Box, Boxes } from "lucide-react"

// 8 Universal Concepts as per backend curriculum
const concepts = [
  {
    id: "UNIV_VAR",
    name: "Variables & Data Types",
    icon: Database,
    color: "",
    bgColor: "bg-transparent",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "UNIV_COND",
    name: "Conditionals",
    icon: GitBranch,
    color: "",
    bgColor: "bg-transparent",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "UNIV_LOOP",
    name: "Loops",
    icon: RefreshCw,
    color: "",
    bgColor: "bg-transparent",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "UNIV_FUNC",
    name: "Functions",
    icon: Code,
    color: "",
    bgColor: "bg-transparent",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "UNIV_COLL",
    name: "Collections",
    icon: Box,
    color: "",
    bgColor: "bg-transparent",
    textColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "UNIV_ERR",
    name: "Error Handling",
    icon: AlertCircle,
    color: "",
    bgColor: "bg-transparent",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    id: "UNIV_OOP_BASIC",
    name: "OOP Basics",
    icon: Boxes,
    color: "",
    bgColor: "bg-transparent",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "UNIV_OOP_ADV",
    name: "Advanced OOP",
    icon: Boxes,
    color: "",
    bgColor: "bg-transparent",
    textColor: "text-pink-600 dark:text-pink-400",
  },
]

interface MasteryData {
  [key: string]: {
    mastery: number // 0.0 - 1.0
    fluency: number // 0.0 - 1.0 (time efficiency)
    confidence: number // 0.0 - 1.0 (score stability)
    last_practiced: string // ISO date
    days_passed: number
  }
}

interface MasteryHeatmapProps {
  languageId: string
  masteryData?: MasteryData
  onConceptClick?: (conceptId: string) => void
}

export function MasteryHeatmap({ languageId, masteryData, onConceptClick }: MasteryHeatmapProps) {
  // Calculate decay: mastery * e^(-0.02 * days_passed)
  const calculateDecayedMastery = (mastery: number, daysPassed: number): number => {
    return mastery * Math.exp(-0.02 * daysPassed)
  }

  // Get decay indicator
  const getDecayIndicator = (daysPassed: number) => {
    if (daysPassed < 3) return { emoji: "🔥", label: "Fresh", color: "text-green-600 dark:text-green-400" }
    if (daysPassed < 7) return { emoji: "⏰", label: "Review Soon", color: "text-yellow-600 dark:text-yellow-400" }
    return { emoji: "⚠️", label: "Decaying", color: "text-red-600 dark:text-red-400" }
  }

  // Get mastery color
  const getMasteryColor = (mastery: number) => {
    if (mastery < 0.5) return { bg: "bg-red-500", text: "text-red-600 dark:text-red-400", label: "Needs Work" }
    if (mastery < 0.75) return { bg: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400", label: "Good" }
    return { bg: "bg-green-500", text: "text-green-600 dark:text-green-400", label: "Mastered" }
  }

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Mastery Progress</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track your understanding across 8 core concepts
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Needs Work</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Mastered</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {concepts.map((concept) => {
          const data = masteryData?.[concept.id] || { mastery: 0, fluency: 0, confidence: 0, last_practiced: new Date().toISOString(), days_passed: 0 }
          const decayedMastery = calculateDecayedMastery(data.mastery, data.days_passed)
          const decayIndicator = getDecayIndicator(data.days_passed)
          const masteryColor = getMasteryColor(decayedMastery)
          const Icon = concept.icon

          return (
            <Card
              key={concept.id}
              className={`
                relative overflow-hidden border-2 transition-all duration-300 cursor-pointer
                hover:shadow-xl hover:-translate-y-1 group
                ${decayedMastery < 0.5 
                  ? 'border-red-200 dark:border-red-900 hover:border-red-500' 
                  : decayedMastery < 0.75 
                  ? 'border-yellow-200 dark:border-yellow-900 hover:border-yellow-500'
                  : 'border-green-200 dark:border-green-900 hover:border-green-500'
                }
                bg-white dark:bg-slate-800
              `}
              onClick={() => onConceptClick?.(concept.id)}
            >
              {concept.color && (
                <div className={`absolute inset-0 ${concept.color} opacity-60 group-hover:opacity-90 transition-opacity`}></div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${concept.bgColor}`}>
                    <Icon className={`h-6 w-6 ${concept.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                      {concept.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Mastery Score */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Mastery</span>
                  <span className={`text-lg font-black ${masteryColor.text}`}>
                    {Math.round(decayedMastery * 100)}%
                  </span>
                </div>

                {/* Mastery Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${masteryColor.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.round(decayedMastery * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={masteryColor.text}>{masteryColor.label}</span>
                    {data.mastery > 0 && data.days_passed > 0 && (
                      <span className="text-slate-500 dark:text-slate-400">
                        {data.mastery > decayedMastery && `↓ ${Math.round((data.mastery - decayedMastery) * 100)}% decay`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Fluency & Confidence Metrics */}
                {data.mastery > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {/* Fluency */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Fluency</span>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">
                          {Math.round((data.fluency || 0) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((data.fluency || 0) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Confidence</span>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          {Math.round((data.confidence || 0) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((data.confidence || 0) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last Practiced */}
                {data.mastery > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Last practiced: <span className="font-semibold">{getRelativeTime(data.last_practiced)}</span>
                    </p>
                  </div>
                )}

                {/* Not Started */}
                {data.mastery === 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-500 italic">
                      Not started yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
