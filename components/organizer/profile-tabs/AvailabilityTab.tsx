'use client';

import { useState } from 'react';
import { OrganizerProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AvailabilityTabProps {
  profile: OrganizerProfile;
  onProfileUpdate: (updatedProfile: Partial<OrganizerProfile>) => void;
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const daysOfWeek: { id: DayOfWeek; label: string }[] = [
  { id: 'monday', label: 'Lundi' },
  { id: 'tuesday', label: 'Mardi' },
  { id: 'wednesday', label: 'Mercredi' },
  { id: 'thursday', label: 'Jeudi' },
  { id: 'friday', label: 'Vendredi' },
  { id: 'saturday', label: 'Samedi' },
  { id: 'sunday', label: 'Dimanche' },
];

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

export function AvailabilityTab({ profile, onProfileUpdate }: AvailabilityTabProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleAddTimeSlot = () => {
    // Validate time slot (end time should be after start time)
    if (startTime >= endTime) {
      alert('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    const currentAvailability = profile.availability || {};
    const currentDaySlots = currentAvailability[selectedDay] || [];
    
    // Check for overlapping time slots
    const newTimeSlot = `${startTime}-${endTime}`;
    const hasOverlap = currentDaySlots.some(slot => {
      const [existingStart, existingEnd] = slot.split('-');
      return (startTime < existingEnd && endTime > existingStart);
    });

    if (hasOverlap) {
      alert('Ce créneau chevauche un créneau existant');
      return;
    }

    // Add the new time slot
    const updatedDaySlots = [...currentDaySlots, newTimeSlot];
    
    // Sort time slots by start time
    updatedDaySlots.sort((a, b) => {
      const aStart = a.split('-')[0];
      const bStart = b.split('-')[0];
      return aStart.localeCompare(bStart);
    });

    const updatedAvailability = {
      ...currentAvailability,
      [selectedDay]: updatedDaySlots
    };

    onProfileUpdate({ availability: updatedAvailability });
  };

  const handleRemoveTimeSlot = (day: DayOfWeek, timeSlot: string) => {
    const currentAvailability = profile.availability || {};
    const currentDaySlots = currentAvailability[day] || [];
    
    const updatedDaySlots = currentDaySlots.filter(slot => slot !== timeSlot);
    
    const updatedAvailability = {
      ...currentAvailability,
      [day]: updatedDaySlots
    };

    onProfileUpdate({ availability: updatedAvailability });
  };

  const copyToAllDays = () => {
    const currentAvailability = profile.availability || {};
    const sourceSlots = currentAvailability[selectedDay] || [];
    
    if (sourceSlots.length === 0) {
      alert('Aucun créneau à copier');
      return;
    }

    const updatedAvailability = { ...currentAvailability };
    
    daysOfWeek.forEach(day => {
      if (day.id !== selectedDay) {
        updatedAvailability[day.id] = [...sourceSlots];
      }
    });

    onProfileUpdate({ availability: updatedAvailability });
  };

  const clearDay = (day: DayOfWeek) => {
    const currentAvailability = profile.availability || {};
    
    const updatedAvailability = {
      ...currentAvailability,
      [day]: []
    };

    onProfileUpdate({ availability: updatedAvailability });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-[#c9a227]" />
          Disponibilités
        </CardTitle>
        <CardDescription>
          Configurez vos disponibilités hebdomadaires pour les séances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Jour</Label>
              <Select 
                value={selectedDay} 
                onValueChange={(value) => setSelectedDay(value as DayOfWeek)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un jour" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.id} value={day.id}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Heure de début</Label>
              <Select 
                value={startTime} 
                onValueChange={setStartTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Heure de début" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Heure de fin</Label>
              <Select 
                value={endTime} 
                onValueChange={setEndTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Heure de fin" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleAddTimeSlot}
              className="w-full bg-[#c9a227] hover:bg-[#b18e23] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
            
            <div className="pt-4 space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={copyToAllDays}
              >
                Copier vers tous les jours
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => clearDay(selectedDay)}
              >
                Effacer ce jour
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="space-y-2">
                <h3 className="font-medium">{day.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.availability?.[day.id] || []).length > 0 ? (
                    (profile.availability?.[day.id] || []).map((slot, index) => (
                      <div 
                        key={index} 
                        className="flex items-center bg-gray-100 rounded-md px-3 py-1"
                      >
                        <span>{slot}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2 text-red-500 hover:text-red-700 hover:bg-transparent"
                          onClick={() => handleRemoveTimeSlot(day.id, slot)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Aucune disponibilité</span>
                  )}
                </div>
                <div className="border-b border-gray-200 my-2"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
