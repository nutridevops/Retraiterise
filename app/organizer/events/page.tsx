'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { collection, query, getDocs, where, orderBy, addDoc, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format, parse, startOfWeek, getDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, Users, User, ChevronLeft, ChevronRight } from 'lucide-react';
import EventForm from './event-form';

// Event interface
interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
  clientIds: string[];
  organizerId: string;
  description?: string;
  location?: string;
  eventType: 'individual' | 'group' | 'workshop';
  capacity?: number;
  color?: string;
}

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !user.uid) return;
      
      try {
        setIsLoading(true);
        
        // Use a simple query without ordering to avoid index requirements
        console.log('Fetching events with simple query');
        const simpleEventsQuery = query(
          collection(db, 'events'),
          where('organizerId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(simpleEventsQuery);
        const eventsData: Event[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Convert Firestore timestamps to Date objects
          const start = data.start && typeof data.start === 'object' && 'toDate' in data.start 
            ? data.start.toDate() 
            : new Date(data.start);
            
          const end = data.end && typeof data.end === 'object' && 'toDate' in data.end 
            ? data.end.toDate() 
            : new Date(data.end);
          
          eventsData.push({
            id: doc.id,
            title: data.title,
            start,
            end,
            allDay: data.allDay || false,
            clientIds: data.clientIds || [],
            organizerId: data.organizerId,
            description: data.description,
            location: data.location,
            eventType: data.eventType,
            capacity: data.capacity,
            color: getEventColor(data.eventType),
          });
        });
        
        // Sort client-side instead
        console.log('Sorting events client-side');
        eventsData.sort((a, b) => a.start.getTime() - b.start.getTime());
        
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [user]);

  // Get color based on event type
  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'individual':
        return '#4f46e5'; // Indigo
      case 'group':
        return '#0891b2'; // Cyan
      case 'workshop':
        return '#c2410c'; // Orange
      default:
        return '#c9a227'; // RISE gold
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start), day)
    );
  };

  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const endDate = addDays(startOfWeek(monthEnd, { locale: fr }), 41); // 6 weeks total
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Navigate to current month
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Handle date click
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  // Handle event click
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setShowEventModal(true);
  };

  // Refresh events
  const refreshEvents = async () => {
    if (!user || !user.uid) return;
    
    try {
      setIsLoading(true);
      
      // Use a simple query without ordering to avoid index requirements
      console.log('Refreshing events with simple query');
      const simpleEventsQuery = query(
        collection(db, 'events'),
        where('organizerId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(simpleEventsQuery);
      const eventsData: Event[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Convert Firestore timestamps to Date objects
        const start = data.start && typeof data.start === 'object' && 'toDate' in data.start 
          ? data.start.toDate() 
          : new Date(data.start);
          
        const end = data.end && typeof data.end === 'object' && 'toDate' in data.end 
          ? data.end.toDate() 
          : new Date(data.end);
        
        eventsData.push({
          id: doc.id,
          title: data.title,
          start,
          end,
          allDay: data.allDay || false,
          clientIds: data.clientIds || [],
          organizerId: data.organizerId,
          description: data.description,
          location: data.location,
          eventType: data.eventType,
          capacity: data.capacity,
          color: getEventColor(data.eventType),
        });
      });
      
      // Sort client-side instead
      console.log('Sorting events client-side');
      eventsData.sort((a, b) => a.start.getTime() - b.start.getTime());
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Événements</h1>
          <p className="text-muted-foreground">
            Gérez vos événements et séances avec les clients
          </p>
        </div>
        <Button 
          className="bg-[#c9a227] hover:bg-[#b18e23]"
          onClick={() => {
            setSelectedDate(new Date());
            setSelectedEvent(null);
            setShowEventModal(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvel événement
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Calendrier des événements</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Aujourd'hui
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            <div className="text-center mt-2">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#4f46e5] mr-1"></div>
                <span className="text-xs">Séance individuelle</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#0891b2] mr-1"></div>
                <span className="text-xs">Séance de groupe</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#c2410c] mr-1"></div>
                <span className="text-xs">Atelier</span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[600px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a227]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Day names */}
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="h-10 flex items-center justify-center font-medium text-sm">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {generateCalendarDays().map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={i}
                    className={`min-h-24 p-1 border rounded-md ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${
                      isToday ? 'border-[#c9a227]' : 'border-gray-200'
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      } ${
                        isToday ? 'text-[#c9a227]' : ''
                      }`}>
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded truncate cursor-pointer"
                          style={{ backgroundColor: event.color, color: 'white' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          {format(new Date(event.start), 'HH:mm')} {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Événements à venir</TabsTrigger>
          <TabsTrigger value="past">Événements passés</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter(event => new Date(event.start) > new Date())
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .slice(0, 6)
              .map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: event.color }}
                      ></div>
                    </div>
                    <CardDescription className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(new Date(event.start), 'PPP à HH:mm', { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      {event.eventType === 'individual' ? (
                        <User className="h-3 w-3 mr-1" />
                      ) : (
                        <Users className="h-3 w-3 mr-1" />
                      )}
                      <span>
                        {event.eventType === 'individual' ? 'Séance individuelle' : 
                         event.eventType === 'group' ? 'Séance de groupe' : 'Atelier'}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm line-clamp-2">{event.description}</p>
                    )}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-[#c9a227] mt-2"
                      onClick={() => handleEventClick(event)}
                    >
                      Voir les détails
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter(event => new Date(event.start) <= new Date())
              .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
              .slice(0, 6)
              .map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: event.color }}
                      ></div>
                    </div>
                    <CardDescription className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(new Date(event.start), 'PPP à HH:mm', { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      {event.eventType === 'individual' ? (
                        <User className="h-3 w-3 mr-1" />
                      ) : (
                        <Users className="h-3 w-3 mr-1" />
                      )}
                      <span>
                        {event.eventType === 'individual' ? 'Séance individuelle' : 
                         event.eventType === 'group' ? 'Séance de groupe' : 'Atelier'}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm line-clamp-2">{event.description}</p>
                    )}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-[#c9a227] mt-2"
                      onClick={() => handleEventClick(event)}
                    >
                      Voir les détails
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Event modal */}
      {showEventModal && (
        <EventForm
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onEventAdded={refreshEvents}
          onEventUpdated={refreshEvents}
        />
      )}
    </div>
  );
}
