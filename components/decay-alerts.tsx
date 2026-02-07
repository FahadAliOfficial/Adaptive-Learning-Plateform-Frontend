"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar } from "lucide-react"

interface DecayAlert {
  concept_id: string
  concept_name: string
  current_mastery: number
  original_mastery: number
  days_passed: number
}

interface DecayAlertsProps {
  alerts: DecayAlert[]
  onScheduleReview: (conceptId: string) => void
}

export function DecayAlerts({ alerts, onScheduleReview }: DecayAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const decayPercentage = Math.round((alert.original_mastery - alert.current_mastery) * 100)
        
        return (
          <Alert
            key={alert.concept_id}
            className="border-2 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30"
          >
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <AlertTitle className="text-orange-900 dark:text-orange-200 font-bold">
              Knowledge Decay Alert
            </AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4 mt-2">
              <div className="flex-1">
                <p className="text-orange-800 dark:text-orange-300">
                  Your <span className="font-bold">{alert.concept_name}</span> mastery has decayed to{" "}
                  <span className="font-black text-orange-600 dark:text-orange-400">
                    {Math.round(alert.current_mastery * 100)}%
                  </span>{" "}
                  (was {Math.round(alert.original_mastery * 100)}%, -{decayPercentage}% decay).
                  <span className="block text-sm mt-1 text-orange-700 dark:text-orange-400">
                    Last reviewed {alert.days_passed} days ago. Review recommended!
                  </span>
                </p>
              </div>
              <Button
                onClick={() => onScheduleReview(alert.concept_id)}
                className="bg-orange-600 hover:bg-orange-500 text-white shadow-lg whitespace-nowrap"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Review
              </Button>
            </AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}
