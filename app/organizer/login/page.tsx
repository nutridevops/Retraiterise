'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function OrganizerLoginPage() {
  const router = useRouter();
  const { user, signInAsOrganizer, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(true);
  
  // Check if Firebase is initialized
  useEffect(() => {
    import('@/lib/firebase').then(firebase => {
      if (!firebase.auth) {
        console.error("Firebase auth is not initialized");
        setFirebaseInitialized(false);
        setLoginError("La connexion à Firebase n'a pas pu être établie. Veuillez réessayer dans quelques instants.");
      } else {
        console.log("Firebase auth is initialized:", firebase.auth);
        setFirebaseInitialized(true);
        setLoginError(null);
      }
    }).catch(err => {
      console.error("Error importing Firebase:", err);
      setFirebaseInitialized(false);
      setLoginError("La connexion à Firebase n'a pas pu être établie. Veuillez réessayer dans quelques instants.");
    });
  }, []);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/organizer/dashboard');
    }
  }, [user, router]);
  
  // Update loginError when auth error changes
  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseInitialized) {
      setLoginError("La connexion à Firebase n'a pas pu être établie. Veuillez réessayer dans quelques instants.");
      return;
    }
    
    setLoading(true);
    setLoginError(null);
    
    try {
      await signInAsOrganizer(email, password);
      // Successful login will trigger the useEffect above to redirect
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'user-not-found') {
        setLoginError('Email ou mot de passe incorrect.');
      } else if (err.message === 'not-authorized') {
        setLoginError('Votre compte n\'a pas les permissions nécessaires pour accéder au portail organisateur.');
      } else {
        setLoginError(err.message || 'Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen bg-green-50 text-green-950 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 md:px-8 flex justify-between items-center border-b border-green-200 bg-green-900 text-white">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <Image 
              src="/logo.png" 
              alt="Retraite R.I.S.E Logo" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span className="text-xl font-semibold text-gold">Retraite R.I.S.E</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm hover:text-gold transition-colors">
            Accès Client
          </Link>
          <Link href="/register" className="text-sm hover:text-gold transition-colors">
            Créer un compte
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-green-50 to-green-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-green-200">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-green-800">Connexion Organisateur</h1>
              <p className="text-green-600 mt-2">
                Accédez à votre espace organisateur
              </p>
            </div>
            
            {!firebaseInitialized && (
              <div className="p-4 rounded bg-red-50 text-red-700 text-sm mb-6 border border-red-200">
                <p className="font-semibold text-base mb-1">Erreur de configuration Firebase</p>
                <p>La connexion à Firebase n'a pas pu être établie.</p>
                <p>Veuillez réessayer dans quelques instants.</p>
                <p className="mt-2 text-xs">Si le problème persiste, contactez l'administrateur.</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {loginError && firebaseInitialized && (
                <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="bg-green-50 border-green-300 focus:border-green-500 focus:ring-green-500 text-green-900"
                  disabled={!firebaseInitialized}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-700 font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    required
                    className="bg-green-50 border-green-300 focus:border-green-500 focus:ring-green-500 pr-10 text-green-900"
                    disabled={!firebaseInitialized}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    disabled={!firebaseInitialized}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-green-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-green-500" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="show-password" 
                  checked={showPassword}
                  onCheckedChange={() => setShowPassword(!showPassword)}
                  className="text-green-600 border-green-400 focus:ring-green-500"
                  disabled={!firebaseInitialized}
                />
                <label 
                  htmlFor="show-password" 
                  className="ml-2 text-sm text-green-700 cursor-pointer"
                >
                  Afficher le mot de passe
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox 
                    id="remember-me" 
                    className="text-green-600 border-green-400 focus:ring-green-500"
                    disabled={!firebaseInitialized}
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="ml-2 text-sm text-green-700 cursor-pointer"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-800 hover:underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              
              <Button
                type="submit"
                disabled={loading || !firebaseInitialized}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-medium"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-green-700">
                  Vous êtes un client?{' '}
                  <Link href="/login" className="text-green-600 hover:text-green-800 hover:underline">
                    Accès Client
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 md:px-8 border-t border-green-200 text-center text-sm text-green-600 bg-green-900 text-white">
        <p> {new Date().getFullYear()} Retraite R.I.S.E. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
