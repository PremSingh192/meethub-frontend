import React from 'react';
import { Video } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = 'Google Meet Clone',
  subtitle = 'Connect with anyone, anywhere',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full shadow-lg">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Auth Form Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border border-gray-200/50 p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
