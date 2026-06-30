/**
 * API Client
 * 
 * Base HTTP client for making requests to the backend API.
 * Implements hybrid authentication strategy:
 * - Access tokens stored in memory (React state)
 * - Refresh tokens stored in httpOnly cookies (auto-sent by browser)
 * - Automatic token refresh on 401 errors
 */

import type { APIError } from '@/lib/types/auth';

const API_BASE_URL = ''; // Empty = same origin, proxied through Next.js rewrites
const REQUEST_TIMEOUT = 10000; // 10 seconds timeout
const AUTH_RETRY_EXCLUDED_ENDPOINTS = new Set([
  '/api/auth/login',
  '/api/auth/login/form',
  '/api/auth/register',
  '/api/auth/refresh',
]);

/**
 * In-memory access token storage (cleared on page refresh)
 * This is more secure than localStorage because it's not accessible via XSS
 */
let accessToken: string | null = null;

async function refreshAccessTokenIfPossible(): Promise<string | null> {
  const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!refreshResponse.ok) {
    return null;
  }

  const refreshData = await refreshResponse.json();
  const token = typeof refreshData?.access_token === 'string' ? refreshData.access_token : null;
  setAccessToken(token);
  return token;
}

/**
 * Store access token in memory
 */
export function setAccessToken(token: string | null) {
  accessToken = token;
}

/**
 * Get current access token from memory
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Clear access token from memory
 */
export function clearAccessToken() {
  accessToken = null;
}

/**
 * Custom error class for API errors
 */
export class APIClientError extends Error {
  constructor(
    public status: number,
    public data: APIError,
    message?: string
  ) {
    super(message || 'API request failed');
    this.name = 'APIClientError';
  }
}

/**
 * Parse error response from API
 */
async function parseErrorResponse(response: Response): Promise<APIError> {
  try {
    const data = await response.json();
    return data as APIError;
  } catch {
    return { detail: response.statusText || 'Unknown error occurred' };
  }
}

/**
 * Make HTTP request to API with timeout
 * 
 * @param endpoint - API endpoint (e.g., '/api/auth/login')
 * @param options - Fetch options
 * @returns Response data
 * @throws APIClientError on HTTP errors
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const isAuthEndpoint = endpoint.startsWith('/api/auth/');
  const shouldRetryWithRefresh = !AUTH_RETRY_EXCLUDED_ENDPOINTS.has(endpoint);

  if (!accessToken && !isAuthEndpoint) {
    const refreshedToken = await refreshAccessTokenIfPossible();
    if (!refreshedToken) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new APIClientError(401, { detail: 'Session expired. Please login again.' });
    }
  }
  
  // Default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  // Add access token if available (from memory, not localStorage!)
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  // Include credentials to send/receive cookies
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important: sends httpOnly cookies
  };
  
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);
    
    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && shouldRetryWithRefresh) {
      const refreshedToken = await refreshAccessTokenIfPossible();

      // Refresh token is invalid/expired -> force login
      if (!refreshedToken) {
        clearAccessToken();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        throw new APIClientError(401, { detail: 'Session expired. Please login again.' });
      }

      // Retry original request with new access token
      headers['Authorization'] = `Bearer ${refreshedToken}`;
      const retryResponse = await fetch(url, { ...config, headers });

      if (!retryResponse.ok) {
        const errorData = await parseErrorResponse(retryResponse);
        throw new APIClientError(retryResponse.status, errorData);
      }

      if (retryResponse.status === 204) {
        return {} as T;
      }

      return retryResponse.json();
    }
    
    // Handle other HTTP errors
    if (!response.ok) {
      const errorData = await parseErrorResponse(response);
      throw new APIClientError(response.status, errorData);
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }
    
    //  Parse JSON response
    return response.json();
    
  } catch (error) {
    // Network errors or other fetch failures
    if (error instanceof APIClientError) {
      throw error;
    }
    
    // Handle timeout/abort errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIClientError(0, { 
        detail: 'Request timeout. Please check if the backend server is running at ' + API_BASE_URL
      });
    }
    
    throw new APIClientError(0, { 
      detail: error instanceof Error ? error.message : 'Network request failed' 
    });
  }
}

/**
 * GET request helper
 */
export async function get<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function post<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: RequestInit = {}
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request helper
 */
export async function put<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: RequestInit = {}
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request helper
 */
export async function del<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Format API error for display
 */
export function formatAPIError(error: unknown): string {
  if (error instanceof APIClientError) {
    const { data } = error;
    
    // Handle validation errors (Pydantic)
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((err) => `${err.loc.join('.')}: ${err.msg}`)
        .join(', ');
    }
    
    // Handle string error message
    if (typeof data.detail === 'string') {
      return data.detail;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
