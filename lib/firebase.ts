'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { Auth, getAuth, connectAuthEmulator } from "firebase/auth";
import { Firestore, getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { FirebaseStorage, getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
// For development purposes, we're hardcoding the Firebase config
// In production, you should use environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBGQTSRrHALnRXEULEMdxe4vADQmTf9yfE",
  authDomain: "retraiterise-app.firebaseapp.com",
  projectId: "retraiterise-app",
  storageBucket: "retraiterise-app.appspot.com",
  messagingSenderId: "1098765432",
  appId: "1:1098765432:web:abc123def456ghi789jkl"
};

// Initialize Firebase
let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;
let firebaseDb: Firestore | undefined;
let firebaseStorage: FirebaseStorage | undefined;

// Only initialize Firebase on the client side
if (typeof window !== 'undefined') {
  try {
    console.log("Attempting to initialize Firebase...");
    
    // Initialize Firebase if it hasn't been initialized yet
    if (!getApps().length) {
      console.log("Initializing Firebase app...");
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      console.log("Firebase app already initialized, getting instance...");
      firebaseApp = getApp();
    }
    
    // Initialize Firebase services
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    
    console.log("Firebase services initialized successfully");
    
    // Enable offline persistence for Firestore
    if (firebaseDb) {
      enableIndexedDbPersistence(firebaseDb)
        .then(() => {
          console.log("Firestore persistence enabled");
        })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.warn('Firestore persistence failed: Multiple tabs open');
          } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the features required for persistence
            console.warn('Firestore persistence not supported by this browser');
          } else {
            console.error('Firestore persistence error:', err);
          }
        });
    }
    
    // Connect to emulators in development if needed
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
      if (firebaseAuth) connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
      if (firebaseDb) connectFirestoreEmulator(firebaseDb, 'localhost', 8080);
      if (firebaseStorage) connectStorageEmulator(firebaseStorage, 'localhost', 9199);
      console.log('Connected to Firebase emulators');
    }
    
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firebaseDb;
export const storage = firebaseStorage;