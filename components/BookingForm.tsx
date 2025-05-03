'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, FileText } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Organizer, SessionType, TimeSlot } from '@/lib/bookingService';

interface BookingFormProps {
  organizers: Organizer[];
  sessionTypes: SessionType[];
  availableTimeSlots: TimeSlot[];
  selectedOrganizer: Organizer | null;
  selectedDate: Date | null;
  selectedSessionType: SessionType | null;
  selectedTimeSlot: TimeSlot | null;
  notes: string;
  isLoading: boolean;
  onOrganizerChange: (organizerId: string) => void;
  onDateChange: (date: Date | null) => void;
  onSessionTypeChange: (sessionTypeId: string) => void;
  onTimeSlotChange: (timeSlot: TimeSlot | null) => void;
  onNotesChange: (notes: string) => void;
  onSubmit: () => Promise<boolean | void>;
}

export function BookingForm({
  organizers,
  sessionTypes,
  availableTimeSlots,
  selectedOrganizer,
  selectedDate,
  selectedSessionType,
  selectedTimeSlot,
  notes,
  isLoading,
  onOrganizerChange,
  onDateChange,
  onSessionTypeChange,
  onTimeSlotChange,
  onNotesChange,
  onSubmit
}: BookingFormProps) {
  const [activeTab, setActiveTab] = useState<string>('organizer');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter session types by selected organizer
  const filteredSessionTypes = selectedOrganizer
    ? sessionTypes.filter(st => st.organizerId === selectedOrganizer.id)
    : [];

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next step
  const handleNext = (nextTab: string) => {
    setActiveTab(nextTab);
  };

  // Check if current step is complete
  const isStepComplete = (step: string) => {
    switch (step) {
      case 'organizer':
        return !!selectedOrganizer;
      case 'session':
        return !!selectedSessionType;
      case 'date':
        return !!selectedDate;
      case 'time':
        return !!selectedTimeSlot;
      default:
        return false;
    }
  };

  // Determine if form is complete
  const isFormComplete = 
    !!selectedOrganizer && 
    !!selectedSessionType && 
    !!selectedDate && 
    !!selectedTimeSlot;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="organizer" disabled={isLoading}>
            Organisateur
          </TabsTrigger>
          <TabsTrigger 
            value="session" 
            disabled={!selectedOrganizer || isLoading}
          >
            Type de séance
          </TabsTrigger>
          <TabsTrigger 
            value="date" 
            disabled={!selectedSessionType || isLoading}
          >
            Date
          </TabsTrigger>
          <TabsTrigger 
            value="time" 
            disabled={!selectedDate || isLoading}
          >
            Heure
          </TabsTrigger>
        </TabsList>

        {/* Organizer Selection */}
        <TabsContent value="organizer" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Choisissez un organisateur</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez l'organisateur avec lequel vous souhaitez prendre rendez-vous.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {organizers.map((organizer) => (
                <Card 
                  key={organizer.id}
                  className={`cursor-pointer transition-all ${
                    selectedOrganizer?.id === organizer.id 
                      ? 'border-[#c9a227] shadow-md' 
                      : 'hover:border-[#c9a227]/50'
                  }`}
                  onClick={() => onOrganizerChange(organizer.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img 
                          src={organizer.imageUrl} 
                          alt={organizer.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{organizer.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {organizer.title}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              onClick={() => handleNext('session')}
              disabled={!selectedOrganizer || isLoading}
              className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
            >
              Suivant
            </Button>
          </div>
        </TabsContent>

        {/* Session Type Selection */}
        <TabsContent value="session" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Choisissez un type de séance</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez le type de séance que vous souhaitez réserver.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
            </div>
          ) : filteredSessionTypes.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                Aucun type de séance disponible pour cet organisateur.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSessionTypes.map((sessionType) => (
                <Card 
                  key={sessionType.id}
                  className={`cursor-pointer transition-all ${
                    selectedSessionType?.id === sessionType.id 
                      ? 'border-[#c9a227] shadow-md' 
                      : 'hover:border-[#c9a227]/50'
                  }`}
                  onClick={() => onSessionTypeChange(sessionType.id || '')}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{sessionType.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {sessionType.duration} minutes {sessionType.price ? `- ${sessionType.price}€` : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {sessionType.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleNext('organizer')}
              disabled={isLoading}
            >
              Précédent
            </Button>
            <Button 
              onClick={() => handleNext('date')}
              disabled={!selectedSessionType || isLoading}
              className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
            >
              Suivant
            </Button>
          </div>
        </TabsContent>

        {/* Date Selection */}
        <TabsContent value="date" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Choisissez une date</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez la date à laquelle vous souhaitez réserver votre séance.
            </p>
          </div>

          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={onDateChange}
              locale={fr}
              disabled={(date) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              className="rounded-md border"
            />
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleNext('session')}
              disabled={isLoading}
            >
              Précédent
            </Button>
            <Button 
              onClick={() => handleNext('time')}
              disabled={!selectedDate || isLoading}
              className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
            >
              Suivant
            </Button>
          </div>
        </TabsContent>

        {/* Time Selection */}
        <TabsContent value="time" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Choisissez un créneau horaire</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez l'heure à laquelle vous souhaitez réserver votre séance.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
            </div>
          ) : availableTimeSlots.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableTimeSlots.map((timeSlot, index) => (
                <Button
                  key={index}
                  variant={selectedTimeSlot?.startTime === timeSlot.startTime ? "default" : "outline"}
                  className={selectedTimeSlot?.startTime === timeSlot.startTime ? "bg-[#c9a227] hover:bg-[#b18e23] text-white" : ""}
                  onClick={() => onTimeSlotChange(timeSlot)}
                >
                  {timeSlot.startTime}
                </Button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Notes (optionnel)</h3>
            <Textarea
              placeholder="Ajoutez des notes ou des informations supplémentaires pour l'organisateur..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleNext('date')}
              disabled={isLoading}
            >
              Précédent
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting || isLoading}
              className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réservation en cours...
                </>
              ) : (
                'Confirmer la réservation'
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Booking Summary */}
      {isFormComplete && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Récapitulatif de votre réservation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start">
              <User className="h-5 w-5 mr-2 mt-0.5 text-[#c9a227]" />
              <div>
                <p className="font-medium">Organisateur</p>
                <p className="text-sm text-muted-foreground">{selectedOrganizer?.name}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 mr-2 mt-0.5 text-[#c9a227]" />
              <div>
                <p className="font-medium">Type de séance</p>
                <p className="text-sm text-muted-foreground">{selectedSessionType?.name} ({selectedSessionType?.duration} minutes)</p>
              </div>
            </div>
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 mr-2 mt-0.5 text-[#c9a227]" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(selectedDate)}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-2 mt-0.5 text-[#c9a227]" />
              <div>
                <p className="font-medium">Heure</p>
                <p className="text-sm text-muted-foreground">{selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}</p>
              </div>
            </div>
            {notes && (
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-2 mt-0.5 text-[#c9a227]" />
                <div>
                  <p className="font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">{notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
