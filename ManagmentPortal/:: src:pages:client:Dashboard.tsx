// src/pages/client/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, FileText, MessageCircle, Clock } from 'lucide-react';
import ClientLayout from '@/components/layouts/ClientLayout';

// In a real implementation, these would come from Firebase
const mockUpcomingEvents = [
  {
    id: '1',
    title: 'Group Coaching Session',
    date: '2025-05-10T14:00:00',
    type: 'zoom'
  },
  {
    id: '2',
    title: 'Neurofitness Workshop',
    date: '2025-05-15T10:00:00',
    type: 'in-person'
  }
];

const mockResources = [
  {
    id: '1',
    title: 'RISE Method Handbook',
    type: 'pdf',
    addedDate: '2025-04-15T09:30:00'
  },
  {
    id: '2',
    title: 'Morning Routine Guide',
    type: 'pdf',
    addedDate: '2025-04-20T11:15:00'
  },
  {
    id: '3',
    title: 'Neurofitness Exercise Video',
    type: 'video',
    addedDate: '2025-04-25T14:45:00'
  }
];

const mockMessages = [
  {
    id: '1',
    sender: 'Laetitia Lusakivana',
    subject: 'Welcome to RISE',
    excerpt: 'Hello and welcome to the RISE experience! We're delighted to have you...',
    date: '2025-04-28T10:12:00',
    read: false
  },
  {
    id: '2',
    sender: 'Sandra Leguede',
    subject: 'Your Fitness Program',
    excerpt: 'I've customized a fitness program based on our initial assessment...',
    date: '2025-04-27T15:30:00',
    read: true
  }
];

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-6">
          {/* Welcome Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-alta text-rise-gold mb-2">
                {greeting}, {user?.displayName?.split(' ')[0]}
              </h1>
              <p className="text-white/80">
                Your R.I.S.E. journey continues. Here's your dashboard for today.
              </p>
            </div>
            <Button 
              className="bg-rise-gold text-rise-dark-green hover:bg-rise-gold/90"
              size="lg"
            >
              Book a Session
            </Button>
          </div>
          
          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-rise-dark-green border border-rise-gold/20 mb-8">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-rise-gold data-[state=active]:text-rise-dark-green">
                Overview
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-white data-[state=active]:bg-rise-gold data-[state=active]:text-rise-dark-green">
                Resources
              </TabsTrigger>
              <TabsTrigger value="schedule" className="text-white data-[state=active]:bg-rise-gold data-[state=active]:text-rise-dark-green">
                Schedule
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-white data-[state=active]:bg-rise-gold data-[state=active]:text-rise-dark-green">
                Messages
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Events Card */}
                <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-rise-gold flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUpcomingEvents.map(event => (
                        <div key={event.id} className="flex justify-between items-start bg-white/5 p-3 rounded-lg border border-rise-gold/10">
                          <div>
                            <h3 className="font-semibold text-white">{event.title}</h3>
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 text-rise-gold mr-1" />
                              <span className="text-sm text-white/80">
                                {new Date(event.date).toLocaleDateString('en-US', { 
                                  weekday: 'short',
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                            event.type === 'zoom' 
                              ? 'bg-blue-500/20 text-blue-200' 
                              : 'bg-green-500/20 text-green-200'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full text-rise-gold hover:text-white hover:bg-rise-gold/20">
                      View All Events
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Recent Resources Card */}
                <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-rise-gold flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockResources.map(resource => (
                        <div key={resource.id} className="flex justify-between items-start bg-white/5 p-3 rounded-lg border border-rise-gold/10">
                          <div>
                            <h3 className="font-semibold text-white">{resource.title}</h3>
                            <span className="text-sm text-white/80">
                              Added {new Date(resource.addedDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                            resource.type === 'pdf' 
                              ? 'bg-red-500/20 text-red-200' 
                              : resource.type === 'video'
                                ? 'bg-purple-500/20 text-purple-200'
                                : 'bg-orange-500/20 text-orange-200'
                          }`}>
                            {resource.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full text-rise-gold hover:text-white hover:bg-rise-gold/20">
                      View All Resources
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Messages Preview Card */}
                <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-rise-gold flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockMessages.map(message => (
                        <div key={message.id} className="flex justify-between items-start bg-white/5 p-3 rounded-lg border border-rise-gold/10">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="font-semibold text-white">{message.subject}</h3>
                              {!message.read && (
                                <span className="ml-2 w-2 h-2 bg-rise-gold rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-white/80 truncate">{message.excerpt}</p>
                            <div className="flex items-center mt-1 text-xs text-white/60">
                              <span>From: {message.sender}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(message.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-rise-gold hover:text-white hover:bg-rise-gold/20">
                            Read
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full text-rise-gold hover:text-white hover:bg-rise-gold/20">
                      View All Messages
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources">
              <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
                <CardHeader>
                  <CardTitle className="text-rise-gold">Your Resources</CardTitle>
                  <CardDescription className="text-white/80">
                    Access all your R.I.S.E. resources organized by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Resource content would go here - could be a more detailed component */}
                  <p className="text-white">Resource content placeholder - expand this with a ResourceList component</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
                <CardHeader>
                  <CardTitle className="text-rise-gold">Your Schedule</CardTitle>
                  <CardDescription className="text-white/80">
                    View and manage your upcoming appointments and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Calendly embed would go here */}
                  <div className="bg-white/10 p-4 rounded-md border border-rise-gold/20 text-center text-white">
                    Calendly Integration Placeholder
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card className="bg-rise-dark-green/30 backdrop-blur-sm border-rise-gold/30">
                <CardHeader>
                  <CardTitle className="text-rise-gold">Your Messages</CardTitle>
                  <CardDescription className="text-white/80">
                    Communicate with the R.I.S.E. team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Message content would go here - could be a more detailed component */}
                  <p className="text-white">Message system placeholder - expand this with a MessageList component</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;