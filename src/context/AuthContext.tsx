'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import type { AuthContextType, UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  hasCourseAccess: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore, isUserLoading } = useFirebase();
  const user = auth.currentUser;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const hasCourseAccess = !!(userProfile?.courseAccessExpires && userProfile.courseAccessExpires > Date.now());

  useEffect(() => {
    if (isUserLoading) return;

    let unsubscribeProfile: (() => void) | undefined;
    let unsubscribeAdmin: (() => void) | undefined;
  
    if (user) {
      setLoading(true);
      const profileRef = doc(firestore, 'users', user.uid);
      unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
        } else {
          setUserProfile(null);
        }
        // setLoading(false) is handled in the admin snapshot
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
            path: profileRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setUserProfile(null);
        setLoading(false);
      });
  
      const adminRef = doc(firestore, 'roles_admin', user.uid);
      unsubscribeAdmin = onSnapshot(adminRef, (docSnap) => {
        setIsAdmin(docSnap.exists());
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
            path: adminRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setIsAdmin(false);
        setLoading(false);
      });
    } else {
      setUserProfile(null);
      setIsAdmin(false);
      setLoading(false);
    }
  
    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeAdmin) unsubscribeAdmin();
    };
  }, [user, firestore, isUserLoading]);

  const value = { user, userProfile, loading, isAdmin, hasCourseAccess };

  if (loading || isUserLoading) {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className='text-muted-foreground'>Chargement de votre session...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
