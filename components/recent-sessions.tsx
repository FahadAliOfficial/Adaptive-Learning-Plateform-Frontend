"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, TrendingDown, RotateCcw } from "lucide-react"

interface Session {
  id: string
  timestamp: string // ISO date
  concept_id: string
  concept_name: string
  sub_topic: string
  score: number // 0.0-1.0
  difficulty: number // 0.0-1.0
  mastery_gain: number // Can be negative (decay)
  questions_answered: number
}

interface RecentSessionsProps {
  sessions: Session[]
  onPracticeAgain: (conceptId: string, subTopic: string) => void
}

export function RecentSessions({ sessions, onPracticeAgain }: RecentSessionsProps) {
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.4) return "Easy"
    if (difficulty < 0.7) return "Medium"
    return "Hard"
  }

  if (sessions.length === 0) {
    return (
      <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-600 dark:text-slate-400 py-8">
            No practice sessions yet. Start learning to see your progress here!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session, index) => {
            const isPositiveGain = session.mastery_gain >= 0

            return (
              <div
                key={session.id}
                className="relative pl-8 pb-6 last:pb-0 group"
              >
                {/* Timeline Line */}
                {index < sessions.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                )}

                {/* Timeline Dot */}
                <div className={`
                  absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center
                  ${isPositiveGain 
                    ? 'bg-green-600' 
                    : 'bg-red-600'
                  }
                  shadow-lg group-hover:scale-125 transition-transform
                `}>
                  {isPositiveGain ? (
                    <TrendingUp className="h-3 w-3 text-white" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-white" />
                  )}
                </div>

                {/* Session Content */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        {session.concept_name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {session.sub_topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
                      {getRelativeTime(session.timestamp)}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Score</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(session.score * 100)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Difficulty</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {getDifficultyLabel(session.difficulty)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Questions</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {session.questions_answered}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Mastery</p>
                      <p className={`text-sm font-bold ${
                        isPositiveGain 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isPositiveGain ? '+' : ''}{Math.round(session.mastery_gain * 100)}%
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPracticeAgain(session.concept_id, session.sub_topic)}
                    className="w-full text-xs hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500"
                  >
                    <RotateCcw className="h-3 w-3 mr-2" />
                    Practice Again
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
