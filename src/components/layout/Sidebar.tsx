'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Video, 
  Calendar, 
  Settings, 
  Users,
  PlusCircle,
  History
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'New Meeting',
      href: '/meetings/new',
      icon: <PlusCircle className="w-5 h-5" />,
    },
    {
      label: 'Join Meeting',
      href: '/meetings/join',
      icon: <Video className="w-5 h-5" />,
    },
    {
      label: 'My Meetings',
      href: '/meetings',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'Recent',
      href: '/meetings/recent',
      icon: <History className="w-5 h-5" />,
    },
    {
      label: 'Participants',
      href: '/participants',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className={`w-64 bg-gray-900 text-white h-full ${className}`}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Navigation</h2>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-gray-800">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Start Meeting</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Video className="w-5 h-5" />
            <span className="font-medium">Join with Code</span>
          </button>
        </div>
      </div>

      {/* Storage Info */}
      <div className="p-6 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          <div className="flex justify-between mb-2">
            <span>Storage Used</span>
            <span>2.3 GB / 15 GB</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
