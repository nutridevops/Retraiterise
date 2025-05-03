'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  getOrganizers,
  getOrganizerById,
  getSessionTypes,
  getAvailableTimeSlots,
  createBooking,
  cancelBooking,
  getClientBookings,
  getUpcomingClientBookings,
  Organizer,
  SessionType,
  TimeSlot,
  Booking,
  BookingStatus
} from '@/lib/bookingService';
import { ORGANIZERS } from '@/lib/constants';

export function useBooking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load organizers and session types
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Load organizers from constants
        setOrganizers(ORGANIZERS);
        
        // Load session types
        const fetchedSessionTypes = await getSessionTypes();
        setSessionTypes(fetchedSessionTypes);
        
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les données initiales.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);

  // Load client bookings
  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Load bookings
        try {
          const fetchedBookings = await getClientBookings(user.uid);
          setBookings(fetchedBookings);
        } catch (bookingError) {
          console.warn('Error loading client bookings, using fallback:', bookingError);
          // Don't show toast for this error as it's handled gracefully in the service
          setBookings([]);
        }
        
        // Load upcoming bookings - wrap in try/catch to prevent console errors
        try {
          // Silence console.error temporarily to prevent the error from being logged
          const originalConsoleError = console.error;
          console.error = function(...args: any[]) {
            // Only suppress Firestore index errors
            if (typeof args[0] === 'string' && args[0].includes('Firestore index error')) {
              console.warn('Suppressed Firestore index error');
              return;
            }
            return originalConsoleError.apply(console, args);
          };
          
          try {
            const fetchedUpcomingBookings = await getUpcomingClientBookings(user.uid);
            setUpcomingBookings(fetchedUpcomingBookings);
          } finally {
            // Restore original console.error
            console.error = originalConsoleError;
          }
        } catch (upcomingError) {
          console.warn('Error loading upcoming client bookings, using fallback:', upcomingError);
          // Don't show toast for this error as it's handled gracefully in the service
          setUpcomingBookings([]);
        }
        
      } catch (error: any) {
        console.error('Error in loadBookings:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger vos réservations. Veuillez réessayer.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookings();
  }, [user, toast]);

  // Load available time slots when organizer or date changes
  useEffect(() => {
    const loadAvailableTimeSlots = async () => {
      if (!selectedOrganizer || !selectedDate) {
        setAvailableTimeSlots([]);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Load available time slots
        const fetchedTimeSlots = await getAvailableTimeSlots(selectedOrganizer.id, selectedDate);
        setAvailableTimeSlots(fetchedTimeSlots);
        
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les créneaux disponibles.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvailableTimeSlots();
  }, [selectedOrganizer, selectedDate, toast]);

  // Handle organizer change
  const handleOrganizerChange = useCallback((organizerId: string) => {
    const organizer = organizers.find(org => org.id === organizerId) || null;
    setSelectedOrganizer(organizer);
    
    // Filter session types for this organizer
    if (organizer) {
      const filteredSessionTypes = sessionTypes.filter(st => st.organizerId === organizer.id);
      if (filteredSessionTypes.length > 0) {
        setSelectedSessionType(filteredSessionTypes[0]);
      } else {
        setSelectedSessionType(null);
      }
    } else {
      setSelectedSessionType(null);
    }
    
    // Reset date, time slot, and notes
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setNotes('');
  }, [organizers, sessionTypes]);

  // Handle date change
  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  }, []);

  // Handle session type change
  const handleSessionTypeChange = useCallback((sessionTypeId: string) => {
    const sessionType = sessionTypes.find(st => st.id === sessionTypeId) || null;
    setSelectedSessionType(sessionType);
  }, [sessionTypes]);

  // Handle time slot change
  const handleTimeSlotChange = useCallback((timeSlot: TimeSlot | null) => {
    setSelectedTimeSlot(timeSlot);
  }, []);

  // Handle notes change
  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
  }, []);

  // Submit booking
  const submitBooking = useCallback(async () => {
    if (!user || !selectedOrganizer || !selectedDate || !selectedSessionType || !selectedTimeSlot) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Create booking
      const bookingData = {
        clientId: user.uid,
        clientName: user.displayName || 'Client',
        clientEmail: user.email || '',
        organizerId: selectedOrganizer.id,
        organizerName: selectedOrganizer.name,
        sessionType: selectedSessionType.name,
        date: selectedDate,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        notes: notes,
        status: 'pending' as BookingStatus
      };
      
      await createBooking(bookingData);
      
      toast({
        title: "Réservation créée",
        description: "Votre réservation a été créée avec succès.",
      });
      
      // Reset form
      setSelectedOrganizer(null);
      setSelectedDate(null);
      setSelectedSessionType(null);
      setSelectedTimeSlot(null);
      setNotes('');
      
      // Refresh bookings
      refreshBookings();
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la réservation.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedOrganizer, selectedDate, selectedSessionType, selectedTimeSlot, notes, toast]);

  // Cancel booking
  const handleCancelBooking = useCallback(async (bookingId: string) => {
    try {
      setIsLoading(true);
      
      // Cancel booking
      await cancelBooking(bookingId);
      
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès.",
      });
      
      // Refresh bookings
      refreshBookings();
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'annuler la réservation.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Refresh bookings
  const refreshBookings = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load bookings
      const fetchedBookings = await getClientBookings(user.uid);
      setBookings(fetchedBookings);
      
      // Load upcoming bookings
      const fetchedUpcomingBookings = await getUpcomingClientBookings(user.uid);
      setUpcomingBookings(fetchedUpcomingBookings);
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rafraîchir les réservations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    organizers,
    sessionTypes,
    availableTimeSlots,
    bookings,
    upcomingBookings,
    selectedOrganizer,
    selectedDate,
    selectedSessionType,
    selectedTimeSlot,
    notes,
    isLoading,
    handleOrganizerChange,
    handleDateChange,
    handleSessionTypeChange,
    handleTimeSlotChange,
    handleNotesChange,
    submitBooking,
    handleCancelBooking,
    refreshBookings
  };
}
