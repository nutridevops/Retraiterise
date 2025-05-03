'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileText, MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '@/components/ClientOnly';
import { RecentMessagesWidget } from '@/components/RecentMessagesWidget';
import { OrganizerSelector } from '@/components/OrganizerSelector';
import { Organizer } from '@/lib/bookingService';
import { doc, getDoc, updateDoc, setDoc, Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  
  // Load the preferred organizer when the component mounts
  useEffect(() => {
    const loadPreferredOrganizer = async () => {
      if (!user || !db) return;
      
      try {
        const profileRef = doc(db as Firestore, 'clientProfiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          if (profileData.preferredOrganizerId) {
            setSelectedOrganizerId(profileData.preferredOrganizerId);
          }
        }
      } catch (error) {
        console.error('Error loading preferred organizer:', error);
      }
    };
    
    loadPreferredOrganizer();
  }, [user]);
  
  // Handle organizer selection
  const handleOrganizerSelect = async (organizer: Organizer) => {
    setSelectedOrganizerId(organizer.id);
    
    if (!user || !db) return;
    
    try {
      setIsSaving(true);
      const profileRef = doc(db as Firestore, 'clientProfiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        // Update existing profile
        await updateDoc(profileRef, {
          preferredOrganizerId: organizer.id,
          updatedAt: new Date()
        });
      } else {
        // Create new profile
        await setDoc(profileRef, {
          displayName: user.displayName || '',
          email: user.email || '',
          preferredOrganizerId: organizer.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      toast({
        title: "Organisateur sélectionné",
        description: `Vous avez sélectionné ${organizer.name} comme votre organisateur préféré.`,
      });
    } catch (error) {
      console.error('Error saving preferred organizer:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre choix d'organisateur. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenue, {user?.displayName || 'Client'}
        </h1>
        <p className="text-muted-foreground">
          Votre portail personnel pour accéder aux ressources et services exclusifs de R.I.S.E.
        </p>
      </div>
      
      {/* Organizer Selector */}
      <div className="mb-8">
        <Card className="border-[#c9a227]/20">
          <CardHeader>
            <CardTitle>Votre organisateur dédié</CardTitle>
            <CardDescription>
              Sélectionnez l'organisateur avec lequel vous préférez communiquer et prendre rendez-vous.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizerSelector
              selectedOrganizerId={selectedOrganizerId}
              onOrganizerSelect={handleOrganizerSelect}
              showTitle={false}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Resources Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ressources</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Ressources</div>
            <p className="text-xs text-muted-foreground">
              Accédez à vos documents, vidéos et guides exclusifs
            </p>
            <Button asChild className="mt-4 w-full bg-[#c9a227] hover:bg-[#b18e23] text-white">
              <Link href="/client/resources">
                Voir les ressources
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Sessions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions à venir</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Sessions</div>
            <p className="text-xs text-muted-foreground">
              Vos prochains rendez-vous et ateliers
            </p>
            <Button asChild className="mt-4 w-full bg-[#c9a227] hover:bg-[#b18e23] text-white">
              <Link href="/client/booking">
                Gérer les réservations
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Messages Card */}
        <Card className="lg:col-span-1">
          <ClientOnly>
            <RecentMessagesWidget portalType="client" maxMessages={3} />
          </ClientOnly>
        </Card>
      </div>

      {/* Recent Activity */}
      <h2 className="mt-10 mb-4 text-xl font-semibold">Activité récente</h2>
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 flex items-center">
            <Clock className="h-5 w-5 mr-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Nouvelle ressource ajoutée</p>
              <p className="text-sm text-muted-foreground">Guide de méditation - 28 Avril 2025</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <Clock className="h-5 w-5 mr-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Session réservée</p>
              <p className="text-sm text-muted-foreground">Coaching individuel - 5 Mai 2025, 14:00</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <Clock className="h-5 w-5 mr-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Message reçu</p>
              <p className="text-sm text-muted-foreground">De: Sophie Martin - 27 Avril 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
