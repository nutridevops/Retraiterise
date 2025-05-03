'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrganizerProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface PersonalInfoTabProps {
  profile: OrganizerProfile;
  onProfileUpdate: (updatedProfile: Partial<OrganizerProfile>) => void;
}

export function PersonalInfoTab({ profile, onProfileUpdate }: PersonalInfoTabProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onProfileUpdate({ [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2 text-[#c9a227]" />
          Informations personnelles
        </CardTitle>
        <CardDescription>
          Vos informations personnelles visibles par les clients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="displayName">Nom complet</Label>
          <Input
            id="displayName"
            name="displayName"
            value={profile.displayName}
            onChange={handleInputChange}
            placeholder="Votre nom complet"
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="title">Titre professionnel</Label>
          <Input
            id="title"
            name="title"
            value={profile.title || ''}
            onChange={handleInputChange}
            placeholder="Ex: Coach de vie, Thérapeute, etc."
          />
          <p className="text-sm text-muted-foreground">
            Ce titre sera affiché sur votre profil public et dans les résultats de recherche.
          </p>
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="bio">Biographie</Label>
          <Textarea
            id="bio"
            name="bio"
            value={profile.bio || ''}
            onChange={handleInputChange}
            placeholder="Parlez de vous, de votre parcours et de votre approche..."
            rows={6}
          />
          <p className="text-sm text-muted-foreground">
            Une biographie complète et personnelle aide les clients à mieux vous connaître et à établir une connexion avant même la première séance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
