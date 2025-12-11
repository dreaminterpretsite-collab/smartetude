'use client';

import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // This configuration is now built at RUNTIME on the client,
  // preventing API keys from being baked into the build artifacts.
  const firebaseConfig: FirebaseOptions = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };

  // This check prevents re-initializing the app on every render.
  if (!getApps().length) {
    // If running in a real Firebase Hosting environment, initializeApp() is parameterless.
    // In all other environments (like local dev or Netlify), we fall back to the config object.
    try {
      // This will fail in dev environment because of how Netlify injects variables,
      // which is fine. We fall back to the config object.
      return getSdks(initializeApp());
    } catch (e) {
      return getSdks(initializeApp(firebaseConfig));
    }
  }

  // If already initialized, return the SDKs with the existing app instance.
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
