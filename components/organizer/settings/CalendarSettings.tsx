'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar, Clock } from 'lucide-react';

interface CalendarSettingsProps {
  settings: {
    defaultView: 'day' | 'week' | 'month';
    startOfWeek: 0 | 1 | 6; // 0 = Sunday, 1 = Monday, 6 = Saturday
    workingHours: {
      start: string;
      end: string;
    };
    showDeclinedEvents: boolean;
    autoAcceptBookings: boolean;
    bufferTime: number; // in minutes
  };
  onUpdate: (updates: Partial<CalendarSettingsProps['settings']>) => void;
}

export function CalendarSettings({ settings, onUpdate }: CalendarSettingsProps) {
  const handleViewChange = (value: 'day' | 'week' | 'month') => {
    onUpdate({ defaultView: value });
  };

  const handleStartOfWeekChange = (value: string) => {
    onUpdate({ startOfWeek: parseInt(value) as 0 | 1 | 6 });
  };

  const handleWorkingHoursChange = (key: 'start' | 'end', value: string) => {
    onUpdate({
      workingHours: {
        ...settings.workingHours,
        [key]: value
      }
    });
  };

  const handleToggle = (key: 'showDeclinedEvents' | 'autoAcceptBookings') => {
    onUpdate({ [key]: !settings[key] });
  };

  const handleBufferTimeChange = (value: number[]) => {
    onUpdate({ bufferTime: value[0] });
  };

  // Generate time options for select
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-[#c9a227]" />
          Paramètres du calendrier
        </CardTitle>
        <CardDescription>
          Personnalisez l'affichage et le comportement de votre calendrier
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Vue par défaut</h3>
            <RadioGroup 
              value={settings.defaultView} 
              onValueChange={(value) => handleViewChange(value as 'day' | 'week' | 'month')}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="day" 
                  id="view-day" 
                  className="sr-only"
                />
                <Label
                  htmlFor="view-day"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <span className="text-sm font-medium">J</span>
                  </div>
                  <span className="mt-2">Jour</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="week" 
                  id="view-week" 
                  className="sr-only"
                />
                <Label
                  htmlFor="view-week"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <span className="text-sm font-medium">S</span>
                  </div>
                  <span className="mt-2">Semaine</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="month" 
                  id="view-month" 
                  className="sr-only"
                />
                <Label
                  htmlFor="view-month"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <span className="text-sm font-medium">M</span>
                  </div>
                  <span className="mt-2">Mois</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start-of-week">Premier jour de la semaine</Label>
            <Select 
              value={settings.startOfWeek.toString()} 
              onValueChange={handleStartOfWeekChange}
            >
              <SelectTrigger id="start-of-week">
                <SelectValue placeholder="Sélectionnez le premier jour de la semaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Lundi</SelectItem>
                <SelectItem value="0">Dimanche</SelectItem>
                <SelectItem value="6">Samedi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="working-hours-start">Début des heures de travail</Label>
              <Select 
                value={settings.workingHours.start} 
                onValueChange={(value) => handleWorkingHoursChange('start', value)}
              >
                <SelectTrigger id="working-hours-start">
                  <SelectValue placeholder="Heure de début" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`start-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="working-hours-end">Fin des heures de travail</Label>
              <Select 
                value={settings.workingHours.end} 
                onValueChange={(value) => handleWorkingHoursChange('end', value)}
              >
                <SelectTrigger id="working-hours-end">
                  <SelectValue placeholder="Heure de fin" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`end-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-declined-events">Afficher les événements refusés</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les événements que vous avez refusés dans votre calendrier
                </p>
              </div>
              <Switch
                id="show-declined-events"
                checked={settings.showDeclinedEvents}
                onCheckedChange={() => handleToggle('showDeclinedEvents')}
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-accept-bookings">Acceptation automatique des réservations</Label>
                <p className="text-sm text-muted-foreground">
                  Accepter automatiquement les nouvelles réservations qui correspondent à vos disponibilités
                </p>
              </div>
              <Switch
                id="auto-accept-bookings"
                checked={settings.autoAcceptBookings}
                onCheckedChange={() => handleToggle('autoAcceptBookings')}
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="buffer-time">Temps tampon entre les séances (minutes)</Label>
                <span className="text-sm font-medium">{settings.bufferTime} min</span>
              </div>
              <Slider
                id="buffer-time"
                value={[settings.bufferTime]}
                min={0}
                max={60}
                step={5}
                onValueChange={handleBufferTimeChange}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Définissez un temps tampon entre vos séances pour vous permettre de vous préparer
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
