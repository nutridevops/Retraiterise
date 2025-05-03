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

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/client/dashboard');
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
    setLoading(true);
    setLoginError(null);
    
    try {
      await signIn(email, password);
      // Successful login will trigger the useEffect above to redirect
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'user-not-found') {
        setLoginError('Email ou mot de passe incorrect.');
      } else if (err.message === 'not-authorized') {
        setLoginError('Votre compte n\'a pas les permissions nécessaires pour accéder au portail client.');
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
    <div className="min-h-screen bg-green-950 text-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 md:px-8 flex justify-between items-center border-b border-green-900">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <Image 
              src="/logo.png" 
              alt="Rise & Retreat Logo" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span className="text-xl font-semibold text-gold">Rise & Retreat</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/organizer/login" className="text-sm hover:text-gold transition-colors">
            Accès Organisateur
          </Link>
          <Link href="/register" className="text-sm hover:text-gold transition-colors">
            Créer un compte
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="bg-green-900 rounded-lg shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gold">Connexion Client</h1>
              <p className="text-green-100 mt-2">
                Accédez à votre espace personnel
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {loginError && (
                <div className="p-3 rounded bg-red-900/50 text-red-200 text-sm">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-100">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="bg-green-800 border-green-700 focus:border-gold focus:ring-gold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-100">
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
                    className="bg-green-800 border-green-700 focus:border-gold focus:ring-gold pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-green-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-green-300" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="show-password" 
                  checked={showPassword}
                  onCheckedChange={() => setShowPassword(!showPassword)}
                  className="text-gold border-green-600 focus:ring-gold"
                />
                <label 
                  htmlFor="show-password" 
                  className="ml-2 text-sm text-green-100 cursor-pointer"
                >
                  Afficher le mot de passe
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox 
                    id="remember-me" 
                    className="text-gold border-green-600 focus:ring-gold"
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="ml-2 text-sm text-green-100 cursor-pointer"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-gold hover:underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gold hover:bg-gold/90 text-green-950 font-medium"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-green-100">
                  Pas encore de compte?{' '}
                  <Link href="/register" className="text-gold hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 md:px-8 border-t border-green-900 text-center text-sm text-green-300">
        <p> {new Date().getFullYear()} Rise & Retreat. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
