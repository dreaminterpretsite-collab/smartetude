
'use client';

import type { User as FirebaseUser, Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  className: 'troisieme' | 'seconde' | 'premiere' | 'terminale';
  inscriptionDate: number; // timestamp
  solde: number;
  photoURL?: string | null;
  referralId?: string | null;
  courseAccessExpires?: number | null; // timestamp
  welcomeBonusPending?: boolean;
  referralBalance?: number; // MLM earnings
  upline?: string[]; // Array of referrer IDs
};

export type AuthContextType = {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
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

export type WithdrawalRequest = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  requestDate: number; // timestamp
};
