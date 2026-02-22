'use client';

import React, { useState, useEffect } from 'react';
import { Key, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface OTPFormProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const OTPForm: React.FC<OTPFormProps> = ({
  email,
  onBack,
  onSuccess,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { setLoading: setAuthLoading, login } = useAuthStore();

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
  };

  const validateOTP = (): boolean => {
    return otp.every(digit => digit !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTP()) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setAuthLoading(true);

    try {
      const otpString = otp.join('');
      console.log('Submitting OTP:', { email, otp: otpString });
      
      const response = await authAPI.verifyOTP(email, otpString);
      console.log('OTP verification response:', response);
      
      // Extract token and user from the axios response structure
      // response.data contains the API response with { success, message, data: { token, user } }
      const { token, user } = response.data.data;
      
      if (!token || !user) {
        throw new Error('Invalid response: missing token or user data');
      }
      
      console.log('Storing authentication:', { token, user });
      
      // Store token and user in auth store (this also saves to localStorage)
      login(token, user);
      
      // Wait a moment for localStorage to be updated
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify token is stored in localStorage
      const storedToken = localStorage.getItem('token');
      console.log('Token stored in localStorage:', storedToken);
      
      // Verify token is stored in auth store
      const authState = useAuthStore.getState();
      console.log('Auth store state:', { 
        token: authState.token, 
        user: authState.user, 
        isAuthenticated: authState.isAuthenticated 
      });
      
      // Test the token by making a quick API call to verify Bearer token works
      try {
        const testResponse = await authAPI.getProfile();
        console.log('Bearer token test successful:', testResponse);
      } catch (testError: any) {
        console.error('Bearer token test failed:', testError);
        console.error('Error response:', testError.response);
        
        // Check if the request had the Authorization header
        if (testError.config?.headers) {
          console.log('Request headers:', testError.config.headers);
        }
        
        throw new Error('Bearer token validation failed');
      }
      
      toast.success('Login successful!');
      onSuccess();
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      if (error.response?.status === 401) {
        setError('Invalid or expired OTP. Please try again.');
      } else if (error.response?.status === 400) {
        setError('Invalid OTP format. Please enter 6 digits.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(error.response?.data?.message || 'Invalid OTP');
      }
      
      // Clear OTP on error for retry
      setOtp(['', '', '', '', '', '']);
      
      // Focus first input
      const firstInput = document.getElementById('otp-0') as HTMLInputElement;
      firstInput?.focus();
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authAPI.sendOTP(email);
      toast.success('OTP sent successfully');
      setTimeLeft(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to email
        </button>
      </div>

      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Enter verification code
        </h3>
        <p className="text-gray-600">
          We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full py-4 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          disabled={otp.some(digit => !digit)}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-t-blue-600"></div>
              <span className="ml-2">Verifying...</span>
            </div>
          ) : 'Verify OTP'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          {canResend ? (
            <button
              onClick={handleResendOTP}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-gray-500">
              Resend in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
