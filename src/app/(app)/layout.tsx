'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { useFirebase } from '@/firebase';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isUserLoading } = useFirebase();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, loading, isUserLoading, router]);

  if (loading || isUserLoading || !user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
