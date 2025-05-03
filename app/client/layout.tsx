'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import { MessageNotification } from '@/components/MessageNotification';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
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
import { User, LogOut, Settings, Home } from 'lucide-react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only allow client, organizer, and admin roles to access client portal
  const allowedRoles: UserRole[] = ['client', 'organizer', 'admin'];
  const pathname = usePathname();
  const { user, logOut } = useAuth();

  // Function to check if a link is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex min-h-screen flex-col">
        {/* Client portal header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/client/dashboard" className="flex items-center space-x-2">
                <span className="font-bold text-xl text-[#c9a227]">R.I.S.E. Espace Client</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6 mx-6">
              <Link
                href="/client/dashboard"
                className={`text-sm font-medium transition-colors hover:text-[#c9a227] ${
                  isActive('/client/dashboard') ? 'text-[#c9a227] font-semibold' : 'text-foreground/80'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/client/resources"
                className={`text-sm font-medium transition-colors hover:text-[#c9a227] ${
                  isActive('/client/resources') ? 'text-[#c9a227] font-semibold' : 'text-foreground/80'
                }`}
              >
                Resources
              </Link>
              <Link
                href="/client/booking"
                className={`text-sm font-medium transition-colors hover:text-[#c9a227] ${
                  isActive('/client/booking') ? 'text-[#c9a227] font-semibold' : 'text-foreground/80'
                }`}
              >
                Booking
              </Link>
              <Link
                href="/client/messages"
                className={`text-sm font-medium transition-colors hover:text-[#c9a227] relative ${
                  isActive('/client/messages') ? 'text-[#c9a227] font-semibold' : 'text-foreground/80'
                }`}
              >
                Messages
                <MessageNotification />
              </Link>
              <Link
                href="/documentation/client"
                className={`text-sm font-medium transition-colors hover:text-[#c9a227] ${
                  isActive('/documentation/client') ? 'text-[#c9a227] font-semibold' : 'text-foreground/80'
                }`}
              >
                Documentation
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profileImageUrl || ''} alt={user?.displayName || 'User'} />
                      <AvatarFallback className="bg-[#0A291C] text-white">
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
                    <Link href="/client/profile" className="flex w-full cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/client/settings" className="flex w-full cursor-pointer items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={logOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t py-6 bg-background">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} R.I.S.E. Retreat. Tous droits réservés.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Résilience · Intuition · Strength · Energy
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
