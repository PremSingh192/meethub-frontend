'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Sidebar, Footer } from '@/components/layout';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, token, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard Layout Auth State:', { isAuthenticated, isLoading, token: token?.substring(0, 20) + '...', user });
    
    if (!isLoading && !isAuthenticated) {
      console.log('Redirecting to login - not authenticated');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, token, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, returning null');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
