/**
 * Curriculum API Service
 * 
 * Loads curriculum data for topic/subtopic dropdowns in admin interfaces.
 */

import { get } from './client'

export interface CurriculumTopic {
  major_topic_id: string;
  mapping_id: string;
  name: string;
  global_difficulty: number;
  prerequisites: string[];
  sub_topics: string[];
}

export interface LanguageCurriculum {
  language_id: string;
  name: string;
  roadmap: CurriculumTopic[];
}

export interface TopicProgress {
  mapping_id: string;
  major_topic_id: string;
  name: string;
  description: string;
  mastery: number;
  confidence: number;
  accessible: boolean;
  completed: boolean;
  recommended?: boolean;
  prerequisites: string[];
  difficulty: number;
  last_practiced: string | null;
  order: number;
}

export interface StudentProgressStats {
  total_topics: number;
  completed_topics: number;
  avg_mastery: number;
  total_sessions: number;
  avg_accuracy: number;
  last_activity: string | null;
}

export interface StudentProgressResponse {
  language_id: string;
  language_name: string;
  topics: TopicProgress[];
  stats: StudentProgressStats;
}

let cachedCurriculum: LanguageCurriculum[] | null = null

/**
 * Fetch curriculum data from backend
 */
export async function getCurriculum(): Promise<LanguageCurriculum[]> {
  if (cachedCurriculum) {
    return cachedCurriculum
  }

  try {
    const response = await fetch('/curriculum/all', {
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error('Failed to load curriculum')
    }
    
    const data = await response.json()
    cachedCurriculum = data
    return data
  } catch (error) {
    console.error('Failed to load curriculum:', error)
    return []
  }
}

/**
 * Get topics for a specific language
 */
export function getTopicsForLanguage(curriculum: LanguageCurriculum[], languageId: string): CurriculumTopic[] {
  const lang = curriculum.find(l => l.language_id === languageId)
  return lang?.roadmap || []
}

/**
 * Get a specific topic by mapping_id
 */
export function getTopicByMappingId(curriculum: LanguageCurriculum[], languageId: string, mappingId: string): CurriculumTopic | undefined {
  const topics = getTopicsForLanguage(curriculum, languageId)
  return topics.find(t => t.mapping_id === mappingId)
}

/**
 * Get display name for a language
 */
export function getLanguageName(curriculum: LanguageCurriculum[], languageId: string): string {
  const lang = curriculum.find(l => l.language_id === languageId)
  return lang?.name || languageId
}

/**
 * Get student progress for a specific language
 * Returns mastery scores, accessibility, and completion status for all topics
 */
export async function getStudentProgress(languageId: string): Promise<StudentProgressResponse> {
  return await get<StudentProgressResponse>(
    `/api/user/languages/${languageId}/progress`
  )
}
