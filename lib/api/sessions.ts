/**
 * Sessions API Service
 * 
 * Client for fetching exam session history and analytics
 */

import { get } from './client'

export interface SessionHistoryItem {
  session_id: string
  session_type: 'diagnostic' | 'practice' | 'exam' | 'review'
  language_id: string
  major_topic_id: string
  topic_name: string
  overall_score: number
  accuracy: number
  difficulty: number
  time_taken_seconds: number
  created_at: string
  completed_at: string
  question_count: number
  correct_count: number
}

export interface SessionHistoryResponse {
  sessions: SessionHistoryItem[]
  total_count: number
  limit: number
  offset: number
}

export interface SessionHistoryFilters {
  language_id?: string
  session_type?: 'practice' | 'exam' | 'review'
  limit?: number
  offset?: number
}

/**
 * Get user's exam session history
 */
export async function getSessionHistory(
  filters: SessionHistoryFilters = {}
): Promise<SessionHistoryResponse> {
  const params = new URLSearchParams()
  
  if (filters.language_id) params.append('language_id', filters.language_id)
  if (filters.session_type) params.append('session_type', filters.session_type)
  if (filters.limit) params.append('limit', String(filters.limit))
  if (filters.offset) params.append('offset', String(filters.offset))
  
  const queryString = params.toString()
  const url = `/api/sessions/history${queryString ? `?${queryString}` : ''}`
  
  return get<SessionHistoryResponse>(url)
}
