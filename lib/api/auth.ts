/**
 * Authentication API Service
 * 
 * Service layer for authentication-related API endpoints.
 * Used by AuthContext and authentication components.
 */

import { post, get, put, setAccessToken, clearAccessToken, getAccessToken } from './client';
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  RegisterRequest,
  RegisterResponse,
  TokenRefreshResponse,
  User,
  PasswordChangeRequest,
  NotificationPreferences,
  LanguageId,
  ExperienceLevel,
} from '@/lib/types/auth';

/**
 * Register a new user
 * 
 * @param data - Registration data (email, password, language_id, experience_level)
 * @returns Registration response with user_id, access_token, and starting_topic
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await post<RegisterResponse>('/api/auth/register', data);
  
  // Store access token in memory
  setAccessToken(response.access_token);
  
  // Refresh token is automatically set as httpOnly cookie by backend
  
  return response;
}

/**
 * Login user
 * 
 * @param data - Login credentials (email, password)
 * @returns Login response with access_token and user data
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await post<LoginResponse>('/api/auth/login', data);
  
  // Store access token in memory
  setAccessToken(response.access_token);
  
  // Refresh token is automatically set as httpOnly cookie by backend
  
  return response;
}

/**
 * Request password reset assistance.
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return post<ForgotPasswordResponse>('/api/auth/forgot-password', data);
}

/**
 * Logout user
 * 
 * Clears access token from memory and refresh token cookie from backend.
 */
export async function logout(): Promise<void> {
  try {
    // Call backend to clear refresh_token cookie
    await post('/api/auth/logout');
  } catch (error) {
    // Even if API call fails, clear local state
    console.error('Logout API call failed:', error);
  } finally {
    // Clear access token from memory
    clearAccessToken();
  }
}

/**
 * Refresh access token using refresh token cookie
 * 
 * @returns New access token
 */
export async function refreshToken(): Promise<TokenRefreshResponse> {
  const response = await post<TokenRefreshResponse>('/api/auth/refresh');
  
  // Update access token in memory
  setAccessToken(response.access_token);
  
  return response;
}

/**
 * Get current user profile
 * 
 * @returns User profile data
 */
export async function getMe(): Promise<User> {
  return get<User>('/api/auth/me');
}

/**
 * Change user password
 * 
 * @param data - Current and new password
 * @returns Success response
 */
export async function changePassword(data: PasswordChangeRequest): Promise<{ success: boolean; message: string }> {
  return post('/api/auth/change-password', data);
}

/**
 * Get notification preferences for the current user.
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return get<NotificationPreferences>('/api/auth/notification-preferences');
}

/**
 * Update notification preferences for the current user.
 */
export async function updateNotificationPreferences(
  data: NotificationPreferences
): Promise<NotificationPreferences> {
  return put<NotificationPreferences>('/api/auth/notification-preferences', data);
}

/**
 * Update user profile (language and experience level)
 * 
 * @param data - Language ID and experience level
 * @returns Success response
 */
export async function updateProfile(data: {
  language_id: LanguageId;
  experience_level: ExperienceLevel;
}): Promise<{ success: boolean; message: string }> {
  return put('/api/auth/profile', data);
}

/**
 * Check if user is authenticated
 * 
 * Checks if access token exists in memory.
 * Note: Doesn't validate token - just checks presence.
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
