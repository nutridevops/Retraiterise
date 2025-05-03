// src/pages/organizer/Dashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  FileText,
  Calendar,
  MessageCircle,
  ChevronRight,
  Upload,
  Bell,
  BarChart3,
} from 'lucide-react';
import OrganizerLayout from '@/components/layouts/OrganizerLayout';
import { Progress } from '@/components/ui/progress';

// Mock data - would come from Firestore in a real implementation
const mockStats = {
  totalClients: 24,
  activeClients: 18,
  totalResources: 45,
  resourcesAccessed: 178,
  unreadMessages: 5,
  upcomingEvents: 3
};

const mockClients = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@example.com',
    joinDate: '2025-04-01T10:00:00',
    lastLogin: '2025-04-28T15:30:00',
    progress: 75,
    status: 'active'
  },
  {
    id: '2',
    name: 'Jean Lefevre',
    email: 'jean.lefevre@example.com',
    joinDate: '2025-04-05T14:30:00',
    lastLogin: '2025-04-27T09:15:00',
    progress: 40,
    status: 'active'
  },
  {
    id: '3',
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    joinDate: '2025-04-10T11:45:00',
    lastLogin: '2025-04-20T16:20:00',
    progress: 60,
    status: 'inactive'
  }
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'resource_accessed',
    client: 'Marie Dubois',
    resourceName: 'RISE Method Handbook',
    timestamp: '2025-04-28T14:25:00'
  },
  {
    id: '2',
    type: 'booking_created',
    client: 'Jean Lefevre',
    eventName: 'One-on-one Coaching',
    timestamp: '2025-04-28T12:10:00'
  },
  {
    id: '3',
    type: 'message_received',
    client: 'Sophie Martin',
    subject: 'Question about exercises',
    timestamp: '2025-04-28T09:45:00'
  },
  {
    id: '4',
    type: 'resource_accessed',
    client: 'Jean Lefevre',
    resourceName: 'Morning Routine Guide',
    timestamp: '2025-04-27T16:30:00'
  }
];

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <OrganizerLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-6">
          {/* Welcome Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-alta text-rise-gold mb-2">
                Organizer Dashboard
              </h1>
              <p className="text-white/80">
                Welcome back, {user?.displayName}. Here's an overview of your R.I.S.E. platform.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button className="bg-white/10 text-white hover:bg-white/20 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Add Resource
              </Button>
              <Button className="bg-rise-gold text-rise-dark-green hover:bg-rise-gold/90 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Event
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white/60">Total Clients</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{mockStats.totalClients}</h3>
                    <p className="text-xs text-rise-gold mt-1">
                      {Math.round((mockStats.activeClients / mockStats.totalClients) * 100)}% active
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-rise-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white/60">Total Resources</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{mockStats.totalResources}</h3>
                    <p className="text-xs text-rise-gold mt-1">
                      {mockStats.resourcesAccessed} total accesses
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-rise-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white/60">Unread Messages</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{mockStats.unreadMessages}</h3>
                    <p className="text-xs text-rise-gold mt-1">
                      {mockStats.unreadMessages > 0 ? 'Requires attention' : 'All caught up!'}
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-rise-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white/60">Upcoming Events</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{mockStats.upcomingEvents}</h3>
                    <p className="text-xs text-rise-gold mt-1">
                      Next: Group Session (Tomorrow)
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-rise-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Overview */}
            <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30 lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-rise-gold">Recent Client Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-rise-gold hover:text-white hover:bg-rise-gold/20">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map(activity => (
                    <div key={activity.id} className="bg-white/5 p-3 rounded-lg border border-rise-gold/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            {activity.type === 'resource_accessed' && (
                              <FileText className="h-4 w-4 text-blue-400 mr-2" />
                            )}
                            {activity.type === 'booking_created' && (
                              <Calendar className="h-4 w-4 text-green-400 mr-2" />
                            )}
                            {activity.type === 'message_received' && (
                              <MessageCircle className="h-4 w-4 text-purple-400 mr-2" />
                            )}
                            <h3 className="font-semibold text-white">{activity.client}</h3>
                          </div>
                          <p className="text-sm text-white/80 mt-1">
                            {activity.type === 'resource_accessed' && `Accessed: ${activity.resourceName}`}
                            {activity.type === 'booking_created' && `Booked: ${activity.eventName}`}
                            {activity.type === 'message_received' && `Message: ${activity.subject}`}
                          </p>
                        </div>
                        <span className="text-xs text-white/60">
                          {new Date(activity.timestamp).toLocaleString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Client List */}
            <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-rise-gold">Client Progress</CardTitle>
                  <Button variant="ghost" size="sm" className="text-rise-gold hover:text-white hover:bg-rise-gold/20">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClients.map(client => (
                    <div key={client.id} className="bg-white/5 p-3 rounded-lg border border-rise-gold/10">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-white">{client.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          client.status === 'active' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {client.status}
                        </span>
                      </div>
                      <div className="mb-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-white/60">Program Progress</span>
                          <span className="text-xs font-medium text-rise-gold">{client.progress}%</span>
                        </div>
                        <Progress value={client.progress} className="h-2 bg-white/10" />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-white/60">Last login: {new Date(client.lastLogin).toLocaleDateString()}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="h-4 w-4 text-rise-gold" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resource Analytics */}
            <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
              <CardHeader>
                <CardTitle className="text-rise-gold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resource Analytics
                </CardTitle>
                <CardDescription className="text-white/60">
                  Most accessed resources in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">RISE Method Handbook</span>
                      <span className="text-rise-gold">68 accesses</span>
                    </div>
                    <Progress value={85} className="h-2 bg-white/10" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Morning Routine Guide</span>
                      <span className="text-rise-gold">52 accesses</span>
                    </div>
                    <Progress value={65} className="h-2 bg-white/10" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Neurofitness Exercise Video</span>
                      <span className="text-rise-gold">41 accesses</span>
                    </div>
                    <Progress value={51} className="h-2 bg-white/10" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Breathing Techniques PDF</span>
                      <span className="text-rise-gold">34 accesses</span>
                    </div>
                    <Progress value={43} className="h-2 bg-white/10" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-rise-gold hover:text-white hover:bg-rise-gold/20">
                  View Full Analytics
                </Button>
              </CardFooter>
            </Card>
            
            {/* Alerts & Notifications */}
            <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
              <CardHeader>
                <CardTitle className="text-rise-gold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alerts & Tasks
                </CardTitle>
                <CardDescription className="text-white/60">
                  Items requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                    <h3 className="font-semibold text-red-300 mb-1">Client Follow-up Required</h3>
                    <p className="text-sm text-white/80">2 clients haven't logged in for more than 2 weeks</p>
                    <div className="flex justify-end mt-2">
                      <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                        View Clients
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                    <h3 className="font-semibold text-yellow-300 mb-1">Unreviewed Messages</h3>
                    <p className="text-sm text-white/80">5 client messages are waiting for your response</p>
                    <div className="flex justify-end mt-2">
                      <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                        View Messages
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                    <h3 className="font-semibold text-blue-300 mb-1">Upcoming Group Session</h3>
                    <p className="text-sm text-white/80">Session scheduled for tomorrow at 14:00</p>
                    <div className="flex justify-end mt-2">
                      <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                        Prepare Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-rise-gold hover:text-white hover:bg-rise-gold/20">
                  View All Tasks
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
};

export default OrganizerDashboard;