/**
 * Exam API Service
 *
 * Client for starting sessions, selecting questions, submitting exams, and
 * fetching results.
 */

import { get, post } from './client'

export interface ExamStartRequest {
  user_id: string
  language_id: string
  major_topic_id: string
  session_type: 'diagnostic' | 'practice' | 'exam' | 'review'
}

export interface ExamStartResponse {
  session_id: string
  started_at: string
}

export interface QuestionOption {
  id: string
  text: string
  is_correct: boolean
  error_type?: string | null
  explanation?: string
}

export interface QuestionData {
  question_text: string
  code_snippet?: string
  options: QuestionOption[]
  explanation?: string
  primary_error_pattern?: string
  targeted_errors?: string[]
  question_type?: string
  quality_score?: number
}

export interface SelectedQuestion {
  id: string
  question_data: QuestionData
  difficulty: number
  quality_score: number
  is_verified: boolean
  mapping_id?: string
  language_id?: string
  sub_topic?: string | null
}

export interface SelectQuestionsRequest {
  user_id: string
  language_id: string
  mapping_id: string
  target_difficulty: number
  count: number
  difficulty_tolerance?: number
  mode: 'practice' | 'exam' | 'review'
  seen_ratio?: number
}

export interface SelectQuestionsResponse {
  questions: SelectedQuestion[]
  total_selected: number
  warehouse_status: Record<string, any>
}

export interface QuestionResultPayload {
  q_id: string
  sub_topic: string
  difficulty: number
  is_correct: boolean
  selected_choice: string
  correct_choice: string
  time_spent: number
  expected_time: number
  error_type?: string | null
  question_text?: string
  code_snippet?: string | null
  options?: QuestionOption[]
  explanation?: string | null
}

export interface ExamSubmissionPayload {
  user_id: string
  session_id: string
  language_id: string
  major_topic_id: string
  session_type: 'diagnostic' | 'practice' | 'exam' | 'review'
  results: QuestionResultPayload[]
  total_time_seconds: number
}

export interface ExamSubmissionResponse {
  success: boolean
  session_id: string
  accuracy: number
  fluency_ratio: number
  new_mastery_score: number
  synergies_applied: string[]
  soft_gate_violations: string[]
  recommendations: string[]
}

export interface ExamResultsResponse {
  session_id: string
  session_type: 'diagnostic' | 'practice' | 'exam' | 'review'
  language_id: string
  major_topic_id: string
  overall_score: number
  accuracy: number
  time_taken_seconds: number
  questions: QuestionResultPayload[]
  strong_topics: { name: string; accuracy: number }[]
  error_patterns: { error_type: string; count: number }[]
  recommendations: { title: string; description: string }[]
  analysis_status: string
  analysis_bullets: string[] | null
}

export async function startExamSession(request: ExamStartRequest): Promise<ExamStartResponse> {
  return post<ExamStartResponse>('/api/exam/start', request)
}

export async function selectQuestions(request: SelectQuestionsRequest): Promise<SelectQuestionsResponse> {
  return post<SelectQuestionsResponse>('/question-bank/select', request)
}

export async function submitExam(request: ExamSubmissionPayload): Promise<ExamSubmissionResponse> {
  return post<ExamSubmissionResponse>('/api/exam/submit', request)
}

export async function getExamResults(sessionId: string): Promise<ExamResultsResponse> {
  return get<ExamResultsResponse>(`/api/exam/results/${sessionId}`)
}
