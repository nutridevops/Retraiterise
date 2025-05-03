'use client';

import { useState } from 'react';
import { OrganizerAvailability } from '@/lib/bookingService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useToast } from '@/hooks/use-toast';

interface AvailabilityManagerProps {
  availabilities: OrganizerAvailability[];
  isLoading: boolean;
  onSetAvailability: (availability: Omit<OrganizerAvailability, 'id'>) => Promise<any>;
  onDeleteAvailability: (availabilityId: string) => Promise<boolean>;
  organizerId: string;
}

const DAYS_OF_WEEK = [
  { value: '0', label: 'Dimanche' },
  { value: '1', label: 'Lundi' },
  { value: '2', label: 'Mardi' },
  { value: '3', label: 'Mercredi' },
  { value: '4', label: 'Jeudi' },
  { value: '5', label: 'Vendredi' },
  { value: '6', label: 'Samedi' },
];

export function AvailabilityManager({
  availabilities,
  isLoading,
  onSetAvailability,
  onDeleteAvailability,
  organizerId
}: AvailabilityManagerProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [newAvailability, setNewAvailability] = useState<Omit<OrganizerAvailability, 'id'>>({
    organizerId: organizerId,
    dayOfWeek: '1', // Monday by default
    startTime: '09:00',
    endTime: '17:00',
  });

  // Handle form input changes
  const handleInputChange = (field: keyof Omit<OrganizerAvailability, 'id'>, value: string) => {
    setNewAvailability(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!newAvailability.dayOfWeek || !newAvailability.startTime || !newAvailability.endTime) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    // Validate time range
    const start = newAvailability.startTime.split(':').map(Number);
    const end = newAvailability.endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];

    if (startMinutes >= endMinutes) {
      toast({
        title: "Erreur de validation",
        description: "L'heure de fin doit être postérieure à l'heure de début.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSetAvailability(newAvailability);
      setShowAddDialog(false);
      
      // Reset form
      setNewAvailability({
        organizerId: organizerId,
        dayOfWeek: '1',
        startTime: '09:00',
        endTime: '17:00',
      });
    } catch (error) {
      console.error('Error submitting availability:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle availability deletion
  const handleDelete = async (availabilityId: string) => {
    try {
      setIsDeleting(availabilityId);
      await onDeleteAvailability(availabilityId);
    } catch (error) {
      console.error('Error deleting availability:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Get day name from day of week number
  const getDayName = (dayOfWeek: string) => {
    const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek);
    return day ? day.label : 'Inconnu';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">Gestion des disponibilités</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#c9a227] hover:bg-[#b18e23] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une disponibilité
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une disponibilité</DialogTitle>
              <DialogDescription>
                Définissez vos heures de disponibilité pour un jour spécifique de la semaine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dayOfWeek">Jour de la semaine</Label>
                <Select
                  value={newAvailability.dayOfWeek}
                  onValueChange={(value) => handleInputChange('dayOfWeek', value)}
                >
                  <SelectTrigger id="dayOfWeek">
                    <SelectValue placeholder="Sélectionnez un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Heure de début</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newAvailability.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">Heure de fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newAvailability.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
        </div>
      ) : availabilities.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            Vous n'avez défini aucune disponibilité. Ajoutez-en une pour commencer à recevoir des réservations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availabilities.map((availability) => (
            <Card key={availability.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{getDayName(availability.dayOfWeek)}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{availability.startTime} - {availability.endTime}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(availability.id || '')}
                  disabled={isDeleting === availability.id}
                >
                  {isDeleting === availability.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
