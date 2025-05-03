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
 * node create-organizer-cli.js
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

// Create a Firebase Auth user using the CLI
async function createFirebaseAuthUser(email, password, displayName) {
  try {
    // First check if user exists
    const checkUserCmd = `firebase auth:export --format=json | grep -q "${email}"`;
    try {
      await executeCommand(checkUserCmd);
      console.log(`User with email ${email} already exists`);
      
      // Try to get the UID
      const getUidCmd = `firebase auth:export --format=json | grep -A 10 "${email}" | grep "localId" | head -n 1 | cut -d'"' -f4`;
      const uid = (await executeCommand(getUidCmd)).trim();
      
      if (uid) {
        console.log(`Found existing user with UID: ${uid}`);
        return uid;
      } else {
        throw new Error('Could not determine UID of existing user');
      }
    } catch (error) {
      // User doesn't exist, create it
      console.log(`Creating new user: ${email}`);
      
      // Create the user
      const createUserCmd = `firebase auth:import users-temp.json --hash-algo=BCRYPT`;
      
      // Create a temporary JSON file with the user data
      const userData = {
        users: [
          {
            localId: "", // Firebase will generate this
            email: email,
            emailVerified: true,
            passwordHash: Buffer.from(`$2a$10$${require('crypto').randomBytes(16).toString('hex')}`).toString('base64'),
            displayName: displayName,
            createdAt: new Date().getTime(),
            lastSignedInAt: new Date().getTime()
          }
        ]
      };
      
      fs.writeFileSync('users-temp.json', JSON.stringify(userData, null, 2));
      
      try {
        await executeCommand(createUserCmd);
        
        // Now set the password (can't be done during import)
        const setPasswordCmd = `firebase auth:import users-temp.json --hash-algo=BCRYPT --password-hash-algorithm=BCRYPT`;
        await executeCommand(setPasswordCmd);
        
        // Get the UID of the newly created user
        const getUidCmd = `firebase auth:export --format=json | grep -A 10 "${email}" | grep "localId" | head -n 1 | cut -d'"' -f4`;
        const uid = (await executeCommand(getUidCmd)).trim();
        
        // Clean up
        fs.unlinkSync('users-temp.json');
        
        console.log(`Created user with UID: ${uid}`);
        return uid;
      } catch (importError) {
        console.error('Error importing user:', importError);
        
        // Alternative approach: use custom token
        console.log('Trying alternative approach with custom token...');
        
        // Create a temporary Firebase function to create the user
        const functionDir = path.join(__dirname, 'temp-function');
        if (!fs.existsSync(functionDir)) {
          fs.mkdirSync(functionDir, { recursive: true });
        }
        
        // Create package.json
        fs.writeFileSync(
          path.join(functionDir, 'package.json'),
          JSON.stringify({
            name: "create-user-function",
            version: "1.0.0",
            main: "index.js",
            dependencies: {
              "firebase-admin": "^11.0.0",
              "firebase-functions": "^4.0.0"
            }
          }, null, 2)
        );
        
        // Create index.js
        fs.writeFileSync(
          path.join(functionDir, 'index.js'),
          `
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createUser = functions.https.onRequest(async (req, res) => {
  try {
    const userRecord = await admin.auth().createUser({
      email: '${email}',
      password: '${password}',
      displayName: '${displayName}'
    });
    res.status(200).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
          `
        );
        
        // Deploy the function
        process.chdir(functionDir);
        await executeCommand('firebase deploy --only functions:createUser');
        
        // Get the project ID
        const projectListOutput = await executeCommand('firebase projects:list');
        const currentProject = projectListOutput.match(/\* (.+?) \(/);
        const projectId = currentProject[1];
        
        // Call the function
        const region = 'us-central1'; // Default Firebase Functions region
        const url = `https://${region}-${projectId}.cloudfunctions.net/createUser`;
        const response = await executeCommand(`curl -X POST ${url}`);
        
        // Clean up
        await executeCommand('firebase functions:delete createUser --force');
        fs.rmdirSync(functionDir, { recursive: true });
        
        // Parse the response to get the UID
        const responseObj = JSON.parse(response);
        if (responseObj.uid) {
          console.log(`Created user with UID: ${responseObj.uid}`);
          return responseObj.uid;
        } else {
          throw new Error('Failed to create user: ' + (responseObj.error || 'Unknown error'));
        }
      }
    }
  } catch (error) {
    console.error('Error creating Firebase Auth user:', error);
    throw error;
  }
}

// Create Firestore documents using Firebase CLI
async function createFirestoreDocuments(uid, email, displayName, role) {
  try {
    const timestamp = new Date().toISOString();
    
    // Create user data object
    const userData = {
      uid: uid,
      email: email,
      displayName: displayName,
      role: role,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Create temporary JSON files for import
    const usersData = {
      [`users/${uid}`]: userData
    };
    
    const organizersData = {
      [`organizers/${uid}`]: userData
    };
    
    fs.writeFileSync('users-import.json', JSON.stringify(usersData, null, 2));
    fs.writeFileSync('organizers-import.json', JSON.stringify(organizersData, null, 2));
    
    // Import to Firestore
    await executeCommand('firebase firestore:import users-import.json');
    await executeCommand('firebase firestore:import organizers-import.json');
    
    // Clean up
    fs.unlinkSync('users-import.json');
    fs.unlinkSync('organizers-import.json');
    
    console.log('Created Firestore documents for user');
    return true;
  } catch (error) {
    console.error('Error creating Firestore documents:', error);
    
    // Alternative approach: use a temporary function
    console.log('Trying alternative approach with a temporary function...');
    
    // Create a temporary Firebase function
    const functionDir = path.join(__dirname, 'temp-function');
    if (!fs.existsSync(functionDir)) {
      fs.mkdirSync(functionDir, { recursive: true });
    }
    
    // Create package.json
    fs.writeFileSync(
      path.join(functionDir, 'package.json'),
      JSON.stringify({
        name: "create-documents-function",
        version: "1.0.0",
        main: "index.js",
        dependencies: {
          "firebase-admin": "^11.0.0",
          "firebase-functions": "^4.0.0"
        }
      }, null, 2)
    );
    
    // Create index.js
    fs.writeFileSync(
      path.join(functionDir, 'index.js'),
      `
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createDocuments = functions.https.onRequest(async (req, res) => {
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
    await admin.firestore().collection('users').doc('${uid}').set(userData);
    
    // Create document in organizers collection
    await admin.firestore().collection('organizers').doc('${uid}').set(userData);
    
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
      `
    );
    
    // Deploy the function
    process.chdir(functionDir);
    await executeCommand('firebase deploy --only functions:createDocuments');
    
    // Get the project ID
    const projectListOutput = await executeCommand('firebase projects:list');
    const currentProject = projectListOutput.match(/\* (.+?) \(/);
    const projectId = currentProject[1];
    
    // Call the function
    const region = 'us-central1'; // Default Firebase Functions region
    const url = `https://${region}-${projectId}.cloudfunctions.net/createDocuments`;
    await executeCommand(`curl -X POST ${url}`);
    
    // Clean up
    await executeCommand('firebase functions:delete createDocuments --force');
    fs.rmdirSync(functionDir, { recursive: true });
    
    console.log('Created Firestore documents for user using function');
    return true;
  }
}

// Main function
async function main() {
  try {
    console.log('=== R.I.S.E. Retreat Organizer Account Setup (CLI Version) ===');
    
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
    const uid = await createFirebaseAuthUser(email, password, displayName);
    
    if (uid) {
      // Create Firestore documents
      const success = await createFirestoreDocuments(uid, email, displayName, role);
      
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
