// Script to set up initial organizer accounts in Firebase
// Run with: node scripts/setup-organizers.js

const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: require('firebase-admin').credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
});

const auth = getAuth(app);
const db = getFirestore(app);

// Initial organizer accounts to create
const organizers = [
  {
    email: 'admin@riseretreat.com',
    password: 'TemporaryPassword123!', // Should be changed after first login
    displayName: 'Admin RISE',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
  },
  {
    email: 'organizer@riseretreat.com',
    password: 'TemporaryPassword123!', // Should be changed after first login
    displayName: 'Organisateur RISE',
    role: 'organizer',
    isActive: true,
    createdAt: new Date(),
  }
];

// Function to create a user in Firebase Auth and Firestore
async function createOrganizer(organizer) {
  try {
    // Check if user already exists
    try {
      const userRecord = await auth.getUserByEmail(organizer.email);
      console.log(`User ${organizer.email} already exists with UID: ${userRecord.uid}`);
      
      // Update user in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: organizer.email,
        displayName: organizer.displayName,
        role: organizer.role,
        isActive: organizer.isActive,
        updatedAt: new Date(),
      }, { merge: true });
      
      // Add to organizers collection
      await db.collection('organizers').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: organizer.email,
        displayName: organizer.displayName,
        role: organizer.role,
        isActive: organizer.isActive,
        updatedAt: new Date(),
      }, { merge: true });
      
      console.log(`Updated organizer ${organizer.email} in Firestore`);
      return userRecord.uid;
    } catch (error) {
      // User doesn't exist, create new user
      if (error.code === 'auth/user-not-found') {
        const userRecord = await auth.createUser({
          email: organizer.email,
          password: organizer.password,
          displayName: organizer.displayName,
        });
        
        console.log(`Created new user ${organizer.email} with UID: ${userRecord.uid}`);
        
        // Add user to Firestore
        await db.collection('users').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email: organizer.email,
          displayName: organizer.displayName,
          role: organizer.role,
          isActive: organizer.isActive,
          createdAt: new Date(),
        });
        
        // Add to organizers collection
        await db.collection('organizers').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email: organizer.email,
          displayName: organizer.displayName,
          role: organizer.role,
          isActive: organizer.isActive,
          createdAt: new Date(),
        });
        
        console.log(`Added organizer ${organizer.email} to Firestore`);
        return userRecord.uid;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error creating/updating organizer ${organizer.email}:`, error);
    return null;
  }
}

// Create all organizers
async function setupOrganizers() {
  console.log('Setting up organizer accounts...');
  
  for (const organizer of organizers) {
    await createOrganizer(organizer);
  }
  
  console.log('Organizer setup complete!');
}

// Run the setup
setupOrganizers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error in setup:', error);
    process.exit(1);
  });
