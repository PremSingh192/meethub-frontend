'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout, EmailForm, OTPForm } from '@/components/auth';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const { isLoading } = useAuthStore();
  const router = useRouter();

  const handleEmailSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep('otp');
    toast.success('OTP sent to your email');
  };

  const handleOTPSuccess = () => {
    router.push('/dashboard');
  };

  const handleBack = () => {
    setStep('email');
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {step === 'email' ? (
          <EmailForm onSuccess={handleEmailSuccess} />
        ) : (
          <OTPForm
            email={email}
            onBack={handleBack}
            onSuccess={handleOTPSuccess}
          />
        )}
        
        {isLoading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
