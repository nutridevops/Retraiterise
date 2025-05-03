'use client';

import { useAuth, UserRole } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['client', 'organizer', 'admin'],
  requireAuth = true
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Skip during initial load
    if (loading) return;

    // If authentication is required but no user is logged in, redirect to login
    if (requireAuth && !user) {
      // Determine which login page to redirect to based on the current path
      const isOrganizerPath = pathname.startsWith('/organizer');
      const loginPath = isOrganizerPath ? '/organizer/login' : '/login';
      
      // Store the current path to redirect back after login
      // This could be implemented with localStorage or a query parameter
      
      setIsAuthorized(false);
      router.push(loginPath);
      return;
    }

    // If user doesn't have required role, redirect to appropriate dashboard
    if (user && user.role && !allowedRoles.includes(user.role)) {
      setIsAuthorized(false);
      
      // Show unauthorized access toast
      toast({
        title: "Accès non autorisé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        variant: "destructive",
      });
      
      // Redirect based on user role
      if (user.role === 'organizer' || user.role === 'admin') {
        router.push('/organizer/dashboard');
      } else {
        router.push('/client/dashboard');
      }
      return;
    }

    // User is authorized
    setIsAuthorized(true);
  }, [user, loading, router, pathname, allowedRoles, requireAuth, toast]);

  // Show loading state
  if (loading || isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-[#c9a227] mb-4" />
        <span className="text-lg font-medium">Chargement...</span>
      </div>
    );
  }

  // Show unauthorized state (will only appear briefly before redirect)
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Accès non autorisé</h2>
        <p className="text-muted-foreground mb-4">Redirection en cours...</p>
        <Loader2 className="h-6 w-6 animate-spin text-[#c9a227]" />
      </div>
    );
  }

  // If authorized, render children
  return <>{children}</>;
}
