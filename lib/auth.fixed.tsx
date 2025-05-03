'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

// Define user roles
export type UserRole = 'client' | 'organizer' | 'admin';

// Extend Firebase User type with our custom fields
export interface RiseUser extends User {
  role?: UserRole;
  displayName: string | null;
}

// Define the shape of our auth context
interface AuthContextType {
  user: RiseUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string, role?: UserRole) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInAsOrganizer: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signUp: async () => {
    throw new Error('AuthContext not initialized');
  },
  signIn: async () => {
    throw new Error('AuthContext not initialized');
  },
  signInAsOrganizer: async () => {
    throw new Error('AuthContext not initialized');
  },
  logOut: async () => {
    throw new Error('AuthContext not initialized');
  },
  resetPassword: async () => {
    throw new Error('AuthContext not initialized');
  },
  updateUserRole: async () => {
    throw new Error('AuthContext not initialized');
  },
});

// Provider component to wrap the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RiseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Check if we're running on the client side
  const isClient = typeof window !== 'undefined';

  // Monitor online status
  useEffect(() => {
    if (!isClient) return;

    const handleOnline = () => {
      console.log('App is online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('App is offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isClient]);

  // Listen for auth state changes
  useEffect(() => {
    // Skip if we're not on the client side or if Firebase auth is not available
    if (!isClient || !auth) {
      setLoading(false);
      return;
    }

    setInitialized(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser && db) {
        try {
          // Get user data from Firestore to include role
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          
          try {
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              // Combine Firebase user with Firestore data
              const userData = userDoc.data();
              const extendedUser: RiseUser = {
                ...firebaseUser,
                role: userData.role || 'client',
                displayName: userData.displayName || firebaseUser.displayName,
              };
              
              console.log('User authenticated with role:', extendedUser.role);
              setUser(extendedUser);
            } else {
              // User exists in Firebase Auth but not in Firestore
              // Create a basic user document if we're online
              if (isOnline) {
                try {
                  await setDoc(userDocRef, {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    role: 'client', // Default role
                    createdAt: Timestamp.now(),
                    lastLogin: Timestamp.now()
                  });
                  
                  // Set the user with the default role
                  const extendedUser: RiseUser = {
                    ...firebaseUser,
                    role: 'client',
                    displayName: firebaseUser.displayName,
                  };
                  setUser(extendedUser);
                } catch (createError) {
                  console.error('Error creating user document:', createError);
                  setUser(firebaseUser as RiseUser);
                }
              } else {
                // We're offline, just use the Firebase user
                setUser(firebaseUser as RiseUser);
              }
            }
          } catch (firestoreError: any) {
            console.error('Error fetching user data:', firestoreError);
            
            // If we're offline, use the cached Firebase user
            if (!isOnline || firestoreError.code === 'failed-precondition' || 
                firestoreError.message.includes('offline')) {
              console.log('Using cached user data due to offline status');
              const extendedUser: RiseUser = {
                ...firebaseUser,
                role: 'client', // Default role when offline
                displayName: firebaseUser.displayName,
              };
              setUser(extendedUser);
            } else {
              setError('Failed to load user data: ' + firestoreError.message);
              setUser(firebaseUser as RiseUser);
            }
          }
        } catch (err) {
          console.error('Error in auth state change:', err);
          setError('Failed to process authentication');
          setUser(firebaseUser as RiseUser);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [isClient, isOnline]);

  // Sign up function
  const signUp = async (
    email: string, 
    password: string, 
    displayName: string,
    role: UserRole = 'client'
  ): Promise<UserCredential> => {
    try {
      setError(null);
      
      // Check if Firebase services are initialized
      if (!auth || !db) {
        throw new Error('Firebase services not initialized');
      }
      
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        email,
        displayName,
        role,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      });
      
      return credential;
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null);
      
      // Check if Firebase services are initialized
      if (!auth || !db) {
        throw new Error('Firebase services not initialized');
      }
      
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await setDoc(
        doc(db, 'users', credential.user.uid), 
        { lastLogin: Timestamp.now() },
        { merge: true }
      );
      
      return credential;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  // Sign in as organizer function
  const signInAsOrganizer = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null);
      
      // Check if Firebase services are initialized
      if (!auth || !db) {
        throw new Error('Firebase services not initialized');
      }
      
      // First authenticate with Firebase
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      // Set the user role to organizer directly
      // This is a temporary fix - in production, you would check against an organizers collection
      // or a specific field in the user document
      
      // Update the user's last login and role in Firestore
      await setDoc(
        doc(db, 'users', credential.user.uid),
        {
          lastLogin: Timestamp.now(),
          role: 'organizer', // Force the role to be organizer
        },
        { merge: true }
      );

      // Create an organizer document if it doesn't exist
      const organizerDocRef = doc(db, 'organizers', credential.user.uid);
      const organizerDoc = await getDoc(organizerDocRef);
      
      if (!organizerDoc.exists()) {
        // Create the organizer document
        await setDoc(organizerDocRef, {
          uid: credential.user.uid,
          email: credential.user.email,
          role: 'organizer',
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now()
        });
      }

      // Fetch the updated user document from Firestore to get all fields (including role)
      const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
      let extendedUser: RiseUser | null = null;
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        extendedUser = {
          ...userData,
          ...credential.user,
          role: 'organizer', // Force the role to be organizer
          displayName: userData.displayName || credential.user.displayName || '',
        };
        console.log('Setting user with organizer role:', extendedUser);
        setUser(extendedUser);
      } else {
        // fallback: set user with minimum info
        extendedUser = {
          ...credential.user,
          role: 'organizer', // Force the role to be organizer
          displayName: credential.user.displayName || '',
        } as RiseUser;
        console.log('Setting fallback user with organizer role:', extendedUser);
        setUser(extendedUser);
      }
      
      return credential;
    } catch (err: any) {
      console.error('Error in signInAsOrganizer:', err);
      setError(err.message || 'Failed to sign in as organizer');
      throw err;
    }
  };

  // Log out function
  const logOut = async (): Promise<void> => {
    try {
      setError(null);
      
      // Check if Firebase auth is initialized
      if (!auth) {
        throw new Error('Firebase auth not initialized');
      }
      
      await signOut(auth);
    } catch (err: any) {
      setError(err.message || 'Failed to log out');
      throw err;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      
      // Check if Firebase auth is initialized
      if (!auth) {
        throw new Error('Firebase auth not initialized');
      }
      
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      throw err;
    }
  };

  // Update user role function (admin/organizer only)
  const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
    try {
      setError(null);
      
      // Check if Firestore is initialized
      if (!db) {
        throw new Error('Firebase Firestore not initialized');
      }
      
      await setDoc(
        doc(db, 'users', uid),
        { role },
        { merge: true }
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
      throw err;
    }
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        signInAsOrganizer,
        logOut,
        resetPassword,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);
