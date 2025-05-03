'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';

interface NotificationSettingsProps {
  settings: {
    email: boolean;
    sms: boolean;
    browser: boolean;
    newBooking: boolean;
    bookingCancellation: boolean;
    bookingReminder: boolean;
    clientMessages: boolean;
    systemUpdates: boolean;
  };
  onUpdate: (updates: Partial<NotificationSettingsProps['settings']>) => void;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const handleToggle = (key: keyof NotificationSettingsProps['settings']) => {
    onUpdate({ [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-[#c9a227]" />
            Paramètres de notification
          </CardTitle>
          <CardDescription>
            Configurez comment et quand vous souhaitez être notifié
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Canaux de notification</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications par email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email}
                  onCheckedChange={() => handleToggle('email')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications par SMS
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.sms}
                  onCheckedChange={() => handleToggle('sms')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">Notifications navigateur</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications dans votre navigateur
                  </p>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={settings.browser}
                  onCheckedChange={() => handleToggle('browser')}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Types de notifications</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-booking">Nouvelles réservations</Label>
                  <p className="text-sm text-muted-foreground">
                    Soyez notifié lorsqu'un client effectue une nouvelle réservation
                  </p>
                </div>
                <Switch
                  id="new-booking"
                  checked={settings.newBooking}
                  onCheckedChange={() => handleToggle('newBooking')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-cancellation">Annulations de réservation</Label>
                  <p className="text-sm text-muted-foreground">
                    Soyez notifié lorsqu'un client annule une réservation
                  </p>
                </div>
                <Switch
                  id="booking-cancellation"
                  checked={settings.bookingCancellation}
                  onCheckedChange={() => handleToggle('bookingCancellation')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-reminder">Rappels de séance</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez un rappel avant vos séances programmées
                  </p>
                </div>
                <Switch
                  id="booking-reminder"
                  checked={settings.bookingReminder}
                  onCheckedChange={() => handleToggle('bookingReminder')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="client-messages">Messages des clients</Label>
                  <p className="text-sm text-muted-foreground">
                    Soyez notifié lorsqu'un client vous envoie un message
                  </p>
                </div>
                <Switch
                  id="client-messages"
                  checked={settings.clientMessages}
                  onCheckedChange={() => handleToggle('clientMessages')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-updates">Mises à jour système</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications concernant les mises à jour de la plateforme
                  </p>
                </div>
                <Switch
                  id="system-updates"
                  checked={settings.systemUpdates}
                  onCheckedChange={() => handleToggle('systemUpdates')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
