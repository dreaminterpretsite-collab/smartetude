'use client';

import type { User as FirebaseUser } from 'firebase/auth';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  className: 'troisieme' | 'seconde' | 'premiere' | 'terminale';
  inscriptionDate: number; // timestamp
  solde: number;
  photoURL?: string;
  referralId?: string | null;
  courseAccessExpires?: number | null; // timestamp
  welcomeBonusPending?: boolean;
};

export type AuthContextType = {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  hasCourseAccess: boolean;
};

export type Exercise = {
  id: string;
  userProfileId: string;
  subject: string;
  imageUri: string; // data URI
  submissionDate: number; // timestamp
  solution: string;
};

export type Payment = {
  id: string;
  userProfileId: string;
  userEmail: string;
  paymentDate: number; // timestamp
  amount: number;
  waveTransactionId: string;
  status: 'pending' | 'completed' | 'failed';
};
