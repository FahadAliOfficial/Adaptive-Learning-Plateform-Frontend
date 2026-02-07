/**
 * Authentication Context
 * 
 * Provides global authentication state and methods to the entire app.
 * Implements hybrid token strategy with automatic session restoration.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as authAPI from '@/lib/api/auth';
import { clearAccessToken } from '@/lib/api/client';
import type { User, LoginRequest, RegisterRequest } from '@/lib/types/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false - don't block UI on initial load
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Check if user is authenticated by trying to restore session
   * Uses refresh token cookie to get new access token
   */
  const checkAuth = useCallback(async () => {
    try {
      // Don't set loading to true - this runs in background
      setError(null);
      
      // Try to refresh access token using httpOnly cookie
      await authAPI.refreshToken();
      
      // If refresh succeeds, fetch user profile
      const userData = await authAPI.getMe();
      setUser(userData);
      
    } catch (err) {
      // Refresh failed - user is not authenticated (this is OK)
      setUser(null);
      clearAccessToken();
    }
  }, []);

  /**
   * Restore session on mount (page load/refresh)
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      
      // Access token is now in memory via setAccessToken() in auth.ts
      // Refresh token is in httpOnly cookie
      
      // Fetch user profile
      const userData = await authAPI.getMe();
      setUser(userData);
      
      // Sync language preference with localStorage
      if (userData.last_active_language) {
        localStorage.setItem('selectedLanguage', userData.last_active_language);
      }
      
      // Check if user is admin first
      if (response.is_admin) {
        router.push('/admin');
      } else if (!userData.last_active_language) {
        // Regular user needs onboarding (first time login without language set)
        router.push('/onboarding/language');
      } else {
        // Regular user with language set - go to dashboard
        router.push('/dashboard');
      }
      
    } catch (err: any) {
      const errorMessage = err.data?.detail || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.register(data);
      
      // Access token is now in memory
      // Refresh token is in httpOnly cookie
      
      // Create minimal user object from registration response
      const userData: User = {
        id: response.user_id,
        email: data.email,
        last_active_language: null, // Force onboarding for new users
        total_exams_taken: 0,
        created_at: new Date().toISOString(),
      };
      
      setUser(userData);
      
      // Always redirect to onboarding for new users to select their language
      router.push('/onboarding/language');
      
    } catch (err: any) {
      const errorMessage = err.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call API to clear refresh_token cookie
      await authAPI.logout();
      
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state
      setUser(null);
      clearAccessToken();
      setError(null);
      setIsLoading(false);
      
      // Redirect to login
      router.push('/login');
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * 
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
