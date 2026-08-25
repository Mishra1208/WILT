// Firebase Configuration & Initialization
// Automatically integrates with Firebase if credentials are provided in env vars,
// otherwise gracefully falls back to local storage engine.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForLocalDevelopment-12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "wilt-learning.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "wilt-learning",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "wilt-learning.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

let app;
let db;
let auth;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase initialized in local mock fallback mode:", e?.message);
}

export { app, db, auth };
