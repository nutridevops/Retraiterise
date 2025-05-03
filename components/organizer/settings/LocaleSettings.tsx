'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Clock } from 'lucide-react';

interface LocaleSettingsProps {
  settings: {
    language: string;
    timeFormat: '12h' | '24h';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timezone: string;
    currency: string;
  };
  onUpdate: (updates: Partial<LocaleSettingsProps['settings']>) => void;
}

export function LocaleSettings({ settings, onUpdate }: LocaleSettingsProps) {
  const handleChange = (key: keyof LocaleSettingsProps['settings'], value: string) => {
    onUpdate({ [key]: value });
  };

  // List of common timezones
  const timezones = [
    { value: 'Europe/Paris', label: 'Paris (UTC+1/+2)' },
    { value: 'Europe/London', label: 'Londres (UTC+0/+1)' },
    { value: 'Europe/Brussels', label: 'Bruxelles (UTC+1/+2)' },
    { value: 'Europe/Zurich', label: 'Zurich (UTC+1/+2)' },
    { value: 'America/Montreal', label: 'Montréal (UTC-5/-4)' },
    { value: 'Africa/Casablanca', label: 'Casablanca (UTC+0/+1)' },
    { value: 'Europe/Madrid', label: 'Madrid (UTC+1/+2)' },
    { value: 'Europe/Berlin', label: 'Berlin (UTC+1/+2)' },
    { value: 'Europe/Rome', label: 'Rome (UTC+1/+2)' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam (UTC+1/+2)' },
    { value: 'America/New_York', label: 'New York (UTC-5/-4)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8/-7)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
    { value: 'Australia/Sydney', label: 'Sydney (UTC+10/+11)' },
  ];

  // List of currencies
  const currencies = [
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'Dollar américain ($)' },
    { value: 'GBP', label: 'Livre sterling (£)' },
    { value: 'CHF', label: 'Franc suisse (CHF)' },
    { value: 'CAD', label: 'Dollar canadien (C$)' },
    { value: 'MAD', label: 'Dirham marocain (MAD)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2 text-[#c9a227]" />
          Langue et région
        </CardTitle>
        <CardDescription>
          Personnalisez les paramètres régionaux et de langue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Langue</Label>
            <Select 
              value={settings.language} 
              onValueChange={(value) => handleChange('language', value)}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Sélectionnez une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="nl">Nederlands</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Select 
              value={settings.timezone} 
              onValueChange={(value) => handleChange('timezone', value)}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Sélectionnez un fuseau horaire" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Ce fuseau horaire sera utilisé pour afficher les heures de vos séances
            </p>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label>Format de l'heure</Label>
            <RadioGroup 
              value={settings.timeFormat} 
              onValueChange={(value) => handleChange('timeFormat', value as '12h' | '24h')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="time-12h" />
                <Label htmlFor="time-12h">12 heures (AM/PM)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="time-24h" />
                <Label htmlFor="time-24h">24 heures</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label>Format de date</Label>
            <RadioGroup 
              value={settings.dateFormat} 
              onValueChange={(value) => handleChange('dateFormat', value as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DD/MM/YYYY" id="date-dmy" />
                <Label htmlFor="date-dmy">JJ/MM/AAAA (31/12/2023)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MM/DD/YYYY" id="date-mdy" />
                <Label htmlFor="date-mdy">MM/JJ/AAAA (12/31/2023)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="YYYY-MM-DD" id="date-ymd" />
                <Label htmlFor="date-ymd">AAAA-MM-JJ (2023-12-31)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="currency">Devise</Label>
            <Select 
              value={settings.currency} 
              onValueChange={(value) => handleChange('currency', value)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Sélectionnez une devise" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Cette devise sera utilisée pour afficher les prix de vos séances
            </p>
          </div>
        </div>
        
        <div className="rounded-md bg-blue-50 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">À propos des paramètres régionaux</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Ces paramètres affectent uniquement l'affichage des dates, heures et devises dans votre interface.
                  Les clients verront les informations selon leurs propres paramètres régionaux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
