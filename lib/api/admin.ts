/**
 * Admin API Service
 * 
 * Service layer for admin-related API endpoints.
 * Used by admin components for user management and analytics.
 */

import { get, post, apiClient } from './client';

/**
 * Admin user data structure (matches backend AdminUser schema)
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  language: string | null;
  joinedAt: string;
  lastActive: string | null;
  sessionsCompleted: number;
  avgMastery: number;
}

/**
 * Response for listing admin users
 */
export interface AdminUserListResponse {
  success: boolean;
  users: AdminUser[];
  total_count: number;
  active_count: number;
  inactive_count: number;
  suspended_count: number;
}

/**
 * Request to update user status
 */
export interface AdminUserStatusUpdateRequest {
  status: 'active' | 'inactive' | 'suspended';
}

/**
 * Response after updating user status
 */
export interface AdminUserStatusUpdateResponse {
  success: boolean;
  message: string;
  updated_user: AdminUser;
}

/**
 * Admin analytics data
 */
export interface AdminUserAnalytics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  new_users_last_7_days: number;
  new_users_last_30_days: number;
  avg_sessions_per_user: number;
  avg_mastery_across_platform: number;
  most_popular_language: string;
  languages_distribution: Record<string, number>;
}

/**
 * Get all users with optional search and filtering
 * 
 * @param search - Optional search query for email/name
 * @param status - Optional status filter (all, active, inactive, suspended)
 * @returns List of users with statistics
 */
export async function getUsers(
  search?: string,
  status?: string
): Promise<AdminUserListResponse> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status && status !== 'all') params.append('status', status);
  
  const endpoint = `/api/admin/users${params.toString() ? `?${params.toString()}` : ''}`;
  return get<AdminUserListResponse>(endpoint);
}

/**
 * Update user status
 * 
 * @param userId - User ID to update
 * @param newStatus - New status to set
 * @returns Updated user data
 */
export async function updateUserStatus(
  userId: string,
  newStatus: 'active' | 'inactive' | 'suspended'
): Promise<AdminUserStatusUpdateResponse> {
  return apiClient<AdminUserStatusUpdateResponse>(
    `/api/admin/users/${userId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    }
  );
}

/**
 * Get platform analytics for admin dashboard
 * 
 * @returns Comprehensive user analytics
 */
export async function getUserAnalytics(): Promise<AdminUserAnalytics> {
  return get<AdminUserAnalytics>('/api/admin/users/analytics');
}