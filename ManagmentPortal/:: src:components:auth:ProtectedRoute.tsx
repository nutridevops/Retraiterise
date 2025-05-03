// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'organizer' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading, isClient, isOrganizer, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rise-dark-green">
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-rise-gold animate-spin" />
          <p className="mt-4 text-rise-gold font-alta text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check required role if specified
  if (requiredRole) {
    // Admin can access everything
    if (isAdmin()) return <>{children}</>;

    // Organizer can access organizer routes
    if (requiredRole === 'organizer' && !isOrganizer()) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Client can access client routes
    if (requiredRole === 'client' && !isClient()) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;