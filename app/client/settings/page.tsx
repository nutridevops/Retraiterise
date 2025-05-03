'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { doc, getDoc, updateDoc, setDoc, Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save, 
  Loader2
} from 'lucide-react';

interface ClientSettings {
  notifications: {
    email: boolean;
    browser: boolean;
    bookingReminders: boolean;
    resourceUpdates: boolean;
    organizerMessages: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    shareProfileWithOrganizers: boolean;
    allowAnonymousFeedback: boolean;
    showActivityStatus: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
  locale: {
    language: string;
    timeFormat: '12h' | '24h';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timezone: string;
  };
  userId: string;
  updatedAt: Date;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('notifications');
  const [settings, setSettings] = useState<ClientSettings>({
    notifications: {
      email: true,
      browser: true,
      bookingReminders: true,
      resourceUpdates: true,
      organizerMessages: true,
      systemUpdates: false,
    },
    privacy: {
      shareProfileWithOrganizers: true,
      allowAnonymousFeedback: true,
      showActivityStatus: true,
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
      reducedMotion: false,
    },
    locale: {
      language: 'fr',
      timeFormat: '24h',
      dateFormat: 'DD/MM/YYYY',
      timezone: 'Europe/Paris',
    },
    userId: '',
    updatedAt: new Date(),
  });

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      if (!db) {
        console.error('Firestore instance is undefined');
        toast({
          title: 'Erreur',
          description: 'Impossible de charger vos paramètres. Veuillez réessayer.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsLoading(true);
        const settingsRef = doc(db as Firestore, 'clientSettings', user.uid);
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          // Convert Firestore timestamp to Date
          const data = settingsSnap.data();
          const updatedSettings = {
            ...data,
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as ClientSettings;

          setSettings(updatedSettings);
        } else {
          // Create default settings if none exist
          const defaultSettings: ClientSettings = {
            ...settings,
            userId: user.uid,
          };
          
          await setDoc(settingsRef, defaultSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger vos paramètres. Veuillez réessayer.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user, router, toast]);

  // Save settings
  const saveSettings = async () => {
    if (!user || !db) return;

    try {
      setIsSaving(true);
      const settingsRef = doc(db as Firestore, 'clientSettings', user.uid);
      
      // Update the settings with the current timestamp
      const updatedSettings = {
        ...settings,
        updatedAt: new Date(),
      };
      
      await updateDoc(settingsRef, updatedSettings);
      
      toast({
        title: 'Paramètres enregistrés',
        description: 'Vos préférences ont été mises à jour avec succès.',
      });
      
      // Apply settings to the application
      applySettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer vos paramètres. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Apply settings to the application
  const applySettings = (settings: ClientSettings) => {
    // Apply theme
    const { theme } = settings.appearance;
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    
    // Apply font size
    const { fontSize } = settings.appearance;
    root.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'medium' ? '16px' : '18px';
    
    // Apply reduced motion
    if (settings.appearance.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };

  // Handle settings updates
  const handleSettingsUpdate = (category: string, updates: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category as keyof ClientSettings],
        ...updates,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
        <span className="ml-2">Chargement des paramètres...</span>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience R.I.S.E. Retreat
          </p>
        </div>
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
          className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Catégories</h3>
            <div className="space-y-1">
              <Button 
                variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button 
                variant={activeTab === 'privacy' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('privacy')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Confidentialité
              </Button>
              <Button 
                variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('appearance')}
              >
                <Palette className="mr-2 h-4 w-4" />
                Apparence
              </Button>
              <Button 
                variant={activeTab === 'locale' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('locale')}
              >
                <Globe className="mr-2 h-4 w-4" />
                Langue et région
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Gérez comment et quand vous recevez des notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Canaux de notification</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-notifications" className="text-sm">Email</label>
                      <input 
                        type="checkbox" 
                        id="email-notifications" 
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingsUpdate('notifications', { email: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="browser-notifications" className="text-sm">Navigateur</label>
                      <input 
                        type="checkbox" 
                        id="browser-notifications" 
                        checked={settings.notifications.browser}
                        onChange={(e) => handleSettingsUpdate('notifications', { browser: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Types de notifications</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="booking-reminders" className="text-sm">Rappels de réservation</label>
                      <input 
                        type="checkbox" 
                        id="booking-reminders" 
                        checked={settings.notifications.bookingReminders}
                        onChange={(e) => handleSettingsUpdate('notifications', { bookingReminders: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="resource-updates" className="text-sm">Nouvelles ressources</label>
                      <input 
                        type="checkbox" 
                        id="resource-updates" 
                        checked={settings.notifications.resourceUpdates}
                        onChange={(e) => handleSettingsUpdate('notifications', { resourceUpdates: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="organizer-messages" className="text-sm">Messages des organisateurs</label>
                      <input 
                        type="checkbox" 
                        id="organizer-messages" 
                        checked={settings.notifications.organizerMessages}
                        onChange={(e) => handleSettingsUpdate('notifications', { organizerMessages: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="system-updates" className="text-sm">Mises à jour système</label>
                      <input 
                        type="checkbox" 
                        id="system-updates" 
                        checked={settings.notifications.systemUpdates}
                        onChange={(e) => handleSettingsUpdate('notifications', { systemUpdates: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle>Confidentialité</CardTitle>
                <CardDescription>
                  Gérez vos paramètres de confidentialité et de partage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="share-profile" className="text-sm">Partager mon profil avec les organisateurs</label>
                      <input 
                        type="checkbox" 
                        id="share-profile" 
                        checked={settings.privacy.shareProfileWithOrganizers}
                        onChange={(e) => handleSettingsUpdate('privacy', { shareProfileWithOrganizers: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="anonymous-feedback" className="text-sm">Autoriser les commentaires anonymes</label>
                      <input 
                        type="checkbox" 
                        id="anonymous-feedback" 
                        checked={settings.privacy.allowAnonymousFeedback}
                        onChange={(e) => handleSettingsUpdate('privacy', { allowAnonymousFeedback: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="activity-status" className="text-sm">Afficher mon statut d'activité</label>
                      <input 
                        type="checkbox" 
                        id="activity-status" 
                        checked={settings.privacy.showActivityStatus}
                        onChange={(e) => handleSettingsUpdate('privacy', { showActivityStatus: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de votre portail client
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Thème</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={settings.appearance.theme === 'light' ? 'default' : 'outline'} 
                      className={settings.appearance.theme === 'light' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('appearance', { theme: 'light' })}
                    >
                      Clair
                    </Button>
                    <Button 
                      variant={settings.appearance.theme === 'dark' ? 'default' : 'outline'} 
                      className={settings.appearance.theme === 'dark' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('appearance', { theme: 'dark' })}
                    >
                      Sombre
                    </Button>
                    <Button 
                      variant={settings.appearance.theme === 'system' ? 'default' : 'outline'} 
                      className={settings.appearance.theme === 'system' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('appearance', { theme: 'system' })}
                    >
                      Système
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Taille du texte</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={settings.appearance.fontSize === 'small' ? 'default' : 'outline'} 
                      className={settings.appearance.fontSize === 'small' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('appearance', { fontSize: 'small' })}
                    >
                      Petit
                    </Button>
                    <Button 
                      variant={settings.appearance.fontSize === 'medium' ? 'default' : 'outline'} 
                      className={settings.appearance.fontSize === 'medium' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('appearance', { fontSize: 'medium' })}
                    >
                      Moyen
                    </Button>
                    <Button 
                      variant={settings.appearance.fontSize === 'large' ? 'default' : 'outline'} 
                      className={settings.appearance.fontSize === 'large' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('appearance', { fontSize: 'large' })}
                    >
                      Grand
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Accessibilité</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="reduced-motion" className="text-sm">Réduire les animations</label>
                      <input 
                        type="checkbox" 
                        id="reduced-motion" 
                        checked={settings.appearance.reducedMotion}
                        onChange={(e) => handleSettingsUpdate('appearance', { reducedMotion: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'locale' && (
            <Card>
              <CardHeader>
                <CardTitle>Langue et région</CardTitle>
                <CardDescription>
                  Définissez vos préférences de langue et de format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Langue</h4>
                  <select 
                    value={settings.locale.language}
                    onChange={(e) => handleSettingsUpdate('locale', { language: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="nl">Nederlands</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Format de l'heure</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={settings.locale.timeFormat === '12h' ? 'default' : 'outline'} 
                      className={settings.locale.timeFormat === '12h' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('locale', { timeFormat: '12h' })}
                    >
                      12 heures (AM/PM)
                    </Button>
                    <Button 
                      variant={settings.locale.timeFormat === '24h' ? 'default' : 'outline'} 
                      className={settings.locale.timeFormat === '24h' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('locale', { timeFormat: '24h' })}
                    >
                      24 heures
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Format de date</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={settings.locale.dateFormat === 'DD/MM/YYYY' ? 'default' : 'outline'} 
                      className={settings.locale.dateFormat === 'DD/MM/YYYY' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('locale', { dateFormat: 'DD/MM/YYYY' })}
                    >
                      JJ/MM/AAAA
                    </Button>
                    <Button 
                      variant={settings.locale.dateFormat === 'MM/DD/YYYY' ? 'default' : 'outline'} 
                      className={settings.locale.dateFormat === 'MM/DD/YYYY' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('locale', { dateFormat: 'MM/DD/YYYY' })}
                    >
                      MM/JJ/AAAA
                    </Button>
                    <Button 
                      variant={settings.locale.dateFormat === 'YYYY-MM-DD' ? 'default' : 'outline'} 
                      className={settings.locale.dateFormat === 'YYYY-MM-DD' ? 'bg-[#c9a227] text-white' : ''}
                      onClick={() => handleSettingsUpdate('locale', { dateFormat: 'YYYY-MM-DD' })}
                    >
                      AAAA-MM-JJ
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Fuseau horaire</h4>
                  <select 
                    value={settings.locale.timezone}
                    onChange={(e) => handleSettingsUpdate('locale', { timezone: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Europe/Brussels">Europe/Brussels</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
