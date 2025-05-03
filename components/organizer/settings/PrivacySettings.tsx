'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

interface PrivacySettingsProps {
  settings: {
    showProfile: boolean;
    showAvailability: boolean;
    showContactInfo: boolean;
    allowClientReviews: boolean;
    allowDirectMessages: boolean;
  };
  onUpdate: (updates: Partial<PrivacySettingsProps['settings']>) => void;
}

export function PrivacySettings({ settings, onUpdate }: PrivacySettingsProps) {
  const handleToggle = (key: keyof PrivacySettingsProps['settings']) => {
    onUpdate({ [key]: !settings[key] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-[#c9a227]" />
          Paramètres de confidentialité
        </CardTitle>
        <CardDescription>
          Gérez qui peut voir vos informations et comment les clients peuvent interagir avec vous
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-profile">Profil public</Label>
              <p className="text-sm text-muted-foreground">
                Rendre votre profil visible aux clients potentiels
              </p>
            </div>
            <Switch
              id="show-profile"
              checked={settings.showProfile}
              onCheckedChange={() => handleToggle('showProfile')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-availability">Disponibilité visible</Label>
              <p className="text-sm text-muted-foreground">
                Permettre aux clients de voir vos créneaux disponibles
              </p>
            </div>
            <Switch
              id="show-availability"
              checked={settings.showAvailability}
              onCheckedChange={() => handleToggle('showAvailability')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-contact-info">Informations de contact</Label>
              <p className="text-sm text-muted-foreground">
                Rendre vos informations de contact visibles aux clients
              </p>
            </div>
            <Switch
              id="show-contact-info"
              checked={settings.showContactInfo}
              onCheckedChange={() => handleToggle('showContactInfo')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-client-reviews">Avis clients</Label>
              <p className="text-sm text-muted-foreground">
                Autoriser les clients à laisser des avis sur votre profil
              </p>
            </div>
            <Switch
              id="allow-client-reviews"
              checked={settings.allowClientReviews}
              onCheckedChange={() => handleToggle('allowClientReviews')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-direct-messages">Messages directs</Label>
              <p className="text-sm text-muted-foreground">
                Autoriser les clients à vous envoyer des messages directs
              </p>
            </div>
            <Switch
              id="allow-direct-messages"
              checked={settings.allowDirectMessages}
              onCheckedChange={() => handleToggle('allowDirectMessages')}
            />
          </div>
        </div>
        
        <div className="rounded-md bg-yellow-50 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Note sur la confidentialité</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Ces paramètres contrôlent la visibilité de vos informations sur la plateforme R.I.S.E. 
                  Même si vous désactivez certaines options, les clients avec lesquels vous avez déjà 
                  des séances programmées pourront toujours vous contacter via la plateforme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
