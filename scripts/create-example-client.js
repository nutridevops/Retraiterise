// Script to create an example client with sample data
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp 
} = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

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
const storage = getStorage(app);

async function createExampleClient() {
  try {
    console.log('Creating example client...');
    
    // Create a client document with a custom ID
    const clientId = 'example-client-123';
    const clientRef = doc(db, 'users', clientId);
    
    // Client data
    const clientData = {
      displayName: 'Sophie Martin',
      email: 'sophie.martin@example.com',
      role: 'client',
      phone: '+33 6 12 34 56 78',
      address: '15 Rue de la Paix, 75002 Paris, France',
      bio: 'Professionnelle de 35 ans cherchant à améliorer son équilibre vie professionnelle/personnelle. Intéressée par la méditation et les pratiques de pleine conscience.',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/42.jpg',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add the client to Firestore
    await setDoc(clientRef, clientData);
    console.log(`Created client: ${clientData.displayName} (${clientId})`);
    
    // Create sample notes
    const notes = [
      {
        clientId,
        content: 'Premier rendez-vous très positif. Sophie est motivée et a des objectifs clairs pour sa retraite.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        createdBy: 'organizer-123',
        createdByName: 'Jean Dupont'
      },
      {
        clientId,
        content: 'A exprimé un intérêt particulier pour les ateliers de méditation et de yoga. À suivre pour les prochaines sessions.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        createdBy: 'organizer-123',
        createdByName: 'Jean Dupont'
      },
      {
        clientId,
        content: 'Sophie a mentionné des difficultés à maintenir sa pratique quotidienne. Lui proposer des exercices plus courts mais réguliers.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        createdBy: 'organizer-123',
        createdByName: 'Jean Dupont'
      }
    ];
    
    // Add notes to Firestore
    for (const note of notes) {
      await addDoc(collection(db, 'notes'), note);
    }
    console.log(`Added ${notes.length} notes for the client`);
    
    // Create sample messages
    const messages = [
      {
        content: 'Bonjour Sophie, bienvenue chez R.I.S.E. Retreat ! Comment puis-je vous aider aujourd\'hui ?',
        senderId: 'organizer-123',
        senderName: 'Jean Dupont',
        receiverId: clientId,
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        read: true,
        participants: ['organizer-123', clientId]
      },
      {
        content: 'Bonjour Jean, merci pour votre accueil ! J\'aimerais en savoir plus sur les prochains ateliers de méditation.',
        senderId: clientId,
        senderName: 'Sophie Martin',
        receiverId: 'organizer-123',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 10 days ago + 1 hour
        read: true,
        participants: ['organizer-123', clientId]
      },
      {
        content: 'Bien sûr ! Nous avons un atelier de méditation pleine conscience ce samedi à 10h. Seriez-vous intéressée ?',
        senderId: 'organizer-123',
        senderName: 'Jean Dupont',
        receiverId: clientId,
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        read: true,
        participants: ['organizer-123', clientId]
      },
      {
        content: 'Oui, ça me semble parfait ! Je vais m\'inscrire tout de suite.',
        senderId: clientId,
        senderName: 'Sophie Martin',
        receiverId: 'organizer-123',
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 9 days ago + 2 hours
        read: true,
        participants: ['organizer-123', clientId]
      },
      {
        content: 'Avez-vous des recommandations de lectures sur la méditation que je pourrais consulter avant l\'atelier ?',
        senderId: clientId,
        senderName: 'Sophie Martin',
        receiverId: 'organizer-123',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        read: true,
        participants: ['organizer-123', clientId]
      }
    ];
    
    // Add messages to Firestore
    for (const message of messages) {
      await addDoc(collection(db, 'messages'), message);
    }
    console.log(`Added ${messages.length} messages for the client`);
    
    // Create sample files metadata (without actual file upload)
    const files = [
      {
        clientId,
        name: 'Programme_Meditation_Debutant.pdf',
        url: 'https://firebasestorage.googleapis.com/example/Programme_Meditation_Debutant.pdf',
        type: 'application/pdf',
        size: 2500000, // 2.5 MB
        uploadedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        uploadedBy: 'organizer-123',
        uploadedByName: 'Jean Dupont'
      },
      {
        clientId,
        name: 'Exercices_Quotidiens.docx',
        url: 'https://firebasestorage.googleapis.com/example/Exercices_Quotidiens.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 1800000, // 1.8 MB
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        uploadedBy: 'organizer-123',
        uploadedByName: 'Jean Dupont'
      },
      {
        clientId,
        name: 'Calendrier_Ateliers_2025.xlsx',
        url: 'https://firebasestorage.googleapis.com/example/Calendrier_Ateliers_2025.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1200000, // 1.2 MB
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        uploadedBy: 'organizer-123',
        uploadedByName: 'Jean Dupont'
      }
    ];
    
    // Add files to Firestore
    for (const file of files) {
      await addDoc(collection(db, 'files'), file);
    }
    console.log(`Added ${files.length} file records for the client`);
    
    console.log('Example client created successfully!');
    console.log(`Client ID: ${clientId}`);
    console.log('You can now view this client in the organizer dashboard');
    
  } catch (error) {
    console.error('Error creating example client:', error);
  }
}

// Run the function
createExampleClient();
