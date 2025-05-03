'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Booking } from '@/lib/bookingService';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Bell
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { Badge } from '@/components/ui/badge';

interface OrganizerBookingDashboardProps {
  allBookings: Booking[];
  upcomingBookings: Booking[];
  todayBookings: Booking[];
  weeklyBookings: Booking[];
  pendingBookings: Booking[];
  isLoading: boolean;
  onConfirmBooking: (bookingId: string) => Promise<boolean>;
  onCompleteBooking: (bookingId: string) => Promise<boolean>;
  onRefresh: () => void;
}

export function OrganizerBookingDashboard({
  allBookings,
  upcomingBookings,
  todayBookings,
  weeklyBookings,
  pendingBookings,
  isLoading,
  onConfirmBooking,
  onCompleteBooking,
  onRefresh
}: OrganizerBookingDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState<boolean>(false);
  const [dialogAction, setDialogAction] = useState<'confirm' | 'complete'>('confirm');

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

  // Handle confirm booking
  const handleConfirmBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      setIsProcessing(true);
      const success = await onConfirmBooking(selectedBookingId);
      
      if (success) {
        setShowConfirmDialog(false);
      }
    } finally {
      setIsProcessing(false);
      setSelectedBookingId(null);
    }
  };

  // Handle complete booking
  const handleCompleteBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      setIsProcessing(true);
      const success = await onCompleteBooking(selectedBookingId);
      
      if (success) {
        setShowCompleteDialog(false);
      }
    } finally {
      setIsProcessing(false);
      setSelectedBookingId(null);
    }
  };

  // Show confirm dialog
  const showConfirmationDialog = (bookingId: string, action: 'confirm' | 'complete') => {
    setSelectedBookingId(bookingId);
    setDialogAction(action);
    
    if (action === 'confirm') {
      setShowConfirmDialog(true);
    } else {
      setShowCompleteDialog(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord des réservations</h2>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </>
          )}
        </Button>
      </div>

      {pendingBookings.length > 0 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-yellow-600" />
              <CardTitle className="text-lg text-yellow-800">Réservations en attente</CardTitle>
            </div>
            <CardDescription className="text-yellow-700">
              Vous avez {pendingBookings.length} réservation{pendingBookings.length > 1 ? 's' : ''} en attente de confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingBookings.map((booking) => (
                <Card key={booking.id} className="border-yellow-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{booking.sessionType}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>
                      {formatBookingDate(booking.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.clientName}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => showConfirmationDialog(booking.id || '', 'confirm')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="today">
            Aujourd'hui ({todayBookings.length})
          </TabsTrigger>
          <TabsTrigger value="week">
            Cette semaine ({weeklyBookings.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            À venir ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Historique ({allBookings.length})
          </TabsTrigger>
        </TabsList>

        {/* Today's Bookings */}
        <TabsContent value="today" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
            </div>
          ) : todayBookings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                Vous n'avez aucune réservation aujourd'hui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{booking.sessionType}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>
                      {formatBookingDate(booking.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.clientName}</span>
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
                    {booking.status === 'pending' ? (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => showConfirmationDialog(booking.id || '', 'confirm')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                    ) : booking.status === 'confirmed' ? (
                      <Button 
                        className="w-full"
                        onClick={() => showConfirmationDialog(booking.id || '', 'complete')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme terminé
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Weekly Bookings */}
        <TabsContent value="week" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
            </div>
          ) : weeklyBookings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                Vous n'avez aucune réservation cette semaine.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{booking.sessionType}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>
                      {formatBookingDate(booking.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.clientName}</span>
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
                    {booking.status === 'pending' ? (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => showConfirmationDialog(booking.id || '', 'confirm')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                    ) : booking.status === 'confirmed' ? (
                      <Button 
                        className="w-full"
                        onClick={() => showConfirmationDialog(booking.id || '', 'complete')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme terminé
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Upcoming Bookings */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{booking.sessionType}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>
                      {formatBookingDate(booking.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.clientName}</span>
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
                    {booking.status === 'pending' ? (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => showConfirmationDialog(booking.id || '', 'confirm')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                    ) : booking.status === 'confirmed' ? (
                      <Button 
                        className="w-full"
                        onClick={() => showConfirmationDialog(booking.id || '', 'complete')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme terminé
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* All Bookings */}
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
            </div>
          ) : allBookings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                Vous n'avez aucune réservation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allBookings.map((booking) => (
                <Card key={booking.id} className={`${booking.status === 'cancelled' || booking.status === 'completed' ? 'opacity-75' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{booking.sessionType}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>
                      {formatBookingDate(booking.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.clientName}</span>
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
                    {booking.status === 'pending' ? (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => showConfirmationDialog(booking.id || '', 'confirm')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                    ) : booking.status === 'confirmed' ? (
                      <Button 
                        className="w-full"
                        onClick={() => showConfirmationDialog(booking.id || '', 'complete')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme terminé
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirm Booking Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la réservation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir confirmer cette réservation ? Un email de confirmation sera envoyé au client.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              onClick={handleConfirmBooking}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Booking Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminer la réservation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir marquer cette réservation comme terminée ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              onClick={handleCompleteBooking}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Terminer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
