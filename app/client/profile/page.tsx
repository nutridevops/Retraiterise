'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { doc, getDoc, updateDoc, setDoc, Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Save, 
  Upload, 
  Calendar, 
  Target, 
  FileText, 
  Heart 
} from 'lucide-react';

interface ClientProfile {
  displayName: string;
  email: string;
  phone?: string;
  birthdate?: string;
  bio?: string;
  goals?: string;
  healthInfo?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ClientProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [profile, setProfile] = useState<ClientProfile>({
    displayName: '',
    email: '',
    phone: '',
    birthdate: '',
    bio: '',
    goals: '',
    healthInfo: '',
    avatarUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Load client profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        router.push('/client/login');
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
        const profileRef = doc(db as Firestore, 'clientProfiles', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data() as ClientProfile;
          setProfile({
            ...profileData,
            displayName: profileData.displayName || user.displayName || '',
            email: profileData.email || user.email || '',
            avatarUrl: profileData.avatarUrl || '',
          });
        } else {
          // Create a new profile if it doesn't exist
          const newProfile: ClientProfile = {
            displayName: user.displayName || '',
            email: user.email || '',
            phone: '',
            avatarUrl: '',
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

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      const profileRef = doc(db as Firestore, 'clientProfiles', user.uid);
      
      await updateDoc(profileRef, {
        ...profile,
        updatedAt: new Date(),
      });

      toast({
        title: 'Profil mis à jour',
        description: 'Votre profil a été mis à jour avec succès.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour votre profil. Veuillez réessayer.',
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
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Client</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos préférences.
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
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Avatar Section */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border shadow-sm">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
              <AvatarFallback className="text-3xl bg-[#0A291C] text-white">
                {getInitials(profile.displayName)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{profile.displayName}</h2>
            <p className="text-sm text-muted-foreground text-center">{profile.email}</p>
            <Button variant="outline" className="w-full" disabled>
              <Upload className="mr-2 h-4 w-4" />
              Changer l'avatar
            </Button>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                Informations personnelles
              </TabsTrigger>
              <TabsTrigger value="goals">
                <Target className="h-4 w-4 mr-2" />
                Objectifs
              </TabsTrigger>
              <TabsTrigger value="health">
                <Heart className="h-4 w-4 mr-2" />
                Informations de santé
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid gap-6">
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="Votre adresse email"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleInputChange}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="birthdate">Date de naissance</Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={profile.birthdate || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio || ''}
                    onChange={handleInputChange}
                    placeholder="Parlez-nous un peu de vous..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="goals">Vos objectifs</Label>
                  <Textarea
                    id="goals"
                    name="goals"
                    value={profile.goals || ''}
                    onChange={handleInputChange}
                    placeholder="Quels sont vos objectifs pour les séances avec R.I.S.E. ?"
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground">
                    Décrivez vos objectifs personnels, professionnels ou de bien-être que vous souhaitez atteindre avec l'aide de nos organisateurs.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="healthInfo">Informations de santé</Label>
                  <Textarea
                    id="healthInfo"
                    name="healthInfo"
                    value={profile.healthInfo || ''}
                    onChange={handleInputChange}
                    placeholder="Y a-t-il des informations de santé importantes que nos organisateurs devraient connaître ?"
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground">
                    Ces informations resteront confidentielles et ne seront partagées qu'avec votre organisateur pour assurer votre sécurité et votre bien-être pendant les séances.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
