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
import { db } from './firebase';
import { useAuth } from './auth';
import { ORGANIZERS, SESSION_TYPES } from './constants';

// Define booking status types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Define organizer interface
export interface Organizer {
  id: string;
  name: string;
  title: string;
  email: string;
  imageUrl: string;
}

// Define organizer availability interface
export interface OrganizerAvailability {
  id?: string;
  organizerId: string;
  dayOfWeek: string; // 0-6, where 0 is Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  sessionDuration: number; // Duration in minutes
}

// Define session type interface
export interface SessionType {
  id?: string;
  name: string;
  description: string;
  duration: number; // Duration in minutes
  price?: number;
  organizerId: string;
  isActive?: boolean;
}

// Define time slot interface
export interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

// Define booking interface
export interface Booking {
  id?: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  organizerId: string;
  organizerName: string;
  sessionType: string;
  date: Timestamp | Date;
  startTime: string;
  endTime: string;
  notes?: string;
  status: BookingStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Get all organizers
export async function getOrganizers(): Promise<Organizer[]> {
  // Return the predefined organizers from constants
  return ORGANIZERS;
}

// Get organizer by ID
export async function getOrganizerById(organizerId: string): Promise<Organizer | null> {
  const organizer = ORGANIZERS.find(org => org.id === organizerId);
  return organizer || null;
}

// Get organizer availability
export async function getOrganizerAvailability(organizerId: string): Promise<OrganizerAvailability[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const q = query(
      collection(db, 'availability'),
      where('organizerId', '==', organizerId),
      orderBy('dayOfWeek', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const availability: OrganizerAvailability[] = [];
    
    querySnapshot.forEach((doc) => {
      availability.push({ id: doc.id, ...doc.data() } as OrganizerAvailability);
    });
    
    return availability;
  } catch (error) {
    console.error('Error getting organizer availability:', error);
    throw error;
  }
}

// Get session types
export async function getSessionTypes(): Promise<SessionType[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // First check if there are custom session types in the database
    const q = query(collection(db, 'sessionTypes'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // If there are custom session types, return those
      const sessionTypes: SessionType[] = [];
      querySnapshot.forEach((doc) => {
        sessionTypes.push({ id: doc.id, ...doc.data() } as SessionType);
      });
      return sessionTypes;
    } else {
      // If no custom session types, return the predefined ones
      return SESSION_TYPES;
    }
  } catch (error) {
    console.error('Error getting session types:', error);
    // Fallback to predefined session types
    return SESSION_TYPES;
  }
}

// Get available time slots for a specific date and organizer
export async function getAvailableTimeSlots(
  organizerId: string,
  date: Date
): Promise<TimeSlot[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    // Get organizer's availability for the day of the week
    const dayOfWeek = date.getDay().toString(); // 0-6 (Sunday-Saturday)
    const availabilityQuery = query(
      collection(db, 'availability'),
      where('organizerId', '==', organizerId),
      where('dayOfWeek', '==', dayOfWeek),
      where('isAvailable', '==', true)
    );
    
    const availabilitySnapshot = await getDocs(availabilityQuery);
    
    if (availabilitySnapshot.empty) {
      return []; // No availability for this day
    }
    
    // Get all availabilities for this day
    const availabilities: OrganizerAvailability[] = [];
    availabilitySnapshot.forEach((doc) => {
      availabilities.push({ id: doc.id, ...doc.data() } as OrganizerAvailability);
    });
    
    // Get existing bookings for this date and organizer
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('organizerId', '==', organizerId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookings: Booking[] = [];
    
    bookingsSnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({ 
        id: doc.id, 
        ...data,
        date: data.date as Timestamp
      } as Booking);
    });
    
    // Generate available time slots based on availability and existing bookings
    const timeSlots: TimeSlot[] = [];
    
    for (const availability of availabilities) {
      const { startTime, endTime, sessionDuration } = availability;
      
      // Parse start and end times
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      // Generate time slots
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (
        currentHour < endHour || 
        (currentHour === endHour && currentMinute + sessionDuration <= endMinute)
      ) {
        const slotStartTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        // Calculate end time
        let endTimeHour = currentHour;
        let endTimeMinute = currentMinute + sessionDuration;
        
        if (endTimeMinute >= 60) {
          endTimeHour += Math.floor(endTimeMinute / 60);
          endTimeMinute = endTimeMinute % 60;
        }
        
        const slotEndTime = `${endTimeHour.toString().padStart(2, '0')}:${endTimeMinute.toString().padStart(2, '0')}`;
        
        // Check if this slot overlaps with any existing booking
        const isSlotAvailable = !bookings.some(booking => {
          const bookingStart = booking.startTime;
          const bookingEnd = booking.endTime;
          
          // Check for overlap
          return (
            (slotStartTime >= bookingStart && slotStartTime < bookingEnd) ||
            (slotEndTime > bookingStart && slotEndTime <= bookingEnd) ||
            (slotStartTime <= bookingStart && slotEndTime >= bookingEnd)
          );
        });
        
        if (isSlotAvailable) {
          timeSlots.push({
            startTime: slotStartTime,
            endTime: slotEndTime
          });
        }
        
        // Move to next slot
        currentMinute += sessionDuration;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
    }
    
    return timeSlots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    throw error;
  }
}

// Create a new booking
export async function createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Get the created booking
    const docSnap = await getDoc(bookingRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Booking;
    } else {
      throw new Error('Failed to create booking');
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Update a booking
export async function updateBooking(bookingId: string, bookingData: Partial<Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Booking> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    await updateDoc(bookingRef, {
      ...bookingData,
      updatedAt: serverTimestamp()
    });
    
    // Get the updated booking
    const docSnap = await getDoc(bookingRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Booking;
    } else {
      throw new Error('Booking not found after update');
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

// Cancel a booking
export async function cancelBooking(bookingId: string): Promise<boolean> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    await updateDoc(bookingRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}

// Get client bookings
export async function getClientBookings(clientId: string): Promise<Booking[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const q = query(
      collection(db, 'bookings'),
      where('clientId', '==', clientId),
      orderBy('date', 'desc')
    );
    
    try {
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
      });
      
      return bookings;
    } catch (error: any) {
      // Check if the error is related to missing index
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.error('Firestore index error:', error.message);
        
        // Fallback: Get bookings without ordering
        const fallbackQuery = query(
          collection(db, 'bookings'),
          where('clientId', '==', clientId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const bookings: Booking[] = [];
        
        fallbackSnapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() } as Booking);
        });
        
        // Sort manually
        return bookings.sort((a, b) => {
          const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
          const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime(); // descending order
        });
      }
      
      // Re-throw other errors
      throw error;
    }
  } catch (error) {
    console.error('Error getting client bookings:', error);
    throw error;
  }
}

// Get organizer bookings
export async function getOrganizerBookings(organizerId: string): Promise<Booking[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const q = query(
      collection(db, 'bookings'),
      where('organizerId', '==', organizerId),
      orderBy('date', 'desc')
    );
    
    try {
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
      });
      
      return bookings;
    } catch (error: any) {
      // Check if the error is related to missing index
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.error('Firestore index error:', error.message);
        
        // Fallback: Get bookings without ordering
        const fallbackQuery = query(
          collection(db, 'bookings'),
          where('organizerId', '==', organizerId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const bookings: Booking[] = [];
        
        fallbackSnapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() } as Booking);
        });
        
        // Sort manually
        return bookings.sort((a, b) => {
          const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
          const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime(); // descending order
        });
      }
      
      // Re-throw other errors
      throw error;
    }
  } catch (error) {
    console.error('Error getting organizer bookings:', error);
    throw error;
  }
}

// Get upcoming bookings for a client
export async function getUpcomingClientBookings(clientId: string): Promise<Booking[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const now = new Date();
    
    const q = query(
      collection(db, 'bookings'),
      where('clientId', '==', clientId),
      where('date', '>=', Timestamp.fromDate(now)),
      where('status', 'in', ['pending', 'confirmed']),
      orderBy('date', 'asc')
    );
    
    try {
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
      });
      
      return bookings;
    } catch (error: any) {
      // Check if the error is related to missing index
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.error('Firestore index error:', error.message);
        
        // Fallback: Get all bookings for the client without complex filtering
        const fallbackQuery = query(
          collection(db, 'bookings'),
          where('clientId', '==', clientId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const allBookings: Booking[] = [];
        
        fallbackSnapshot.forEach((doc) => {
          allBookings.push({ id: doc.id, ...doc.data() } as Booking);
        });
        
        // Filter and sort manually
        const nowTime = now.getTime();
        return allBookings
          .filter(booking => {
            // Filter by date and status
            const bookingDate = booking.date instanceof Timestamp 
              ? booking.date.toDate() 
              : new Date(booking.date);
            
            return bookingDate.getTime() >= nowTime && 
                  (booking.status === 'pending' || booking.status === 'confirmed');
          })
          .sort((a, b) => {
            // Sort by date ascending
            const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
            const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });
      }
      
      // Re-throw other errors
      throw error;
    }
  } catch (error) {
    console.error('Error getting upcoming client bookings:', error);
    throw error;
  }
}

// Get upcoming bookings for an organizer
export async function getUpcomingOrganizerBookings(organizerId: string): Promise<Booking[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const now = new Date();
    
    const q = query(
      collection(db, 'bookings'),
      where('organizerId', '==', organizerId),
      where('date', '>=', Timestamp.fromDate(now)),
      where('status', 'in', ['pending', 'confirmed']),
      orderBy('date', 'asc')
    );
    
    try {
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
      });
      
      return bookings;
    } catch (error: any) {
      // Check if the error is related to missing index
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.error('Firestore index error:', error.message);
        
        // Fallback: Get all bookings for the organizer without complex filtering
        const fallbackQuery = query(
          collection(db, 'bookings'),
          where('organizerId', '==', organizerId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const allBookings: Booking[] = [];
        
        fallbackSnapshot.forEach((doc) => {
          allBookings.push({ id: doc.id, ...doc.data() } as Booking);
        });
        
        // Filter and sort manually
        const nowTime = now.getTime();
        return allBookings
          .filter(booking => {
            // Filter by date and status
            const bookingDate = booking.date instanceof Timestamp 
              ? booking.date.toDate() 
              : new Date(booking.date);
            
            return bookingDate.getTime() >= nowTime && 
                  (booking.status === 'pending' || booking.status === 'confirmed');
          })
          .sort((a, b) => {
            // Sort by date ascending
            const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
            const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });
      }
      
      // Re-throw other errors
      throw error;
    }
  } catch (error) {
    console.error('Error getting upcoming organizer bookings:', error);
    throw error;
  }
}
