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
  DocumentData
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Resource, ResourceType } from './types';
import { v4 as uuidv4 } from 'uuid';

// Get all resources for a client
export async function getClientResources(userId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // Query resources that are visible to all or specifically to this user
    const q = query(
      collection(db, 'resources'),
      where('visibleTo', 'in', ['all', [userId]]),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const resources: Resource[] = [];
    
    querySnapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() } as Resource);
    });
    
    return resources;
  } catch (error) {
    console.error('Error getting client resources:', error);
    throw error;
  }
}

// Get all resources (for organizers)
export async function getAllResources() {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const q = query(
      collection(db, 'resources'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const resources: Resource[] = [];
    
    querySnapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() } as Resource);
    });
    
    return resources;
  } catch (error) {
    console.error('Error getting all resources:', error);
    throw error;
  }
}

// Get a single resource by ID
export async function getResourceById(resourceId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const docRef = doc(db, 'resources', resourceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Resource;
    } else {
      throw new Error('Resource not found');
    }
  } catch (error) {
    console.error('Error getting resource:', error);
    throw error;
  }
}

// Upload a file to Firebase Storage
export async function uploadResourceFile(
  file: File, 
  resourceType: ResourceType,
  userId: string
) {
  if (!storage) throw new Error('Firebase Storage not initialized');
  
  try {
    // Create a unique filename
    const fileName = `${uuidv4()}_${file.name}`;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    // Determine the storage path based on resource type
    let storagePath = '';
    switch (resourceType) {
      case 'pdf':
        storagePath = `resources/pdfs/${fileName}`;
        break;
      case 'video':
        storagePath = `resources/videos/${fileName}`;
        break;
      case 'printable':
        storagePath = `resources/printables/${fileName}`;
        break;
      default:
        storagePath = `resources/other/${fileName}`;
    }
    
    // Create a storage reference
    const storageRef = ref(storage, storagePath);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return {
      url: downloadURL,
      fileName,
      storagePath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Create a new resource
export async function createResource(
  resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const resourceRef = await addDoc(collection(db, 'resources'), {
      ...resourceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId
    });
    
    // Get the created resource
    const docSnap = await getDoc(resourceRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Resource;
    } else {
      throw new Error('Failed to create resource');
    }
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
}

// Update an existing resource
export async function updateResource(
  resourceId: string,
  resourceData: Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>>
) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const resourceRef = doc(db, 'resources', resourceId);
    
    await updateDoc(resourceRef, {
      ...resourceData,
      updatedAt: serverTimestamp()
    });
    
    // Get the updated resource
    const docSnap = await getDoc(resourceRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Resource;
    } else {
      throw new Error('Resource not found after update');
    }
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
}

// Delete a resource
export async function deleteResource(resourceId: string) {
  if (!db || !storage) throw new Error('Firebase services not initialized');
  
  try {
    // First get the resource to get the storage path
    const resourceRef = doc(db, 'resources', resourceId);
    const docSnap = await getDoc(resourceRef);
    
    if (docSnap.exists()) {
      const resource = { id: docSnap.id, ...docSnap.data() } as Resource;
      
      // If this is a file stored in Firebase Storage (not an external link)
      if (resource.url && resource.url.includes('firebasestorage.googleapis.com')) {
        // Extract the storage path from the URL or use a stored path if available
        const storageRef = ref(storage, resource.url);
        
        try {
          // Delete the file from storage
          await deleteObject(storageRef);
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue with document deletion even if storage deletion fails
        }
      }
      
      // Delete the document from Firestore
      await deleteDoc(resourceRef);
      
      return true;
    } else {
      throw new Error('Resource not found');
    }
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
}

// Filter resources by type
export async function getResourcesByType(type: ResourceType, userId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const q = query(
      collection(db, 'resources'),
      where('type', '==', type),
      where('visibleTo', 'in', ['all', [userId]]),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const resources: Resource[] = [];
    
    querySnapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() } as Resource);
    });
    
    return resources;
  } catch (error) {
    console.error(`Error getting ${type} resources:`, error);
    throw error;
  }
}

// Search resources by title or description
export async function searchResources(searchTerm: string, userId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // Get all resources the user has access to
    const q = query(
      collection(db, 'resources'),
      where('visibleTo', 'in', ['all', [userId]]),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const resources: Resource[] = [];
    
    // Client-side filtering for search (Firestore doesn't support text search natively)
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Resource, 'id'>;
      const searchableText = `${data.title} ${data.description} ${data.tags?.join(' ') || ''}`.toLowerCase();
      
      if (searchableText.includes(searchTerm.toLowerCase())) {
        resources.push({ id: doc.id, ...data } as Resource);
      }
    });
    
    return resources;
  } catch (error) {
    console.error('Error searching resources:', error);
    throw error;
  }
}
