'use client';

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  DocumentReference,
  DocumentData,
  limit,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid';

// Get messages for a user (both sent and received)
export async function getUserMessages(userId: string, limitCount = 20, startAfterDoc?: QueryDocumentSnapshot<DocumentData>) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // Create a query to get messages where the user is either sender or receiver
    let messagesQuery = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );
    
    // Add pagination if a start document is provided
    if (startAfterDoc) {
      messagesQuery = query(messagesQuery, startAfter(startAfterDoc), limit(limitCount));
    } else {
      messagesQuery = query(messagesQuery, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(messagesQuery);
    const messages: Message[] = [];
    let lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
    
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
      lastDoc = doc;
    });
    
    return { messages, lastDoc };
  } catch (error) {
    console.error('Error getting user messages:', error);
    throw error;
  }
}

// Get conversation between two users
export async function getConversation(userId1: string, userId2: string, limitCount = 20, startAfterDoc?: QueryDocumentSnapshot<DocumentData>) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // Create a query to get messages between these two users
    const participantsArray = [userId1, userId2].sort(); // Sort to ensure consistent array order
    
    let messagesQuery = query(
      collection(db, 'messages'),
      where('participants', '==', participantsArray),
      orderBy('createdAt', 'desc')
    );
    
    // Add pagination if a start document is provided
    if (startAfterDoc) {
      messagesQuery = query(messagesQuery, startAfter(startAfterDoc), limit(limitCount));
    } else {
      messagesQuery = query(messagesQuery, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(messagesQuery);
    const messages: Message[] = [];
    let lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
    
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
      lastDoc = doc;
    });
    
    return { messages, lastDoc };
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
}

// Send a new message
export async function sendMessage(
  senderId: string,
  receiverId: string,
  subject: string,
  content: string,
  attachments?: File[]
) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // Process attachments if any
    const attachmentData: { name: string; url: string }[] = [];
    
    if (attachments && attachments.length > 0 && storage) {
      for (const file of attachments) {
        // Create a unique filename
        const fileName = `${uuidv4()}_${file.name}`;
        
        // Create a storage reference
        const storageRef = ref(storage, `messages/${senderId}/${fileName}`);
        
        // Upload the file
        await uploadBytes(storageRef, file, {
          customMetadata: {
            senderId,
            receiverId
          }
        });
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        // Add to attachments array
        attachmentData.push({
          name: file.name,
          url: downloadURL
        });
      }
    }
    
    // Sort participants to ensure consistent array order for queries
    const participants = [senderId, receiverId].sort();
    
    // Create the message document
    const messageData = {
      senderId,
      receiverId,
      subject,
      content,
      read: false,
      createdAt: serverTimestamp(),
      participants, // Add participants array for easier querying
      attachments: attachmentData.length > 0 ? attachmentData : undefined
    };
    
    const messageRef = await addDoc(collection(db, 'messages'), messageData);
    
    // Get the created message
    const docSnap = await getDoc(messageRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Message;
    } else {
      throw new Error('Failed to create message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Mark a message as read
export async function markMessageAsRead(messageId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const messageRef = doc(db, 'messages', messageId);
    
    await updateDoc(messageRef, {
      read: true
    });
    
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}

// Delete a message
export async function deleteMessage(messageId: string, userId: string) {
  if (!db || !storage) throw new Error('Firebase services not initialized');
  
  try {
    // First get the message to check permissions and get attachment info
    const messageRef = doc(db, 'messages', messageId);
    const docSnap = await getDoc(messageRef);
    
    if (!docSnap.exists()) {
      throw new Error('Message not found');
    }
    
    const message = { id: docSnap.id, ...docSnap.data() } as Message;
    
    // Check if the user is the sender or receiver
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new Error('Not authorized to delete this message');
    }
    
    // Delete attachments if any
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        if (attachment.url && attachment.url.includes('firebasestorage.googleapis.com')) {
          try {
            // Extract the storage path from the URL
            const storageRef = ref(storage, attachment.url);
            await deleteObject(storageRef);
          } catch (storageError) {
            console.error('Error deleting attachment:', storageError);
            // Continue with message deletion even if attachment deletion fails
          }
        }
      }
    }
    
    // Delete the message document
    await deleteDoc(messageRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

// Get unread message count for a user
export async function getUnreadMessageCount(userId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const q = query(
      collection(db, 'messages'),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unread message count:', error);
    throw error;
  }
}

// Get all users for the organizer to message
export async function getAllUsers(organizerId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // Get all users except the current organizer
    const q = query(
      collection(db, 'users'),
      where('uid', '!=', organizerId)
    );
    
    const querySnapshot = await getDocs(q);
    const users: any[] = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}
