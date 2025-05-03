// src/components/layouts/OrganizerLayout.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageCircle, 
  Home, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  CheckSquare,
  LayoutDashboard,
  Upload
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

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

const OrganizerLayout: React.FC<OrganizerLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/organizer/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Clients', 
      path: '/organizer/clients', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Resources', 
      path: '/organizer/resources', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Events', 
      path: '/organizer/events', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      name: 'Bookings', 
      path: '/organizer/bookings', 
      icon: <CheckSquare className="h-5 w-5" /> 
    },
    { 
      name: 'Messages', 
      path: '/organizer/messages', 
      icon: <MessageCircle className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/organizer/settings', 
      icon: <Settings className="h-5 w-5" /> 
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
        <div className="px-4 flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/organizer/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/085c276e-2ff2-4122-8590-8c48682c78c8.png" 
                alt="Logo R.I.S.E" 
                className="h-10 w-10 mr-2"
              />
              <span className="text-rise-gold font-alta text-xl">R.I.S.E. Admin</span>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/organizer/resources/new')}
            >
              <Upload className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/organizer/events/new')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Create Event
            </Button>
          </div>

          {/* User Menu and Mobile Menu Toggle */}
          <div className="flex items-center">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white mr-2 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto py-2">
                  <div className="px-4 py-2 text-sm bg-red-500/10">
                    <div className="font-semibold">Client Follow-up Required</div>
                    <div className="text-muted-foreground text-xs">
                      2 clients haven't logged in for more than 2 weeks
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">15 minutes ago</div>
                  </div>
                  <div className="px-4 py-2 text-sm">
                    <div className="font-semibold">New Message</div>
                    <div className="text-muted-foreground text-xs">
                      Sophie Martin has sent you a message
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
                  </div>
                  <div className="px-4 py-2 text-sm">
                    <div className="font-semibold">Upcoming Session</div>
                    <div className="text-muted-foreground text-xs">
                      Group coaching session starts in 24 hours
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">3 hours ago</div>
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
                <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-muted-foreground -mt-2">
                  {user?.role === 'admin' ? 'Administrator' : 'Organizer'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/organizer/profile" className="flex cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/organizer/settings" className="flex cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
                    to="/organizer/profile"
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

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation - Desktop */}
        <aside 
          className={`hidden md:block bg-rise-dark-green border-r border-rise-gold/20 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="h-full flex flex-col justify-between py-6">
            <div className="px-3">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center py-2 px-3 rounded-md ${
                      location.pathname === item.path
                        ? 'bg-rise-gold/20 text-rise-gold'
                        : 'text-white hover:bg-rise-gold/10 hover:text-rise-gold'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {item.icon}
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <div className="px-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-white hover:bg-rise-gold/10 hover:text-rise-gold"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed ? (
                  <Menu className="h-5 w-5" />
                ) : (
                  <div className="flex items-center">
                    <Menu className="h-5 w-5 mr-2" />
                    <span>Collapse</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-rise-dark-green border-t border-rise-gold/20 py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/085c276e-2ff2-4122-8590-8c48682c78c8.png" 
              alt="Logo R.I.S.E" 
              className="h-8 w-8 mr-2"
            />
            <span className="text-white/60 text-sm">R.I.S.E. Administration Panel</span>
          </div>
          <div className="text-white/60 text-sm">
            <span>&copy; {new Date().getFullYear()} R.I.S.E. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrganizerLayout;