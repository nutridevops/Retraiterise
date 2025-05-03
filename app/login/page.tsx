'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { LogIn, Loader2, Mail, Lock, ArrowRight, Home, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'reset'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if already logged in
  if (user) {
    const redirectTo = searchParams.get('redirectTo');
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.push('/client/dashboard');
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const success = await signIn(email, password);
      
      if (success) {
        const redirectTo = searchParams.get('redirectTo');
        router.push(redirectTo || '/client/dashboard');
        
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion.",
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
        title: "Erreur",
        description: "Veuillez saisir votre adresse email.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      await resetPassword(email);
      
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
      
      setActiveTab('login');
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-[#c9a227] transition-colors">
          <Home className="mr-1 h-4 w-4" />
          Retour au site principal
        </Link>
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            R.I.S.E. Espace Client
          </CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à vos ressources exclusives
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'reset')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="reset">Mot de passe oublié</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-gray-700"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                      id="show-password" 
                      checked={showPassword} 
                      onCheckedChange={() => setShowPassword(!showPassword)}
                    />
                    <Label 
                      htmlFor="show-password" 
                      className="text-sm cursor-pointer"
                    >
                      Afficher le mot de passe
                    </Label>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#c9a227] hover:bg-[#b18e23] text-white"
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
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="reset">
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#c9a227] hover:bg-[#b18e23] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Envoyer le lien
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
