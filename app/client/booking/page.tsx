'use client';

import { useState } from 'react';
import { useBooking } from '@/hooks/use-booking';
import { BookingForm } from '@/components/BookingForm';
import { BookingList } from '@/components/BookingList';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ClientBookingPage() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const booking = useBooking();

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    booking.refreshBookings();
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Réservations</h1>
          <p className="text-muted-foreground">
            Réservez une séance avec un organisateur ou consultez vos réservations existantes.
          </p>
        </div>
        
        {!showBookingForm && (
          <Button 
            onClick={() => setShowBookingForm(true)}
            className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle réservation
          </Button>
        )}
      </div>

      {showBookingForm ? (
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2" 
                onClick={() => setShowBookingForm(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Nouvelle réservation</CardTitle>
                <CardDescription>
                  Réservez une séance avec un organisateur en quelques étapes simples.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BookingForm
              organizers={booking.organizers}
              sessionTypes={booking.sessionTypes}
              availableTimeSlots={booking.availableTimeSlots}
              selectedOrganizer={booking.selectedOrganizer}
              selectedDate={booking.selectedDate}
              selectedSessionType={booking.selectedSessionType}
              selectedTimeSlot={booking.selectedTimeSlot}
              notes={booking.notes}
              isLoading={booking.isLoading}
              onOrganizerChange={booking.handleOrganizerChange}
              onDateChange={booking.handleDateChange}
              onSessionTypeChange={booking.handleSessionTypeChange}
              onTimeSlotChange={booking.handleTimeSlotChange}
              onNotesChange={booking.handleNotesChange}
              onSubmit={async () => {
                const result = await booking.submitBooking();
                if (result) {
                  handleBookingSuccess();
                }
                return result;
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <BookingList
          bookings={booking.bookings}
          upcomingBookings={booking.upcomingBookings}
          isLoading={booking.isLoading}
          onCancelBooking={booking.handleCancelBooking}
          onRefresh={booking.refreshBookings}
        />
      )}
    </div>
  );
}
