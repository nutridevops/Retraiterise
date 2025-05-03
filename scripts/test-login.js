// Test script for login functionality
const { signInWithEmailAndPassword, getAuth } = require("firebase/auth");
const { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
require('dotenv').config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testClientLogin(email, password) {
  console.log(`\n--- Testing Client Login for ${email} ---`);
  try {
    // Sign in with Firebase Auth
    const credential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✓ Firebase Auth login successful");
    
    // Check if the user is a client
    const userDocRef = doc(db, 'users', credential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log("✗ User document doesn't exist in Firestore");
      return false;
    }
    
    const userData = userDoc.data();
    console.log(`User role: ${userData.role}`);
    
    // Check if user is in clients collection
    const clientDocRef = doc(db, 'clients', credential.user.uid);
    const clientDoc = await getDoc(clientDocRef);
    
    if (clientDoc.exists()) {
      console.log("✓ User exists in clients collection");
    } else {
      console.log("✗ User does not exist in clients collection");
    }
    
    // Verify role
    if (userData.role === 'client' || userData.role === 'admin') {
      console.log("✓ User has correct role for client portal");
      return true;
    } else {
      console.log("✗ User does not have correct role for client portal");
      return false;
    }
  } catch (err) {
    console.error("Error in client login test:", err.message);
    return false;
  }
}

async function testOrganizerLogin(email, password) {
  console.log(`\n--- Testing Organizer Login for ${email} ---`);
  try {
    // Sign in with Firebase Auth
    const credential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✓ Firebase Auth login successful");
    
    // Check if the user is an organizer
    const userDocRef = doc(db, 'users', credential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log("✗ User document doesn't exist in Firestore");
      return false;
    }
    
    const userData = userDoc.data();
    console.log(`User role: ${userData.role}`);
    
    // Check if user is in organizers collection
    const organizerDocRef = doc(db, 'organizers', credential.user.uid);
    const organizerDoc = await getDoc(organizerDocRef);
    
    if (organizerDoc.exists()) {
      console.log("✓ User exists in organizers collection");
    } else {
      console.log("✗ User does not exist in organizers collection");
    }
    
    // Verify role
    if (userData.role === 'organizer' || userData.role === 'admin') {
      console.log("✓ User has correct role for organizer portal");
      return true;
    } else {
      console.log("✗ User does not have correct role for organizer portal");
      return false;
    }
  } catch (err) {
    console.error("Error in organizer login test:", err.message);
    return false;
  }
}

async function createTestUsers() {
  console.log("\n--- Creating Test Users If They Don't Exist ---");
  
  // Test user credentials
  const testUsers = [
    { email: 'testclient@example.com', password: 'testpassword123', role: 'client', displayName: 'Test Client' },
    { email: 'testorganizer@example.com', password: 'testpassword123', role: 'organizer', displayName: 'Test Organizer' }
  ];
  
  for (const user of testUsers) {
    try {
      // Check if user already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log(`✓ User ${user.email} already exists`);
        continue;
      }
      
      // Sign in to create the user
      try {
        await signInWithEmailAndPassword(auth, user.email, user.password);
        console.log(`✓ User ${user.email} already exists in Auth, updating Firestore data`);
      } catch (authErr) {
        if (authErr.code === 'auth/user-not-found') {
          console.log(`✗ User ${user.email} doesn't exist and couldn't be created automatically`);
          console.log(`  Please create this user manually through the Firebase console`);
          continue;
        } else {
          throw authErr;
        }
      }
      
      // Get the user ID
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log(`✗ Failed to get current user for ${user.email}`);
        continue;
      }
      
      // Create user document in users collection
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        uid: currentUser.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      // Create role-specific document
      if (user.role === 'client') {
        const clientDocRef = doc(db, 'clients', currentUser.uid);
        await setDoc(clientDocRef, {
          uid: currentUser.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'client',
          createdAt: new Date(),
          lastLogin: new Date()
        });
      } else if (user.role === 'organizer') {
        const organizerDocRef = doc(db, 'organizers', currentUser.uid);
        await setDoc(organizerDocRef, {
          uid: currentUser.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'organizer',
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }
      
      console.log(`✓ Created/updated user ${user.email} with role ${user.role}`);
    } catch (err) {
      console.error(`Error creating/updating user ${user.email}:`, err.message);
    }
  }
}

async function runTests() {
  try {
    // First create test users if they don't exist
    await createTestUsers();
    
    // Test client login
    const clientResult = await testClientLogin('testclient@example.com', 'testpassword123');
    console.log(`Client login test ${clientResult ? 'PASSED' : 'FAILED'}`);
    
    // Test organizer login
    const organizerResult = await testOrganizerLogin('testorganizer@example.com', 'testpassword123');
    console.log(`Organizer login test ${organizerResult ? 'PASSED' : 'FAILED'}`);
    
    // Test client trying to access organizer portal
    console.log("\n--- Testing Client Access to Organizer Portal ---");
    try {
      await testOrganizerLogin('testclient@example.com', 'testpassword123');
      console.log("✗ Client was able to access organizer portal!");
    } catch (err) {
      console.log("✓ Client was correctly denied access to organizer portal");
    }
    
    // Test organizer trying to access client portal
    console.log("\n--- Testing Organizer Access to Client Portal ---");
    try {
      await testClientLogin('testorganizer@example.com', 'testpassword123');
      console.log("✗ Organizer was able to access client portal!");
    } catch (err) {
      console.log("✓ Organizer was correctly denied access to client portal");
    }
    
    console.log("\nAll tests completed!");
  } catch (err) {
    console.error("Error running tests:", err);
  } finally {
    // Sign out after all tests
    await auth.signOut();
    console.log("Signed out");
    process.exit(0);
  }
}

// Run the tests
runTests();
