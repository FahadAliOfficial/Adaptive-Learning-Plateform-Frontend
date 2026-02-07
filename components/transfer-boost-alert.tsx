"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles, Zap } from "lucide-react"

interface TransferBoost {
  source_language: string
  source_concept: string
  target_language: string
  target_concept: string
  source_mastery: number // 0.0-1.0
  boost_amount: number // percentage boost
  transfer_coefficient: number // 0.0-1.0
  logic_boost: number
  syntax_friction: number
}

interface TransferBoostAlertProps {
  boosts: TransferBoost[]
}

export function TransferBoostAlert({ boosts }: TransferBoostAlertProps) {
  if (boosts.length === 0) return null

  return (
    <div className="space-y-3">
      {boosts.map((boost, index) => (
        <Alert
          key={index}
          className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <AlertTitle className="text-blue-900 dark:text-blue-200 font-bold flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Cross-Language Transfer Activated!
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="text-blue-800 dark:text-blue-300">
                  Your <span className="font-bold">{boost.source_language} {boost.source_concept}</span> mastery{" "}
                  <span className="font-black text-blue-600 dark:text-blue-400">
                    ({Math.round(boost.source_mastery * 100)}%)
                  </span>{" "}
                  is boosting <span className="font-bold">{boost.target_language} {boost.target_concept}</span> by{" "}
                  <span className="font-black text-green-600 dark:text-green-400">
                    +{boost.boost_amount}%
                  </span>
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-blue-700 dark:text-blue-400">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    Logic Transfer: +{Math.round(boost.logic_boost * 100)}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                    Syntax Friction: -{Math.round(boost.syntax_friction * 100)}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    Net Coefficient: {boost.transfer_coefficient.toFixed(2)}
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
