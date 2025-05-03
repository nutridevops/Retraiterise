'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrganizerProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationContactTabProps {
  profile: OrganizerProfile;
  onProfileUpdate: (updatedProfile: Partial<OrganizerProfile>) => void;
}

export function LocationContactTab({ profile, onProfileUpdate }: LocationContactTabProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onProfileUpdate({ [name]: value });
  };

  const handleCountryChange = (value: string) => {
    onProfileUpdate({ country: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-[#c9a227]" />
          Adresse et Contact
        </CardTitle>
        <CardDescription>
          Vos coordonnées et adresse professionnelle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email professionnel</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleInputChange}
            placeholder="Votre adresse email professionnelle"
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Cette adresse sera utilisée pour les communications avec les clients.
          </p>
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            value={profile.phone || ''}
            onChange={handleInputChange}
            placeholder="Votre numéro de téléphone"
            className="w-full"
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={profile.address || ''}
            onChange={handleInputChange}
            placeholder="Votre adresse professionnelle"
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              name="city"
              value={profile.city || ''}
              onChange={handleInputChange}
              placeholder="Votre ville"
              className="w-full"
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={profile.postalCode || ''}
              onChange={handleInputChange}
              placeholder="Votre code postal"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="country">Pays</Label>
          <Select 
            value={profile.country || 'France'} 
            onValueChange={handleCountryChange}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Sélectionnez un pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Belgique">Belgique</SelectItem>
              <SelectItem value="Suisse">Suisse</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Luxembourg">Luxembourg</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
