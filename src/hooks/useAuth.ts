'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();
  const router = useRouter();

  // Auto-logout on token expiry
  useEffect(() => {
    if (isAuthenticated && token) {
      const checkToken = async () => {
        try {
          console.log('Checking token validity with profile API...');
          await authAPI.getProfile();
          console.log('Token is valid');
        } catch (error: any) {
          console.error('Token validation failed:', error);
          
          // Only logout if it's a 401 (unauthorized) error
          if (error.response?.status === 401) {
            console.log('Token expired, logging out...');
            logout();
            router.push('/login');
          } else {
            console.log('Profile API failed but token might still be valid, not logging out');
          }
        }
      };

      // Check token validity immediately when authenticated
      checkToken();
      
      // Then check every 5 minutes
      const interval = setInterval(checkToken, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, logout, router]);

  // Redirect to login if not authenticated
  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
      return false;
    }
    return true;
  };

  // Send OTP
  const sendOTP = async (email: string) => {
    setLoading(true);
    try {
      await authAPI.sendOTP(email);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send OTP' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const response = await authAPI.verifyOTP(email, otp);
      console.log('useAuth verifyOTP response:', response);
      
      // Extract token and user from the correct nested structure
      const { token, user } = response.data.data;
      console.log('useAuth extracted auth data:', { token, user });
      
      login(token, user);
      return { success: true };
    } catch (error: any) {
      console.error('useAuth verifyOTP error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid OTP' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get profile' 
      };
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    requireAuth,
    sendOTP,
    verifyOTP,
    getProfile,
  };
};
