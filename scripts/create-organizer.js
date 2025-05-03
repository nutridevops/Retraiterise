// Script to create an organizer account in Firebase
// Run with: node scripts/create-organizer.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

// Organizer details - Change these as needed
const ORGANIZER_EMAIL = 'organizer@riseretreat.com';
const ORGANIZER_PASSWORD = 'TemporaryPassword123!';
const ORGANIZER_NAME = 'Organisateur RISE';
const ORGANIZER_ROLE = 'organizer'; // 'organizer' or 'admin'

// Initialize Firebase Admin SDK
try {
  console.log('Initializing Firebase Admin SDK...');
  
  // Check for required environment variables
  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    console.error('Error: Missing Firebase Admin SDK credentials in .env.local file');
    console.error('Please add FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY');
    process.exit(1);
  }

  const app = initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Function to create an organizer
  async function createOrganizer() {
    try {
      console.log(`Creating organizer account for ${ORGANIZER_EMAIL}...`);
      
      // Check if user already exists
      try {
        const userRecord = await auth.getUserByEmail(ORGANIZER_EMAIL);
        console.log(`User ${ORGANIZER_EMAIL} already exists with UID: ${userRecord.uid}`);
        
        // Update user in Firestore
        await updateUserInFirestore(userRecord.uid);
        console.log(`Updated organizer ${ORGANIZER_EMAIL} in Firestore`);
        
      } catch (error) {
        // User doesn't exist, create new user
        if (error.code === 'auth/user-not-found') {
          const userRecord = await auth.createUser({
            email: ORGANIZER_EMAIL,
            password: ORGANIZER_PASSWORD,
            displayName: ORGANIZER_NAME,
          });
          
          console.log(`Created new user ${ORGANIZER_EMAIL} with UID: ${userRecord.uid}`);
          
          // Add user to Firestore
          await updateUserInFirestore(userRecord.uid);
          console.log(`Added organizer ${ORGANIZER_EMAIL} to Firestore`);
          
        } else {
          throw error;
        }
      }
      
      console.log('Organizer setup complete!');
      console.log(`Email: ${ORGANIZER_EMAIL}`);
      console.log(`Password: ${ORGANIZER_PASSWORD}`);
      console.log('Please change this password after first login.');
      
    } catch (error) {
      console.error(`Error creating/updating organizer:`, error);
    }
  }

  // Function to update user in Firestore
  async function updateUserInFirestore(uid) {
    const userData = {
      uid: uid,
      email: ORGANIZER_EMAIL,
      displayName: ORGANIZER_NAME,
      role: ORGANIZER_ROLE,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to users collection
    await db.collection('users').doc(uid).set(userData, { merge: true });
    console.log(`- Added/updated user document in 'users' collection`);
    
    // Add to organizers collection
    await db.collection('organizers').doc(uid).set(userData, { merge: true });
    console.log(`- Added/updated user document in 'organizers' collection`);
  }

  // Run the script
  createOrganizer();
  
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}
