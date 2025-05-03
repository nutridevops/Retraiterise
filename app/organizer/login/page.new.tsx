'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LogIn, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OrganizerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'reset'>('login');
  
  const { signInAsOrganizer, resetPassword, user, logOut } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Redirect if already logged in as organizer
  useEffect(() => {
    if (user && (user.role === 'organizer' || user.role === 'admin')) {
      router.push('/organizer/dashboard');
    }
    // Do NOT redirect clients or other roles away
  }, [user, router]);

  // UI for logged-in non-organizer (client, etc.)
  if (user && user.role !== 'organizer' && user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              R.I.S.E. Team Portal
            </CardTitle>
            <CardDescription>
              Vous êtes actuellement connecté en tant que client.<br />
              Veuillez vous déconnecter pour accéder au portail organisateur.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full bg-[#0A291C] hover:bg-[#0c3423] text-white"
              onClick={logOut}
            >
              Se déconnecter
            </Button>
            <div className="text-center text-sm">
              <Link href="/" className="text-[#c9a227] hover:underline">
                Retour au site principal
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the organizer-specific sign in method
      await signInAsOrganizer(email, password);
      
      // Explicitly redirect to organizer dashboard after successful login
      // instead of relying on the useEffect
      router.push('/organizer/dashboard');
    } catch (error: any) {
      toast({
        title: "Échec de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception pour les instructions de réinitialisation.",
      });
      setActiveTab('login');
    } catch (error: any) {
      toast({
        title: "Échec de réinitialisation",
        description: error.message || "Une erreur s'est produite lors de l'envoi de l'email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            R.I.S.E. Team Portal
          </CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au portail organisateur
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'reset')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="reset">Mot de passe oublié</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#0A291C] hover:bg-[#0c3423] text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Se connecter
                    </>
                  )}
                </Button>
                
                <div className="text-center text-sm">
                  <Link href="/" className="text-[#c9a227] hover:underline">
                    Retour au site principal
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="reset">
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#0A291C] hover:bg-[#0c3423] text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer les instructions
                    </>
                  )}
                </Button>
                
                <div className="text-center text-sm">
                  <Link href="/" className="text-[#c9a227] hover:underline">
                    Retour au site principal
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
