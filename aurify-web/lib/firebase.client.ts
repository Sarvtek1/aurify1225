// lib/firebase.client.ts
import { initializeApp, FirebaseApp, getApps } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

/** Singleton app */
let app: FirebaseApp;
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      ...(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID && {
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      }),
    });
  }
  return app;
}

/** IMPORTANT: bind Firestore to the named database "aurify1225" (Doha) */
let db: Firestore;
export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp(), "aurify1225");
  }
  return db;
}
