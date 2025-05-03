// src/components/layouts/ClientLayout.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { 
  BookOpen, 
  Calendar, 
  Home, 
  LogOut, 
  Menu, 
  MessageCircle, 
  User, 
  X,
  Bell,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/client/dashboard', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: 'Resources', 
      path: '/client/resources', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Bookings', 
      path: '/client/bookings', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      name: 'Messages', 
      path: '/client/messages', 
      icon: <MessageCircle className="h-5 w-5" /> 
    },
    { 
      name: 'Program', 
      path: '/client/program', 
      icon: <BookOpen className="h-5 w-5" /> 
    }
  ];

  // Function to get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.displayName) return '?';
    
    return user.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem signing out",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rise-dark-green to-rise-medium-green">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-rise-dark-green/90 backdrop-blur-sm border-b border-rise-gold/20">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/client/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/085c276e-2ff2-4122-8590-8c48682c78c8.png" 
                alt="Logo R.I.S.E" 
                className="h-10 w-10 mr-2"
              />
              <span className="text-rise-gold font-alta text-xl">R.I.S.E. Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  location.pathname === item.path
                    ? 'bg-rise-gold/20 text-rise-gold'
                    : 'text-white hover:bg-rise-gold/10 hover:text-rise-gold'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu and Mobile Menu Toggle */}
          <div className="flex items-center">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white mr-2">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto py-2">
                  <div className="px-4 py-2 text-sm">
                    <div className="font-semibold">New resource available</div>
                    <div className="text-muted-foreground text-xs">
                      Breathing Techniques Guide has been added to your resources.
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
                  </div>
                  <div className="px-4 py-2 text-sm bg-muted/30">
                    <div className="font-semibold">Upcoming session reminder</div>
                    <div className="text-muted-foreground text-xs">
                      Your coaching session with Laetitia starts in 24 hours.
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">12 hours ago</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-center cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-rise-gold text-rise-dark-green">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/client/profile" className="flex cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2 md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-rise-dark-green border-t border-rise-gold/20">
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    location.pathname === item.path
                      ? 'bg-rise-gold/20 text-rise-gold'
                      : 'text-white hover:bg-rise-gold/10 hover:text-rise-gold'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-rise-gold/20">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={user?.profileImageUrl} />
                      <AvatarFallback className="bg-rise-gold text-rise-dark-green">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.displayName}</div>
                    <div className="text-sm font-medium text-white/60">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/client/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-rise-gold/10 hover:text-rise-gold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-rise-gold/10 hover:text-red-300"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-rise-dark-green border-t border-rise-gold/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/085c276e-2ff2-4122-8590-8c48682c78c8.png" 
                alt="Logo R.I.S.E" 
                className="h-10 w-10 mx-auto md:mx-0"
              />
            </div>
            <div className="text-center md:text-right text-white/60 text-sm">
              <p>&copy; {new Date().getFullYear()} R.I.S.E. All rights reserved.</p>
              <p>
                <a href="#" className="text-rise-gold hover:underline">Privacy Policy</a>
                {' • '}
                <a href="#" className="text-rise-gold hover:underline">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;