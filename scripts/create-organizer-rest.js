#!/usr/bin/env node

/**
 * Script to create an organizer account using Firebase REST API
 * 
 * This script uses the Firebase Auth REST API to create a user
 * and then uses the Firebase CLI to access Firestore for creating documents.
 * 
 * Prerequisites:
 * 1. Firebase CLI installed: npm install -g firebase-tools
 * 2. Logged in to Firebase: firebase login
 * 3. Firebase project selected: firebase use [project-id]
 * 
 * Usage:
 * node create-organizer-rest.js
 */

const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const DEFAULT_EMAIL = 'organizer@riseretreat.com';
const DEFAULT_PASSWORD = 'TemporaryPassword123!';
const DEFAULT_DISPLAY_NAME = 'Organisateur RISE';
const DEFAULT_ROLE = 'organizer';

// Prompt for user input
function prompt(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`${question} (${defaultValue}): `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

// Execute shell command and return promise
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`Warning: ${stderr}`);
      }
      console.log(`Output: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Make an HTTPS request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Check if Firebase CLI is installed
async function checkFirebaseCLI() {
  try {
    await executeCommand('firebase --version');
    return true;
  } catch (error) {
    console.error('Firebase CLI is not installed. Please install it with: npm install -g firebase-tools');
    return false;
  }
}

// Check if user is logged in to Firebase
async function checkFirebaseLogin() {
  try {
    const result = await executeCommand('firebase projects:list');
    return !result.includes('Error:') && !result.includes('not logged in');
  } catch (error) {
    console.error('Not logged in to Firebase. Please run: firebase login');
    return false;
  }
}

// Get Firebase project ID
async function getFirebaseProjectId() {
  try {
    const projectListOutput = await executeCommand('firebase projects:list');
    
    // Parse the project list output to extract project IDs
    const projectRegex = /│\s+(.+?)\s+│\s+(.+?)\s+│/g;
    const projects = [];
    let match;
    
    while ((match = projectRegex.exec(projectListOutput)) !== null) {
      if (match[1] && match[1].trim() && match[2] && match[2].trim()) {
        projects.push({
          name: match[1].trim(),
          id: match[2].trim()
        });
      }
    }
    
    if (projects.length === 0) {
      throw new Error('No Firebase projects found');
    }
    
    // If there's only one project, use it
    if (projects.length === 1) {
      console.log(`Using the only available Firebase project: ${projects[0].name} (${projects[0].id})`);
      return projects[0].id;
    }
    
    // Display the list of projects and ask the user to choose one
    console.log('\nAvailable Firebase projects:');
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} (${project.id})`);
    });
    
    const selection = await prompt('Enter the number of the project to use', '1');
    const selectedIndex = parseInt(selection, 10) - 1;
    
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= projects.length) {
      throw new Error('Invalid project selection');
    }
    
    return projects[selectedIndex].id;
  } catch (error) {
    console.error('Error getting Firebase project ID:', error);
    throw error;
  }
}

// Get Firebase Web API Key
async function getFirebaseWebApiKey() {
  try {
    // Try to read from .env.local file first
    try {
      const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
      const apiKeyMatch = envContent.match(/NEXT_PUBLIC_FIREBASE_API_KEY=(.+)/);
      
      if (apiKeyMatch && apiKeyMatch[1]) {
        return apiKeyMatch[1].trim();
      }
    } catch (readError) {
      console.log('Could not read API key from .env.local');
    }
    
    // Try to read from firebase.ts file
    try {
      const firebaseConfigFile = fs.readFileSync(
        path.join(__dirname, '..', 'lib', 'firebase.ts'),
        'utf8'
      );
      
      const apiKeyMatch = firebaseConfigFile.match(/apiKey: ["'](.+?)["']/);
      
      if (apiKeyMatch && apiKeyMatch[1]) {
        return apiKeyMatch[1].trim();
      }
    } catch (readError) {
      console.log('Could not read API key from firebase.ts');
    }
    
    // If we couldn't find the API key, ask the user
    return await prompt('Enter your Firebase Web API Key (found in Firebase Console > Project Settings > General > Your Apps > Web App)', '');
  } catch (error) {
    console.error('Error getting Firebase Web API Key:', error);
    throw error;
  }
}

// Create a user using Firebase Auth REST API
async function createFirebaseAuthUser(email, password, displayName, apiKey) {
  try {
    console.log(`Creating user: ${email}`);
    
    const options = {
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/accounts:signUp?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const data = {
      email: email,
      password: password,
      displayName: displayName,
      returnSecureToken: true
    };
    
    const response = await makeRequest(options, data);
    
    if (response.statusCode === 200) {
      console.log(`Created user with UID: ${response.data.localId}`);
      return {
        uid: response.data.localId,
        idToken: response.data.idToken
      };
    } else {
      // Check if user already exists
      if (response.data.error && response.data.error.message === 'EMAIL_EXISTS') {
        console.log(`User with email ${email} already exists. Attempting to sign in...`);
        
        // Try to sign in
        const signInOptions = {
          hostname: 'identitytoolkit.googleapis.com',
          path: `/v1/accounts:signInWithPassword?key=${apiKey}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        const signInData = {
          email: email,
          password: password,
          returnSecureToken: true
        };
        
        const signInResponse = await makeRequest(signInOptions, signInData);
        
        if (signInResponse.statusCode === 200) {
          console.log(`Signed in as existing user with UID: ${signInResponse.data.localId}`);
          return {
            uid: signInResponse.data.localId,
            idToken: signInResponse.data.idToken
          };
        } else {
          throw new Error(`Failed to sign in as existing user: ${JSON.stringify(signInResponse.data)}`);
        }
      } else {
        throw new Error(`Failed to create user: ${JSON.stringify(response.data)}`);
      }
    }
  } catch (error) {
    console.error('Error creating Firebase Auth user:', error);
    throw error;
  }
}

// Create Firestore documents using Firebase Admin SDK via a temporary file
async function createFirestoreDocuments(uid, email, displayName, role, projectId) {
  try {
    console.log(`Creating Firestore documents for user ${uid}...`);
    
    // Create a temporary file with Firestore operations
    const tempFile = path.join(__dirname, 'temp-firestore-ops.js');
    
    const code = `
const admin = require('firebase-admin');

// Initialize Firebase Admin with application default credentials
admin.initializeApp({
  projectId: '${projectId}'
});

const db = admin.firestore();

async function createDocuments() {
  try {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    const userData = {
      uid: '${uid}',
      email: '${email}',
      displayName: '${displayName}',
      role: '${role}',
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Create document in users collection
    await db.collection('users').doc('${uid}').set(userData);
    console.log('Created user document in users collection');
    
    // Create document in organizers collection
    await db.collection('organizers').doc('${uid}').set(userData);
    console.log('Created user document in organizers collection');
    
    console.log('Firestore documents created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating Firestore documents:', error);
    process.exit(1);
  }
}

createDocuments();
`;
    
    fs.writeFileSync(tempFile, code);
    
    // Install Firebase Admin SDK if needed
    await executeCommand('npm list firebase-admin || npm install --no-save firebase-admin');
    
    // Run the script with application default credentials
    await executeCommand(`GOOGLE_APPLICATION_CREDENTIALS=~/.config/firebase/application_default_credentials.json node ${tempFile}`);
    
    // Clean up
    fs.unlinkSync(tempFile);
    
    return true;
  } catch (error) {
    console.error('Error creating Firestore documents:', error);
    
    // Try alternative approach using Firebase CLI
    console.log('Trying alternative approach using Firebase CLI...');
    
    try {
      // Create JSON files for Firestore import
      const timestamp = new Date().toISOString();
      
      const userData = {
        uid: uid,
        email: email,
        displayName: displayName,
        role: role,
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      // Create a temporary directory for Firestore data
      const tempDir = path.join(__dirname, 'temp-firestore-data');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Create users collection directory
      const usersDir = path.join(tempDir, 'users');
      if (!fs.existsSync(usersDir)) {
        fs.mkdirSync(usersDir, { recursive: true });
      }
      
      // Create organizers collection directory
      const organizersDir = path.join(tempDir, 'organizers');
      if (!fs.existsSync(organizersDir)) {
        fs.mkdirSync(organizersDir, { recursive: true });
      }
      
      // Write user data to files
      fs.writeFileSync(path.join(usersDir, `${uid}.json`), JSON.stringify(userData, null, 2));
      fs.writeFileSync(path.join(organizersDir, `${uid}.json`), JSON.stringify(userData, null, 2));
      
      // Use Firebase CLI to set documents
      await executeCommand(`firebase firestore:set --project=${projectId} /users/${uid} --data-file=${path.join(usersDir, `${uid}.json`)}`);
      await executeCommand(`firebase firestore:set --project=${projectId} /organizers/${uid} --data-file=${path.join(organizersDir, `${uid}.json`)}`);
      
      // Clean up
      fs.rmdirSync(tempDir, { recursive: true });
      
      return true;
    } catch (cliError) {
      console.error('Error using Firebase CLI for Firestore:', cliError);
      throw error;
    }
  }
}

// Main function
async function main() {
  try {
    console.log('=== R.I.S.E. Retreat Organizer Account Setup (REST API Version) ===');
    
    // Check prerequisites
    const hasCLI = await checkFirebaseCLI();
    if (!hasCLI) {
      rl.close();
      return;
    }
    
    const isLoggedIn = await checkFirebaseLogin();
    if (!isLoggedIn) {
      rl.close();
      return;
    }
    
    // Get Firebase project ID
    const projectId = await getFirebaseProjectId();
    console.log(`Using Firebase project: ${projectId}`);
    
    // Get Firebase Web API Key
    const apiKey = await getFirebaseWebApiKey();
    if (!apiKey) {
      console.error('Firebase Web API Key is required to create users');
      rl.close();
      return;
    }
    
    // Get user input
    const email = await prompt('Enter organizer email', DEFAULT_EMAIL);
    const password = await prompt('Enter organizer password', DEFAULT_PASSWORD);
    const displayName = await prompt('Enter organizer display name', DEFAULT_DISPLAY_NAME);
    const role = await prompt('Enter organizer role (organizer/admin)', DEFAULT_ROLE);
    
    console.log('\nCreating organizer account with the following details:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Display Name: ${displayName}`);
    console.log(`Role: ${role}`);
    
    const confirm = await prompt('Proceed? (yes/no)', 'yes');
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Operation cancelled.');
      rl.close();
      return;
    }
    
    // Create Firebase Auth user
    const { uid } = await createFirebaseAuthUser(email, password, displayName, apiKey);
    
    if (uid) {
      // Create Firestore documents
      const success = await createFirestoreDocuments(uid, email, displayName, role, projectId);
      
      if (success) {
        console.log('\n✅ Organizer account created successfully!');
        console.log(`You can now log in with email: ${email} and password: ${password}`);
      } else {
        console.error('\n❌ Failed to create Firestore documents.');
      }
    } else {
      console.error('\n❌ Failed to create Firebase Auth user.');
    }
    
    rl.close();
  } catch (error) {
    console.error('Error in main function:', error);
    rl.close();
  }
}

// Run the script
main();
