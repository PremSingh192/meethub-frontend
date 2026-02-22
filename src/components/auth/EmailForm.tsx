'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface EmailFormProps {
  onSuccess: (email: string) => void;
  loading?: boolean;
  error: string | null;
}

export const EmailForm: React.FC<EmailFormProps> = ({ onSuccess, loading, error }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await authAPI.sendOTP(email);
      onSuccess(email);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          disabled={loading || isSubmitting}
          required
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          loading={loading || isSubmitting}
          className="w-full py-4 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          disabled={!email || isSubmitting}
        >
          {loading || isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-t-blue-600"></div>
              <span className="ml-2">Sending...</span>
            </div>
          ) : 'Send OTP'}
        </Button>
      </div>
    </form>
  );
};
