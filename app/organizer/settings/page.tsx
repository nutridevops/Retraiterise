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
  Calendar, 
  Save, 
  Loader2,
  Globe,
  Clock
} from 'lucide-react';

// Import settings components
import { NotificationSettings } from '@/components/organizer/settings/NotificationSettings';
import { PrivacySettings } from '@/components/organizer/settings/PrivacySettings';
import { AppearanceSettings } from '@/components/organizer/settings/AppearanceSettings';
import { CalendarSettings } from '@/components/organizer/settings/CalendarSettings';
import { LocaleSettings } from '@/components/organizer/settings/LocaleSettings';

interface OrganizerSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    browser: boolean;
    newBooking: boolean;
    bookingCancellation: boolean;
    bookingReminder: boolean;
    clientMessages: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    showProfile: boolean;
    showAvailability: boolean;
    showContactInfo: boolean;
    allowClientReviews: boolean;
    allowDirectMessages: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    colorScheme: 'default' | 'blue' | 'green' | 'purple' | 'orange';
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
    compactView: boolean;
  };
  calendar: {
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
  locale: {
    language: string;
    timeFormat: '12h' | '24h';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timezone: string;
    currency: string;
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
  const [settings, setSettings] = useState<OrganizerSettings>({
    notifications: {
      email: true,
      sms: false,
      browser: true,
      newBooking: true,
      bookingCancellation: true,
      bookingReminder: true,
      clientMessages: true,
      systemUpdates: true,
    },
    privacy: {
      showProfile: true,
      showAvailability: true,
      showContactInfo: false,
      allowClientReviews: true,
      allowDirectMessages: true,
    },
    appearance: {
      theme: 'system',
      colorScheme: 'default',
      fontSize: 'medium',
      reducedMotion: false,
      compactView: false,
    },
    calendar: {
      defaultView: 'week',
      startOfWeek: 1, // Monday
      workingHours: {
        start: '09:00',
        end: '18:00',
      },
      showDeclinedEvents: false,
      autoAcceptBookings: false,
      bufferTime: 15, // 15 minutes
    },
    locale: {
      language: 'fr',
      timeFormat: '24h',
      dateFormat: 'DD/MM/YYYY',
      timezone: 'Europe/Paris',
      currency: 'EUR',
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
          description: 'Problème de connexion à la base de données. Veuillez réessayer.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsLoading(true);
        const settingsRef = doc(db as Firestore, 'organizerSettings', user.uid);
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const settingsData = settingsSnap.data() as OrganizerSettings;
          setSettings({
            ...settingsData,
            userId: user.uid,
            updatedAt: new Date(),
          });
        } else {
          // Create default settings if they don't exist
          const defaultSettings: OrganizerSettings = {
            ...settings,
            userId: user.uid,
            updatedAt: new Date(),
          };
          
          await setDoc(settingsRef, defaultSettings);
          setSettings(defaultSettings);
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
    if (!user) return;
    
    if (!db) {
      console.error('Firestore instance is undefined');
      toast({
        title: 'Erreur',
        description: 'Problème de connexion à la base de données. Veuillez réessayer.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      const settingsRef = doc(db as Firestore, 'organizerSettings', user.uid);
      
      // Update settings with the new data
      const updatedSettings = {
        ...settings,
        updatedAt: new Date(),
      };
      
      await updateDoc(settingsRef, updatedSettings);
      
      // Apply settings to the application
      applySettings(updatedSettings);
      
      toast({
        title: 'Paramètres mis à jour',
        description: 'Vos paramètres ont été enregistrés avec succès.',
      });
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
  const applySettings = (settings: OrganizerSettings) => {
    // Apply theme
    const root = document.documentElement;
    if (settings.appearance.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.appearance.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply color scheme
    root.setAttribute('data-color-scheme', settings.appearance.colorScheme);

    // Apply font size
    if (settings.appearance.fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (settings.appearance.fontSize === 'medium') {
      root.style.fontSize = '16px';
    } else {
      root.style.fontSize = '18px';
    }

    // Apply reduced motion
    if (settings.appearance.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Apply compact view
    if (settings.appearance.compactView) {
      root.classList.add('compact-view');
    } else {
      root.classList.remove('compact-view');
    }

    // Store settings in localStorage for quick access
    localStorage.setItem('organizerSettings', JSON.stringify(settings));
  };

  // Handle settings updates
  const handleSettingsUpdate = (category: string, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof OrganizerSettings],
        ...updates
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et personnalisez votre expérience
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
              Enregistrer les paramètres
            </>
          )}
        </Button>
      </div>

      <Separator />

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
                variant={activeTab === 'calendar' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('calendar')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendrier
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
            <NotificationSettings 
              settings={settings.notifications} 
              onUpdate={(updates) => handleSettingsUpdate('notifications', updates)} 
            />
          )}
          
          {activeTab === 'privacy' && (
            <PrivacySettings 
              settings={settings.privacy} 
              onUpdate={(updates) => handleSettingsUpdate('privacy', updates)} 
            />
          )}
          
          {activeTab === 'appearance' && (
            <AppearanceSettings 
              settings={settings.appearance} 
              onUpdate={(updates) => handleSettingsUpdate('appearance', updates)} 
            />
          )}
          
          {activeTab === 'calendar' && (
            <CalendarSettings 
              settings={settings.calendar} 
              onUpdate={(updates) => handleSettingsUpdate('calendar', updates)} 
            />
          )}
          
          {activeTab === 'locale' && (
            <LocaleSettings 
              settings={settings.locale} 
              onUpdate={(updates) => handleSettingsUpdate('locale', updates)} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
