'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, useAuth } from '@/lib/auth';
import { MessageNotification } from '@/components/MessageNotification';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  LogOut, 
  Settings, 
  User, 
  Home, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  PlusCircle 
} from 'lucide-react';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only allow organizer and admin roles to access organizer portal
  const allowedRoles: UserRole[] = ['organizer', 'admin'];
  const { user, logOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Skip protection for the login page
  const isLoginPage = pathname === '/organizer/login';

  // Function to check if a link is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Redirect if user is not an organizer
  useEffect(() => {
    if (loading) return; // Wait until user is loaded
    if (user && user.role !== 'organizer' && user.role !== 'admin' && !isLoginPage) {
      router.push('/client/dashboard');
    }
  }, [user, loading, isLoginPage, router]);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  // For login page, just render the children without the layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex min-h-screen flex-col bg-[#f8f7f2]">
        {/* Organizer portal header - with dark green background */}
        <header className="sticky top-0 z-50 border-b bg-[#0A291C] text-white shadow-md">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/organizer/dashboard" className="flex items-center space-x-2">
                <Image 
                  src="/images/rise-logo-new.png" 
                  alt="RISE Logo" 
                  width={36} 
                  height={36} 
                  className="mr-1"
                />
                <span className="font-bold text-xl text-[#D4AF37]">R.I.S.E. Team Portal</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6 mx-6">
              <Link
                href="/organizer/dashboard"
                className={`text-sm font-medium transition-colors hover:text-[#D4AF37] flex items-center ${
                  isActive('/organizer/dashboard') ? 'text-[#D4AF37] font-semibold' : 'text-white/80'
                }`}
              >
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/organizer/clients"
                className={`text-sm font-medium transition-colors hover:text-[#D4AF37] flex items-center ${
                  isActive('/organizer/clients') ? 'text-[#D4AF37] font-semibold' : 'text-white/80'
                }`}
              >
                <Users className="mr-1 h-4 w-4" />
                Clients
              </Link>
              <Link
                href="/organizer/resources"
                className={`text-sm font-medium transition-colors hover:text-[#D4AF37] flex items-center ${
                  isActive('/organizer/resources') ? 'text-[#D4AF37] font-semibold' : 'text-white/80'
                }`}
              >
                <FileText className="mr-1 h-4 w-4" />
                Resources
              </Link>
              <Link
                href="/documentation/organizer"
                className={`text-sm font-medium transition-colors hover:text-[#D4AF37] flex items-center ${
                  isActive('/documentation/organizer') ? 'text-[#D4AF37] font-semibold' : 'text-white/80'
                }`}
              >
                <FileText className="mr-1 h-4 w-4" />
                Documentation
              </Link>
              <Link
                href="/organizer/events"
                className={`text-sm font-medium transition-colors hover:text-[#D4AF37] flex items-center ${
                  isActive('/organizer/events') ? 'text-[#D4AF37] font-semibold' : 'text-white/80'
                }`}
              >
                <Calendar className="mr-1 h-4 w-4" />
                Events
              </Link>
              <Link
                href="/organizer/messages"
                className={`text-sm font-medium transition-colors hover:text-[#D4AF37] flex items-center ${
                  isActive('/organizer/messages') ? 'text-[#D4AF37] font-semibold' : 'text-white/80'
                }`}
              >
                <MessageSquare className="mr-1 h-4 w-4" />
                Messages
                <MessageNotification />
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin/create-organizer"
                  className={`text-sm font-medium transition-colors hover:text-[#D4AF37] flex items-center ${
                    isActive('/admin/create-organizer') ? 'text-[#D4AF37] font-semibold' : 'text-white/80'
                  }`}
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Add Organizer
                </Link>
              )}
            </nav>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-[#0c3423]">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" alt={user?.displayName || 'User'} />
                      <AvatarFallback className="bg-[#D4AF37] text-[#0A291C] font-semibold">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1 capitalize">{user?.role || 'Organizer'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex w-full cursor-pointer items-center">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Site principal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/organizer/profile" className="flex w-full cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/organizer/settings" className="flex w-full cursor-pointer items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        <main className="flex-1 py-6">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>
        
        <footer className="border-t border-gray-200 bg-[#0A291C] text-white py-6">
          <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm leading-loose md:text-left">
              &copy; {new Date().getFullYear()} R.I.S.E. Retreat. Tous droits réservés.
            </p>
            <p className="text-center text-sm text-white/60">
              Résilience · Intuition · Strength · Energy
            </p>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-[#D4AF37] hover:underline">
                Retour au site principal
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
