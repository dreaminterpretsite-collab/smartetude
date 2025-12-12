'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="smart-etudes-theme">
      <FirebaseClientProvider>
        <AuthProvider>{children}</AuthProvider>
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
