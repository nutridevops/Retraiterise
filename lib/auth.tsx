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
  profileImageUrl?: string;
}

// Define the shape of our auth context
interface AuthContextType {
  user: RiseUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string, role?: UserRole) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInAsOrganizer: (email: string, password: string) => Promise<boolean>;
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
                profileImageUrl: userData.profileImageUrl || '',
              };
              
              console.log('User authenticated with role:', extendedUser.role);
              setUser(extendedUser);
            } else {
              // User exists in Firebase Auth but not in Firestore
              // Create a new user document with default role
              const newUserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                role: 'client', // Default role
                createdAt: Timestamp.now(),
                lastLogin: Timestamp.now(),
              };
              
              await setDoc(userDocRef, newUserData);
              
              const extendedUser: RiseUser = {
                ...firebaseUser,
                role: 'client',
              };
              
              console.log('Created new user document with default role');
              setUser(extendedUser);
            }
          } catch (err) {
            console.error('Error fetching user data from Firestore:', err);
            // Still set the user with basic Firebase Auth data
            const basicUser: RiseUser = {
              ...firebaseUser,
              role: 'client', // Default role if Firestore fails
            };
            setUser(basicUser);
          }
          
          // Update last login timestamp
          try {
            await setDoc(
              userDocRef,
              { lastLogin: Timestamp.now() },
              { merge: true }
            );
          } catch (err) {
            console.error('Error updating last login:', err);
          }
        } catch (err) {
          console.error('Error in auth state change handler:', err);
          // Set user with just Firebase Auth data as fallback
          setUser(firebaseUser as RiseUser);
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in
        setUser(null);
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [isClient]);

  // Sign up function
  const signUp = async (
    email: string, 
    password: string, 
    displayName: string,
    role: UserRole = 'client'
  ): Promise<UserCredential> => {
    try {
      setError(null);
      
      // Check if Firebase auth and Firestore are initialized
      if (!auth || !db) {
        throw new Error('Firebase not initialized');
      }
      
      // Create the user in Firebase Auth
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create a user document in Firestore
      const userDocRef = doc(db, 'users', credential.user.uid);
      await setDoc(userDocRef, {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName,
        role,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
      });
      
      // If the role is organizer, also create an entry in the organizers collection
      if (role === 'organizer') {
        const organizerDocRef = doc(db, 'organizers', credential.user.uid);
        await setDoc(organizerDocRef, {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName,
          role: 'organizer',
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
        });
      }
      
      // If the role is client, also create an entry in the clients collection
      if (role === 'client') {
        const clientDocRef = doc(db, 'clients', credential.user.uid);
        await setDoc(clientDocRef, {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName,
          role: 'client',
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
        });
      }
      
      return credential;
    } catch (err: any) {
      console.error('Error in signUp:', err);
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  // Sign in function for clients
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Check if Firebase auth and Firestore are initialized
      if (!auth || !db) {
        throw new Error('Firebase not initialized');
      }
      
      // Sign in with Firebase Auth
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if the user is a client
      const userDocRef = doc(db, 'users', credential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userDocRef, {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          role: 'client', // Default role
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
        });
        
        // Also create a client document
        const clientDocRef = doc(db, 'clients', credential.user.uid);
        await setDoc(clientDocRef, {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          role: 'client',
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
        });
        
        return true;
      }
      
      const userData = userDoc.data();
      
      // If user is not a client, sign them out and throw an error
      if (userData.role !== 'client' && userData.role !== 'admin') {
        await signOut(auth);
        throw new Error('not-authorized');
      }
      
      // Update last login timestamp
      await setDoc(
        userDocRef,
        { lastLogin: Timestamp.now() },
        { merge: true }
      );
      
      return true;
    } catch (err: any) {
      console.error('Error in signIn:', err);
      
      // Customize error messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ou mot de passe incorrect.');
        throw new Error('user-not-found');
      } else if (err.message === 'not-authorized') {
        setError('Votre compte n\'a pas les permissions nécessaires pour accéder au portail client.');
        throw new Error('not-authorized');
      } else {
        setError(err.message || 'Une erreur est survenue lors de la connexion.');
        throw err;
      }
    }
  };

  // Sign in as organizer function
  const signInAsOrganizer = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Check if Firebase auth and Firestore are initialized
      if (!auth || !db) {
        throw new Error('Firebase not initialized');
      }
      
      // Sign in with Firebase Auth
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if the user is an organizer
      const userDocRef = doc(db, 'users', credential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // If user document doesn't exist, check if they're in the organizers collection
        const organizerDocRef = doc(db, 'organizers', credential.user.uid);
        const organizerDoc = await getDoc(organizerDocRef);
        
        if (!organizerDoc.exists()) {
          // Not an organizer, sign them out and throw an error
          await signOut(auth);
          throw new Error('not-authorized');
        }
        
        // Create user document with organizer role
        await setDoc(userDocRef, {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          role: 'organizer',
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
        });
        
        return true;
      }
      
      const userData = userDoc.data();
      
      // If user is not an organizer or admin, sign them out and throw an error
      if (userData.role !== 'organizer' && userData.role !== 'admin') {
        await signOut(auth);
        throw new Error('not-authorized');
      }
      
      // Update last login timestamp
      await setDoc(
        userDocRef,
        { lastLogin: Timestamp.now() },
        { merge: true }
      );
      
      // Ensure they have an entry in the organizers collection
      const organizerDocRef = doc(db, 'organizers', credential.user.uid);
      const organizerDoc = await getDoc(organizerDocRef);
      
      if (!organizerDoc.exists()) {
        // Create the organizer document
        await setDoc(organizerDocRef, {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: userData.displayName || credential.user.displayName,
          role: 'organizer',
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now()
        });
      } else {
        // Update last login in organizers collection
        await setDoc(
          organizerDocRef,
          { lastLogin: Timestamp.now() },
          { merge: true }
        );
      }
      
      return true;
    } catch (err: any) {
      console.error('Error in signInAsOrganizer:', err);
      
      // Customize error messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ou mot de passe incorrect.');
        throw new Error('user-not-found');
      } else if (err.message === 'not-authorized') {
        setError('Votre compte n\'a pas les permissions nécessaires pour accéder au portail organisateur.');
        throw new Error('not-authorized');
      } else {
        setError(err.message || 'Une erreur est survenue lors de la connexion.');
        throw err;
      }
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
      
      // Update role in users collection
      await setDoc(
        doc(db, 'users', uid),
        { role },
        { merge: true }
      );
      
      // If role is organizer, ensure they have an entry in organizers collection
      if (role === 'organizer') {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Create or update organizer document
          await setDoc(
            doc(db, 'organizers', uid),
            {
              uid,
              email: userData.email,
              displayName: userData.displayName,
              role: 'organizer',
              updatedAt: Timestamp.now(),
            },
            { merge: true }
          );
        }
      }
      
      // If role is client, ensure they have an entry in clients collection
      if (role === 'client') {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Create or update client document
          await setDoc(
            doc(db, 'clients', uid),
            {
              uid,
              email: userData.email,
              displayName: userData.displayName,
              role: 'client',
              updatedAt: Timestamp.now(),
            },
            { merge: true }
          );
        }
      }
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
