'use client';

import React from 'react';
import { Video, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showUserMenu?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Google Meet Clone',
  showUserMenu = true,
  className = '',
}) => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfile = () => {
    // Navigate to profile page
    router.push('/profile');
  };

  return (
    <header className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              {title}
            </h1>
          </div>

          {/* User Menu */}
          {showUserMenu && user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProfile}
                  icon={<Settings className="w-4 h-4" />}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={<LogOut className="w-4 h-4" />}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
