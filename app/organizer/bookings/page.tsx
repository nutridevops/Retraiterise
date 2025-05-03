'use client';

import { useState } from 'react';
import { useOrganizerBooking } from '@/hooks/use-organizer-booking';
import { OrganizerBookingDashboard } from '@/components/OrganizerBookingDashboard';
import { AvailabilityManager } from '@/components/AvailabilityManager';
import { SessionTypeManager } from '@/components/SessionTypeManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function OrganizerBookingsPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { user } = useAuth();
  const organizerBooking = useOrganizerBooking();

  if (!user) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des réservations</h1>
          <p className="text-muted-foreground">
            Gérez vos réservations, disponibilités et types de séances.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Réservations
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Disponibilités
          </TabsTrigger>
          <TabsTrigger value="sessionTypes" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Types de séances
          </TabsTrigger>
        </TabsList>

        {/* Bookings Dashboard */}
        <TabsContent value="dashboard">
          <OrganizerBookingDashboard
            allBookings={organizerBooking.allBookings}
            upcomingBookings={organizerBooking.upcomingBookings}
            todayBookings={organizerBooking.todayBookings}
            weeklyBookings={organizerBooking.weeklyBookings}
            pendingBookings={organizerBooking.pendingBookings}
            isLoading={organizerBooking.isLoading}
            onConfirmBooking={organizerBooking.handleConfirmBooking}
            onCompleteBooking={organizerBooking.handleCompleteBooking}
            onRefresh={organizerBooking.refreshData}
          />
        </TabsContent>

        {/* Availability Management */}
        <TabsContent value="availability">
          <AvailabilityManager
            availabilities={organizerBooking.availabilities}
            isLoading={organizerBooking.isLoading}
            onSetAvailability={organizerBooking.handleSetAvailability}
            onDeleteAvailability={organizerBooking.handleDeleteAvailability}
            organizerId={user.uid}
          />
        </TabsContent>

        {/* Session Types Management */}
        <TabsContent value="sessionTypes">
          <SessionTypeManager
            sessionTypes={organizerBooking.sessionTypes}
            isLoading={organizerBooking.isLoading}
            onCreateSessionType={organizerBooking.handleCreateSessionType}
            onUpdateSessionType={organizerBooking.handleUpdateSessionType}
            onDeleteSessionType={organizerBooking.handleDeleteSessionType}
            organizerId={user.uid}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
