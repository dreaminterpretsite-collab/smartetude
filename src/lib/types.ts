import type { User as FirebaseUser, Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

/* =======================
   TYPES UTILITAIRES
======================= */

export type Timestamp = number;

/* =======================
   UTILISATEUR
======================= */

export type SchoolLevel =
  | 'troisieme'
  | 'seconde'
  | 'premiere'
  | 'terminale';

export type UserProfile = {
  readonly id: string;
  name: string;
  email: string;
  className: SchoolLevel;
  inscriptionDate: Timestamp;
  solde: number;

  photoURL?: string | null;
  referralId: string | null;

  courseAccessExpires: Timestamp | null;

  // 🎁 Bonus de bienvenue
  welcomeBonusPending: boolean;

  // 💰 Parrainage / MLM
  referralBalance: number;
  upline: string[];
};

/* =======================
   CONTEXTE AUTH
======================= */

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

/* =======================
   EXERCICES
======================= */

export type Exercise = {
  readonly id: string;
  userId: string;

  subject: string;
  imageUri: string;
  submissionDate: Timestamp;

  solution: string;
};

/* =======================
   PAIEMENTS
======================= */

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export type Payment = {
  readonly id: string;
  userId: string;
  userEmail: string;

  paymentDate: Timestamp;
  amount: number;

  waveTransactionId: string;
  status: PaymentStatus;
};

/* =======================
   RETRAITS
======================= */

export type WithdrawalStatus = 'pending' | 'completed' | 'rejected';

export type WithdrawalRequest = {
  readonly id: string;
  userId: string;
  userEmail: string;
  userName: string;

  amount: number;
  status: WithdrawalStatus;
  requestDate: Timestamp;
};
