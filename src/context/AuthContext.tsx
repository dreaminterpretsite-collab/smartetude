'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import type { User as FirebaseUser, Auth } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  onSnapshot,
  Firestore,
  getFirestore,
} from 'firebase/firestore';

import { FirebaseApp, getApps, initializeApp } from 'firebase/app';

import type { AuthContextType, UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

/* ------------------------------------------------------------------ */
/* Firebase configuration (via Render environment variables) */
/* ------------------------------------------------------------------ */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<{
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------------ */
  /* Initialize Firebase (client only) */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    const auth = getAuth(app);
    const firestore = getFirestore(app);

    setServices({ app, auth, firestore });
  }, []);

  /* ------------------------------------------------------------------ */
  /* Auth state listener */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!services) return;

    const unsubscribe = onAuthStateChanged(services.auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setUserProfile(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [services]);

  /* ------------------------------------------------------------------ */
  /* User profile & admin role */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!services || !user) {
      if (!user) setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const profileRef = doc(services.firestore, 'users', user.uid);
    const adminRef = doc(services.firestore, 'roles_admin', user.uid);

    const unsubscribeProfile = onSnapshot(
      profileRef,
      (docSnap) => {
        setUserProfile(
          docSnap.exists()
            ? ({ id: docSnap.id, ...docSnap.data() } as UserProfile)
            : null
        );
        setIsLoading(false);
      },
      (error) => {
        console.error('Profile error:', error);
        setIsLoading(false);
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: profileRef.path,
            operation: 'get',
          })
        );
      }
    );

    const unsubscribeAdmin = onSnapshot(
      adminRef,
      (docSnap) => {
        setIsAdmin(docSnap.exists());
      },
      () => {
        setIsAdmin(false);
      }
    );

    return () => {
      unsubscribeProfile();
      unsubscribeAdmin();
    };
  }, [user, services]);

  /* ------------------------------------------------------------------ */

  const hasCourseAccess =
    !!userProfile?.courseAccessExpires &&
    userProfile.courseAccessExpires > Date.now();

  const value: AuthContextType = {
    firebaseApp: services?.app || null,
    auth: services?.auth || null,
    firestore: services?.firestore || null,
    user,
    userProfile,
    loading: isLoading,
    isAdmin,
    hasCourseAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      <FirebaseErrorListener />
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Chargement de votre session...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

/* ------------------------------------------------------------------ */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
