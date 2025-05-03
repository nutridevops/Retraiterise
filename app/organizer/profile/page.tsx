'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { doc, getDoc, updateDoc, setDoc, Firestore, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Loader2, 
  User, 
  Save, 
  Upload, 
  Calendar, 
  MapPin, 
  Clock, 
  Briefcase,
  FileText
} from 'lucide-react';
import { OrganizerProfileTabs } from '@/components/organizer/OrganizerProfileTabs';
import { OrganizerProfile } from '@/lib/types';

export default function OrganizerProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [profile, setProfile] = useState<OrganizerProfile>({
    displayName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    specialties: [],
    certifications: [],
    languages: [],
    experience: '',
    education: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    availability: {},
    sessionTypes: [],
    avatarUrl: '',
    coverImageUrl: '',
    socialLinks: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Load organizer profile
  useEffect(() => {
    const loadProfile = async () => {
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
        const profileRef = doc(db as Firestore, 'organizerProfiles', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data() as OrganizerProfile;
          // Convert Firestore timestamps to Date objects if needed
          const createdAtDate = profileData.createdAt instanceof Date 
            ? profileData.createdAt 
            : new Date();
            
          const updatedAtDate = profileData.updatedAt instanceof Date 
            ? profileData.updatedAt 
            : new Date();
            
          setProfile({
            ...profileData,
            displayName: profileData.displayName || user.displayName || '',
            email: profileData.email || user.email || '',
            avatarUrl: profileData.avatarUrl || '',
            createdAt: createdAtDate,
            updatedAt: updatedAtDate,
          });
        } else {
          // Create a new profile if it doesn't exist
          const newProfile: OrganizerProfile = {
            displayName: user.displayName || '',
            email: user.email || '',
            phone: '',
            title: 'Organisateur R.I.S.E.',
            bio: '',
            specialties: [],
            certifications: [],
            languages: ['Français'],
            experience: '',
            education: '',
            address: '',
            city: '',
            postalCode: '',
            country: 'France',
            availability: {},
            sessionTypes: [],
            avatarUrl: '',
            coverImageUrl: '',
            socialLinks: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          await setDoc(profileRef, newProfile);
          setProfile(newProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger votre profil. Veuillez réessayer.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, router, toast]);

  // Save profile
  const saveProfile = async () => {
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
      const profileRef = doc(db as Firestore, 'organizerProfiles', user.uid);
      
      // Update the profile with the new data
      const updatedProfile = {
        ...profile,
        updatedAt: new Date(),
      };
      
      await updateDoc(profileRef, updatedProfile);
      
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre profil. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Handle profile updates
  const handleProfileUpdate = (updatedProfile: Partial<OrganizerProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...updatedProfile
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
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div>
        <Button 
          onClick={saveProfile} 
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

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
              <AvatarFallback className="text-2xl bg-[#c9a227] text-white">
                {getInitials(profile.displayName)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Changer la photo
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Navigation</h3>
            <div className="space-y-1">
              <Button 
                variant={activeTab === 'personal' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('personal')}
              >
                <User className="mr-2 h-4 w-4" />
                Informations personnelles
              </Button>
              <Button 
                variant={activeTab === 'professional' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('professional')}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Informations professionnelles
              </Button>
              <Button 
                variant={activeTab === 'location' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('location')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Adresse & Contact
              </Button>
              <Button 
                variant={activeTab === 'sessions' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('sessions')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Types de séances
              </Button>
              <Button 
                variant={activeTab === 'availability' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('availability')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Disponibilités
              </Button>
              <Button 
                variant={activeTab === 'social' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('social')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Liens sociaux
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OrganizerProfileTabs 
            profile={profile}
            activeTab={activeTab}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
      </div>
    </div>
  );
}
