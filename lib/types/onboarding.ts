/**
 * Onboarding Types
 * 
 * Type definitions for onboarding flow data structures.
 */

import { LanguageId, ExperienceLevel } from './auth';

/**
 * Language option for onboarding selection
 */
export interface LanguageOption {
  id: LanguageId;
  name: string;
  description: string;
  icon: string; // Path to icon or emoji
  popular?: boolean;
}

/**
 * Experience level option
 */
export interface ExperienceLevelOption {
  id: ExperienceLevel;
  name: string;
  description: string;
  icon: string;
}

/**
 * Onboarding data collected during registration flow
 */
export interface OnboardingData {
  language_id: LanguageId;
  experience_level: ExperienceLevel;
}

/**
 * Available language options for onboarding
 */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'python_3',
    name: 'Python',
    description: 'General-purpose, beginner-friendly',
    icon: '🐍',
    popular: true
  },
  {
    id: 'javascript_es6',
    name: 'JavaScript',
    description: 'Web development essential',
    icon: '⚡',
    popular: true
  },
  {
    id: 'java_17',
    name: 'Java',
    description: 'Enterprise and Android',
    icon: '☕'
  },
  {
    id: 'cpp_20',
    name: 'C++',
    description: 'High-performance systems',
    icon: '⚙️'
  },
  {
    id: 'go_1_21',
    name: 'Go',
    description: 'Cloud and backend services',
    icon: '🔵'
  }
];

/**
 * Available experience level options
 */
export const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevelOption[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'New to programming or this language',
    icon: '🌱'
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Comfortable with basics, ready to advance',
    icon: '📚'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Experienced, seeking mastery',
    icon: '🚀'
  }
];
