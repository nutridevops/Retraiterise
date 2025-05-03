// Script to create an example organizer user
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createExampleOrganizer() {
  try {
    console.log('Creating example organizer...');
    
    // Create an organizer document with a custom ID
    const organizerId = 'organizer-123';
    const organizerRef = doc(db, 'users', organizerId);
    
    // Organizer data
    const organizerData = {
      displayName: 'Jean Dupont',
      email: 'jean.dupont@rise-retreat.com',
      role: 'organizer',
      phone: '+33 6 98 76 54 32',
      bio: 'Coach professionnel avec 10 ans d\'expérience dans l\'accompagnement personnel et le bien-être.',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add the organizer to Firestore
    await setDoc(organizerRef, organizerData);
    console.log(`Created organizer: ${organizerData.displayName} (${organizerId})`);
    
    console.log('Example organizer created successfully!');
    console.log(`Organizer ID: ${organizerId}`);
    
  } catch (error) {
    console.error('Error creating example organizer:', error);
  }
}

// Run the function
createExampleOrganizer();
