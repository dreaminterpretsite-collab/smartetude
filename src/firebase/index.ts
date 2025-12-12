'use client';

// This file serves as the main entry point for Firebase-related functionality.
// It re-exports the necessary providers, hooks, and utilities to be used
// throughout the application, ensuring a consistent and centralized way to
// access Firebase services.

// The FirebaseClientProvider is the core provider that initializes Firebase
// for the client-side of the application. It should wrap the root of the app.
export * from './client-provider';


// These hooks provide real-time data fetching from Firestore.
// They are designed to be used in client components to subscribe to
// document or collection changes.
export * from './firestore/use-collection';
export * from './firestore/use-doc';

// These utilities provide a non-blocking way to perform Firestore write
// operations. They are useful for 'fire-and-forget' updates where you
// don't need to wait for the operation to complete on the client.
export * from './non-blocking-updates';
