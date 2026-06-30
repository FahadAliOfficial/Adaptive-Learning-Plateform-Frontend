/**
 * Authentication Types
 * 
 * Type definitions for authentication-related data structures.
 * Aligned with backend API schemas from FastAPI.
 */

export type LanguageId = 
  | 'python_3' 
  | 'javascript_es6' 
  | 'java_17' 
  | 'cpp_20' 
  | 'go_1_21';

/**
 * Experience level for users
 */
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * User profile data
 */
export interface User {
  id: string;
  email: string;
  last_active_language: string | null;
  total_exams_taken: number;
  created_at: string; // ISO timestamp
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Forgot password request payload.
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Forgot password response.
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  last_active_language: string | null;
  is_admin: boolean;
  status: 'active' | 'inactive' | 'suspended';
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  language_id?: LanguageId;  // Optional - set during onboarding
  experience_level?: ExperienceLevel;  // Optional - set during onboarding
}

/**
 * Registration response from API
 */
export interface RegisterResponse {
  user_id: string;
  message: string;
  starting_topic: string;
  experience_level: string;
  access_token: string;
  token_type: string;
}

/**
 * Token refresh response
 */
export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
}

/**
 * Password change request
 */
export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

/**
 * Notification preferences stored by the backend.
 */
export interface NotificationPreferences {
  email_notifications: boolean;
  test_reminders: boolean;
  weekly_progress: boolean;
  achievement_alerts: boolean;
}

/**
 * API error response structure
 */
export interface APIError {
  detail: string | ValidationError[];
}

/**
 * Validation error detail (Pydantic)
 */
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * Generic API response wrapper for error handling
 */
export interface APIResponse<T> {
  data?: T;
  error?: APIError;
}
