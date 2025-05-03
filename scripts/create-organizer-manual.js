/**
 * Manual script to create an organizer account in Firebase
 * 
 * This script uses the Firebase Web SDK to create a user and Firestore documents.
 * It's designed to be run in a browser environment, not Node.js.
 * 
 * Instructions:
 * 1. Start your Next.js development server: npm run dev
 * 2. Open your browser to: http://localhost:3000
 * 3. Open the browser console (F12 or right-click > Inspect > Console)
 * 4. Copy and paste this entire script into the console
 * 5. Press Enter to run it
 */

// Configuration - Change these values as needed
const ORGANIZER_EMAIL = 'organizer@riseretreat.com';
const ORGANIZER_PASSWORD = 'TemporaryPassword123!';
const ORGANIZER_NAME = 'Organisateur RISE';
const ORGANIZER_ROLE = 'organizer'; // 'organizer' or 'admin'

// Function to create an organizer account
async function createOrganizerAccount() {
  try {
    console.log('=== R.I.S.E. Retreat Organizer Account Setup ===');
    console.log(`Creating organizer account for ${ORGANIZER_EMAIL}...`);
    
    // Import Firebase modules from the global scope
    const { getAuth, createUserWithEmailAndPassword, signOut } = firebase.auth;
    const { getFirestore, doc, setDoc, serverTimestamp } = firebase.firestore;
    
    // Get Firebase instances
    const auth = getAuth();
    const db = getFirestore();
    
    // Create user in Firebase Auth
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, ORGANIZER_EMAIL, ORGANIZER_PASSWORD);
      console.log(`Created new user with UID: ${userCredential.user.uid}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.error(`User with email ${ORGANIZER_EMAIL} already exists.`);
        console.error('Please use a different email or delete the existing user from Firebase Auth.');
        return;
      } else {
        throw error;
      }
    }
    
    const uid = userCredential.user.uid;
    
    // Create timestamp
    const timestamp = serverTimestamp();
    
    // User data
    const userData = {
      uid: uid,
      email: ORGANIZER_EMAIL,
      displayName: ORGANIZER_NAME,
      role: ORGANIZER_ROLE,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Create document in users collection
    await setDoc(doc(db, 'users', uid), userData);
    console.log('Created user document in users collection');
    
    // Create document in organizers collection
    await setDoc(doc(db, 'organizers', uid), userData);
    console.log('Created user document in organizers collection');
    
    // Sign out the newly created user
    await signOut(auth);
    
    console.log('\n✅ Organizer account created successfully!');
    console.log(`Email: ${ORGANIZER_EMAIL}`);
    console.log(`Password: ${ORGANIZER_PASSWORD}`);
    console.log('Please change this password after first login.');
    
  } catch (error) {
    console.error('Error creating organizer account:', error);
  }
}

// Run the script
createOrganizerAccount();
