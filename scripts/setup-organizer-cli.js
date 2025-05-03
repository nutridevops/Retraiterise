#!/usr/bin/env node

/**
 * Script to create an organizer account using Firebase CLI
 * 
 * Prerequisites:
 * 1. Firebase CLI installed: npm install -g firebase-tools
 * 2. Logged in to Firebase: firebase login
 * 3. Firebase project selected: firebase use [project-id]
 * 
 * Usage:
 * node setup-organizer-cli.js
 */

const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

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

// Create a temporary Firebase function to create the organizer
async function createOrganizerSetupFunction(email, password, displayName, role) {
  const functionDir = path.join(__dirname, 'temp-function');
  
  // Create temporary directory if it doesn't exist
  if (!fs.existsSync(functionDir)) {
    fs.mkdirSync(functionDir, { recursive: true });
  }
  
  // Create package.json
  const packageJson = {
    name: "organizer-setup-function",
    version: "1.0.0",
    description: "Temporary function to create organizer account",
    main: "index.js",
    dependencies: {
      "firebase-admin": "^11.0.0",
      "firebase-functions": "^4.0.0"
    }
  };
  
  fs.writeFileSync(
    path.join(functionDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create index.js with the function code
  const functionCode = `
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createOrganizer = functions.https.onRequest(async (req, res) => {
  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: '${email}',
      password: '${password}',
      displayName: '${displayName}'
    });
    
    console.log('Created user:', userRecord.uid);
    
    // Create timestamp
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    // User data
    const userData = {
      uid: userRecord.uid,
      email: '${email}',
      displayName: '${displayName}',
      role: '${role}',
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Create document in users collection
    await admin.firestore().collection('users').doc(userRecord.uid).set(userData);
    console.log('Created user document in users collection');
    
    // Create document in organizers collection
    await admin.firestore().collection('organizers').doc(userRecord.uid).set(userData);
    console.log('Created user document in organizers collection');
    
    res.status(200).send({
      success: true,
      message: 'Organizer account created successfully',
      uid: userRecord.uid
    });
  } catch (error) {
    console.error('Error creating organizer:', error);
    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});
  `;
  
  fs.writeFileSync(path.join(functionDir, 'index.js'), functionCode);
  
  return functionDir;
}

// Deploy the function
async function deployFunction(functionDir) {
  try {
    process.chdir(functionDir);
    await executeCommand('firebase deploy --only functions:createOrganizer');
    return true;
  } catch (error) {
    console.error('Error deploying function:', error);
    return false;
  }
}

// Call the function to create the organizer
async function callCreateOrganizerFunction(projectId) {
  try {
    const region = 'us-central1'; // Default Firebase Functions region
    const url = `https://${region}-${projectId}.cloudfunctions.net/createOrganizer`;
    
    console.log(`Calling function at: ${url}`);
    
    // Use curl to call the function
    await executeCommand(`curl -X POST ${url}`);
    return true;
  } catch (error) {
    console.error('Error calling function:', error);
    return false;
  }
}

// Clean up temporary function
async function cleanupFunction(functionDir, projectId) {
  try {
    process.chdir(functionDir);
    await executeCommand('firebase functions:delete createOrganizer --force');
    fs.rmdirSync(functionDir, { recursive: true });
    console.log('Temporary function cleaned up');
    return true;
  } catch (error) {
    console.error('Error cleaning up function:', error);
    return false;
  }
}

// Alternative: Create user directly using Firebase Admin SDK
async function createOrganizerDirectly(email, password, displayName, role) {
  // Create a temporary file with the Firebase Admin SDK code
  const tempFile = path.join(__dirname, 'temp-create-organizer.js');
  
  const code = `
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createOrganizer() {
  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: '${email}',
      password: '${password}',
      displayName: '${displayName}'
    });
    
    console.log('Created user:', userRecord.uid);
    
    // Create timestamp
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    // User data
    const userData = {
      uid: userRecord.uid,
      email: '${email}',
      displayName: '${displayName}',
      role: '${role}',
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Create document in users collection
    await admin.firestore().collection('users').doc(userRecord.uid).set(userData);
    console.log('Created user document in users collection');
    
    // Create document in organizers collection
    await admin.firestore().collection('organizers').doc(userRecord.uid).set(userData);
    console.log('Created user document in organizers collection');
    
    console.log('Organizer account created successfully!');
    console.log('Email:', '${email}');
    console.log('Password:', '${password}');
    console.log('UID:', userRecord.uid);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating organizer:', error);
    process.exit(1);
  }
}

createOrganizer();
  `;
  
  fs.writeFileSync(tempFile, code);
  
  try {
    // Check if serviceAccountKey.json exists
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    if (!fs.existsSync(serviceAccountPath)) {
      console.error('Service account key not found at:', serviceAccountPath);
      console.error('Please download your service account key from the Firebase console and save it as serviceAccountKey.json in the project root directory.');
      return false;
    }
    
    // Install Firebase Admin SDK if needed
    await executeCommand('npm install --no-save firebase-admin');
    
    // Run the script
    await executeCommand(`node ${tempFile}`);
    
    // Clean up
    fs.unlinkSync(tempFile);
    
    return true;
  } catch (error) {
    console.error('Error creating organizer directly:', error);
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('=== R.I.S.E. Retreat Organizer Account Setup ===');
    
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
    
    // Get project ID
    const projectListOutput = await executeCommand('firebase projects:list');
    const currentProject = projectListOutput.match(/\* (.+?) \(/);
    
    if (!currentProject) {
      console.error('No active Firebase project found. Please run: firebase use <project-id>');
      rl.close();
      return;
    }
    
    const projectId = currentProject[1];
    console.log(`Using Firebase project: ${projectId}`);
    
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
    
    // Check if serviceAccountKey.json exists for direct method
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      console.log('Service account key found. Using direct method...');
      const success = await createOrganizerDirectly(email, password, displayName, role);
      if (success) {
        console.log('\n✅ Organizer account created successfully!');
        console.log(`You can now log in with email: ${email} and password: ${password}`);
      } else {
        console.error('\n❌ Failed to create organizer account using direct method.');
      }
    } else {
      // Use Cloud Functions method
      console.log('No service account key found. Using Cloud Functions method...');
      
      // Create and deploy temporary function
      const functionDir = await createOrganizerSetupFunction(email, password, displayName, role);
      const deployed = await deployFunction(functionDir);
      
      if (deployed) {
        // Call the function
        const success = await callCreateOrganizerFunction(projectId);
        
        // Clean up
        await cleanupFunction(functionDir, projectId);
        
        if (success) {
          console.log('\n✅ Organizer account created successfully!');
          console.log(`You can now log in with email: ${email} and password: ${password}`);
        } else {
          console.error('\n❌ Failed to create organizer account.');
        }
      } else {
        console.error('\n❌ Failed to deploy function.');
      }
    }
    
    rl.close();
  } catch (error) {
    console.error('Error in main function:', error);
    rl.close();
  }
}

// Run the script
main();
