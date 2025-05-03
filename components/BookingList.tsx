'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Booking } from '@/lib/bookingService';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, User, FileText, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface BookingListProps {
  bookings: Booking[];
  upcomingBookings: Booking[];
  isLoading: boolean;
  onCancelBooking: (bookingId: string) => Promise<boolean>;
  onRefresh: () => void;
}

export function BookingList({
  bookings,
  upcomingBookings,
  isLoading,
  onCancelBooking,
  onRefresh
}: BookingListProps) {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);

  // Format date for display
  const formatBookingDate = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Confirmé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Annulé</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Terminé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!cancellingBookingId) return;
    
    try {
      setIsCancelling(true);
      const success = await onCancelBooking(cancellingBookingId);
      
      if (success) {
        setShowCancelDialog(false);
      }
    } finally {
      setIsCancelling(false);
      setCancellingBookingId(null);
    }
  };

  // Show cancel confirmation dialog
  const showCancelConfirmation = (bookingId: string) => {
    setCancellingBookingId(bookingId);
    setShowCancelDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Mes réservations</h2>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualiser"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">
            À venir ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Historique ({bookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                Vous n'avez aucune réservation à venir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{booking.sessionType}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>
                      {formatBookingDate(booking.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.organizerName}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    {booking.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="font-medium">Notes:</p>
                        <p className="line-clamp-2">{booking.notes}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {booking.status !== 'cancelled' && (
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => showCancelConfirmation(booking.id || '')}
                      >
                        Annuler la réservation
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                Vous n'avez aucune réservation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className={`overflow-hidden ${booking.status === 'cancelled' ? 'opacity-75' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{booking.sessionType}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>
                      {formatBookingDate(booking.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.organizerName}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    {booking.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="font-medium">Notes:</p>
                        <p className="line-clamp-2">{booking.notes}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => showCancelConfirmation(booking.id || '')}
                      >
                        Annuler la réservation
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler la réservation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start space-x-2 text-amber-600">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              L'annulation d'une réservation peut être soumise à des frais selon les conditions de service.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                'Confirmer l\'annulation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
