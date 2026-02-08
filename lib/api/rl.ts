/**
 * RL Recommendation API Service
 * 
 * Client for RL-powered curriculum recommendations.
 */

import { post, get } from './client'

export interface RecommendationRequest {
  user_id: string
  language_id: string
  strategy?: 'ppo' | 'dqn' | 'a2c' | 'ensemble' | 'baseline'
  deterministic?: boolean
}

export interface RecommendationResponse {
  mapping_id: string
  major_topic_id: string
  difficulty: number
  action_id: number
  strategy_used: string
  confidence: number
  metadata: {
    recommendation_id?: string
    prerequisite_check: {
      passed: boolean
      violations?: string[]
    }
    [key: string]: any
  }
}

export interface HealthStatusResponse {
  service: string
  status: 'healthy' | 'degraded' | 'unavailable'
  models_loaded: {
    ppo: boolean
    dqn: boolean
    a2c: boolean
  }
  environment_ready: boolean
  available_strategies: string[]
}

/**
 * Get RL-powered curriculum recommendation
 */
export async function getRLRecommendation(request: RecommendationRequest): Promise<RecommendationResponse> {
  return post<RecommendationResponse>('/api/rl/recommend', request)
}

/**
 * Check RL service health status
 */
export async function getRLHealthStatus(): Promise<HealthStatusResponse> {
  return get<HealthStatusResponse>('/api/rl/health')
}
