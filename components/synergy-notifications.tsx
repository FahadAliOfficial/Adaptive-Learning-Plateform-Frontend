"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles, TrendingUp } from "lucide-react"

interface SynergyBonus {
  from_concept: string
  to_concept: string
  bonus_amount: number // percentage
  reinforcement_weight: number // 0.0-1.0
  bidirectional: boolean
}

interface SynergyNotificationsProps {
  bonuses: SynergyBonus[]
}

export function SynergyNotifications({ bonuses }: SynergyNotificationsProps) {
  if (bonuses.length === 0) return null

  return (
    <div className="space-y-3">
      {bonuses.map((bonus, index) => (
        <Alert
          key={index}
          className="border-2 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/30"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg flex-shrink-0 animate-pulse">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <AlertTitle className="text-purple-900 dark:text-purple-200 font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Synergy Bonus Activated!
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="text-purple-800 dark:text-purple-300">
                  ✨ Mastering <span className="font-bold">{bonus.from_concept}</span> boosted{" "}
                  <span className="font-bold">{bonus.to_concept}</span> by{" "}
                  <span className="font-black text-green-600 dark:text-green-400">
                    +{bonus.bonus_amount}%
                  </span>
                  {bonus.bidirectional && (
                    <span className="ml-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                      (Bidirectional ↔)
                    </span>
                  )}
                </p>
                <div className="mt-2 text-xs text-purple-700 dark:text-purple-400">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                    Reinforcement Weight: {(bonus.reinforcement_weight * 100).toFixed(0)}%
                  </span>
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}
