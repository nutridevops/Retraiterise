'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  getSessionTypes,
  getOrganizerAvailability,
  getOrganizerBookings,
  getUpcomingOrganizerBookings,
  Booking,
  OrganizerAvailability,
  SessionType
} from '@/lib/bookingService';
import {
  setOrganizerAvailability,
  deleteOrganizerAvailability,
  createSessionType,
  updateSessionType,
  deleteSessionType,
  confirmBooking,
  completeBooking,
  getTodayBookings,
  getWeeklyBookings,
  getPendingBookings
} from '@/lib/organizerBookingService';

export function useOrganizerBooking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [availabilities, setAvailabilities] = useState<OrganizerAvailability[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [weeklyBookings, setWeeklyBookings] = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Load session types
        const fetchedSessionTypes = await getSessionTypes();
        setSessionTypes(fetchedSessionTypes);
        
        // Load organizer availabilities
        const fetchedAvailabilities = await getOrganizerAvailability(user.uid);
        setAvailabilities(fetchedAvailabilities);
        
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
  }, [user, toast]);

  // Load bookings data
  useEffect(() => {
    const loadBookingsData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Load all bookings data in parallel
        const [
          fetchedAllBookings,
          fetchedUpcomingBookings,
          fetchedTodayBookings,
          fetchedWeeklyBookings,
          fetchedPendingBookings
        ] = await Promise.all([
          getOrganizerBookings(user.uid),
          getUpcomingOrganizerBookings(user.uid),
          getTodayBookings(user.uid),
          getWeeklyBookings(user.uid),
          getPendingBookings(user.uid)
        ]);
        
        setAllBookings(fetchedAllBookings);
        setUpcomingBookings(fetchedUpcomingBookings);
        setTodayBookings(fetchedTodayBookings);
        setWeeklyBookings(fetchedWeeklyBookings);
        setPendingBookings(fetchedPendingBookings);
        
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les réservations.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookingsData();
  }, [user, toast]);

  // Set organizer availability
  const handleSetAvailability = useCallback(async (availability: Omit<OrganizerAvailability, 'id'>) => {
    if (!user) return null;
    
    try {
      setIsLoading(true);
      
      const result = await setOrganizerAvailability(availability);
      
      // Update availabilities state
      setAvailabilities(prev => {
        const index = prev.findIndex(a => 
          a.organizerId === availability.organizerId && 
          a.dayOfWeek === availability.dayOfWeek
        );
        
        if (index >= 0) {
          return [
            ...prev.slice(0, index),
            result as OrganizerAvailability,
            ...prev.slice(index + 1)
          ];
        } else {
          return [...prev, result as OrganizerAvailability];
        }
      });
      
      toast({
        title: "Disponibilité mise à jour",
        description: "Votre disponibilité a été mise à jour avec succès.",
      });
      
      return result;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la disponibilité.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Delete organizer availability
  const handleDeleteAvailability = useCallback(async (availabilityId: string) => {
    try {
      setIsLoading(true);
      
      await deleteOrganizerAvailability(availabilityId);
      
      // Update availabilities state
      setAvailabilities(prev => prev.filter(a => a.id !== availabilityId));
      
      toast({
        title: "Disponibilité supprimée",
        description: "Votre disponibilité a été supprimée avec succès.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la disponibilité.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create session type
  const handleCreateSessionType = useCallback(async (sessionType: Omit<SessionType, 'id'>) => {
    try {
      setIsLoading(true);
      
      const result = await createSessionType(sessionType);
      
      // Update session types state
      setSessionTypes(prev => [...prev, result as SessionType]);
      
      toast({
        title: "Type de séance créé",
        description: "Le type de séance a été créé avec succès.",
      });
      
      return result;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le type de séance.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update session type
  const handleUpdateSessionType = useCallback(async (sessionTypeId: string, sessionType: Partial<Omit<SessionType, 'id'>>) => {
    try {
      setIsLoading(true);
      
      await updateSessionType(sessionTypeId, sessionType);
      
      // Update session types state
      setSessionTypes(prev => {
        const index = prev.findIndex(st => st.id === sessionTypeId);
        
        if (index >= 0) {
          const updatedSessionType = {
            ...prev[index],
            ...sessionType
          };
          
          return [
            ...prev.slice(0, index),
            updatedSessionType,
            ...prev.slice(index + 1)
          ];
        }
        
        return prev;
      });
      
      toast({
        title: "Type de séance mis à jour",
        description: "Le type de séance a été mis à jour avec succès.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le type de séance.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Delete session type
  const handleDeleteSessionType = useCallback(async (sessionTypeId: string) => {
    try {
      setIsLoading(true);
      
      await deleteSessionType(sessionTypeId);
      
      // Update session types state
      setSessionTypes(prev => prev.filter(st => st.id !== sessionTypeId));
      
      toast({
        title: "Type de séance supprimé",
        description: "Le type de séance a été supprimé avec succès.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le type de séance.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Confirm booking
  const handleConfirmBooking = useCallback(async (bookingId: string) => {
    try {
      setIsLoading(true);
      
      await confirmBooking(bookingId);
      
      // Update bookings state
      const updateBookingStatus = (bookings: Booking[]) => {
        return bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'confirmed' } 
            : booking
        );
      };
      
      setAllBookings(updateBookingStatus);
      setUpcomingBookings(updateBookingStatus);
      setTodayBookings(updateBookingStatus);
      setWeeklyBookings(updateBookingStatus);
      setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
      
      toast({
        title: "Réservation confirmée",
        description: "La réservation a été confirmée avec succès.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de confirmer la réservation.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Complete booking
  const handleCompleteBooking = useCallback(async (bookingId: string) => {
    try {
      setIsLoading(true);
      
      await completeBooking(bookingId);
      
      // Update bookings state
      const updateBookingStatus = (bookings: Booking[]) => {
        return bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'completed' } 
            : booking
        );
      };
      
      setAllBookings(updateBookingStatus);
      setUpcomingBookings(prev => prev.filter(b => b.id !== bookingId));
      setTodayBookings(prev => prev.filter(b => b.id !== bookingId));
      setWeeklyBookings(prev => prev.filter(b => b.id !== bookingId));
      
      toast({
        title: "Réservation terminée",
        description: "La réservation a été marquée comme terminée.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de terminer la réservation.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load all data in parallel
      const [
        fetchedSessionTypes,
        fetchedAvailabilities,
        fetchedAllBookings,
        fetchedUpcomingBookings,
        fetchedTodayBookings,
        fetchedWeeklyBookings,
        fetchedPendingBookings
      ] = await Promise.all([
        getSessionTypes(),
        getOrganizerAvailability(user.uid),
        getOrganizerBookings(user.uid),
        getUpcomingOrganizerBookings(user.uid),
        getTodayBookings(user.uid),
        getWeeklyBookings(user.uid),
        getPendingBookings(user.uid)
      ]);
      
      setSessionTypes(fetchedSessionTypes);
      setAvailabilities(fetchedAvailabilities);
      setAllBookings(fetchedAllBookings);
      setUpcomingBookings(fetchedUpcomingBookings);
      setTodayBookings(fetchedTodayBookings);
      setWeeklyBookings(fetchedWeeklyBookings);
      setPendingBookings(fetchedPendingBookings);
      
      toast({
        title: "Données actualisées",
        description: "Toutes les données ont été actualisées avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'actualiser les données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    sessionTypes,
    availabilities,
    allBookings,
    upcomingBookings,
    todayBookings,
    weeklyBookings,
    pendingBookings,
    isLoading,
    handleSetAvailability,
    handleDeleteAvailability,
    handleCreateSessionType,
    handleUpdateSessionType,
    handleDeleteSessionType,
    handleConfirmBooking,
    handleCompleteBooking,
    refreshData
  };
}
