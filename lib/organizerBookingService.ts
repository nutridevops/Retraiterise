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
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Booking, OrganizerAvailability, SessionType } from './bookingService';

// Set organizer availability
export async function setOrganizerAvailability(availability: Omit<OrganizerAvailability, 'id'>) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // Check if availability already exists for this day
    const q = query(
      collection(db, 'availability'),
      where('organizerId', '==', availability.organizerId),
      where('dayOfWeek', '==', availability.dayOfWeek)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing availability
      const availabilityDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'availability', availabilityDoc.id), {
        ...availability,
        updatedAt: serverTimestamp()
      });
      
      return { id: availabilityDoc.id, ...availability };
    } else {
      // Create new availability
      const availabilityRef = await addDoc(collection(db, 'availability'), {
        ...availability,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: availabilityRef.id, ...availability };
    }
  } catch (error) {
    console.error('Error setting organizer availability:', error);
    throw error;
  }
}

// Delete organizer availability
export async function deleteOrganizerAvailability(availabilityId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    await deleteDoc(doc(db, 'availability', availabilityId));
    return true;
  } catch (error) {
    console.error('Error deleting organizer availability:', error);
    throw error;
  }
}

// Create a session type
export async function createSessionType(sessionType: Omit<SessionType, 'id'>) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const sessionTypeRef = await addDoc(collection(db, 'sessionTypes'), {
      ...sessionType,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { id: sessionTypeRef.id, ...sessionType };
  } catch (error) {
    console.error('Error creating session type:', error);
    throw error;
  }
}

// Update a session type
export async function updateSessionType(sessionTypeId: string, sessionType: Partial<Omit<SessionType, 'id'>>) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    await updateDoc(doc(db, 'sessionTypes', sessionTypeId), {
      ...sessionType,
      updatedAt: serverTimestamp()
    });
    
    return { id: sessionTypeId, ...sessionType };
  } catch (error) {
    console.error('Error updating session type:', error);
    throw error;
  }
}

// Delete a session type
export async function deleteSessionType(sessionTypeId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    await deleteDoc(doc(db, 'sessionTypes', sessionTypeId));
    return true;
  } catch (error) {
    console.error('Error deleting session type:', error);
    throw error;
  }
}

// Confirm a booking
export async function confirmBooking(bookingId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'confirmed',
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error confirming booking:', error);
    throw error;
  }
}

// Complete a booking
export async function completeBooking(bookingId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'completed',
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error completing booking:', error);
    throw error;
  }
}

// Get today's bookings for an organizer
export async function getTodayBookings(organizerId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const q = query(
      collection(db, 'bookings'),
      where('organizerId', '==', organizerId),
      where('date', '>=', Timestamp.fromDate(today)),
      where('date', '<', Timestamp.fromDate(tomorrow)),
      where('status', 'in', ['pending', 'confirmed']),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() } as Booking);
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting today\'s bookings:', error);
    throw error;
  }
}

// Get weekly bookings for an organizer
export async function getWeeklyBookings(organizerId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const q = query(
      collection(db, 'bookings'),
      where('organizerId', '==', organizerId),
      where('date', '>=', Timestamp.fromDate(today)),
      where('date', '<', Timestamp.fromDate(nextWeek)),
      where('status', 'in', ['pending', 'confirmed']),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() } as Booking);
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting weekly bookings:', error);
    throw error;
  }
}

// Get all pending bookings for an organizer
export async function getPendingBookings(organizerId: string) {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const q = query(
      collection(db, 'bookings'),
      where('organizerId', '==', organizerId),
      where('status', '==', 'pending'),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() } as Booking);
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting pending bookings:', error);
    throw error;
  }
}
