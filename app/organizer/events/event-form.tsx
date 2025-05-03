'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where, addDoc, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Clock, MapPin, Users, X, Trash2 } from 'lucide-react';
import { RiseUser } from '@/lib/types';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
  selectedEvent?: any | null;
  onEventAdded?: () => void;
  onEventUpdated?: () => void;
}

export default function EventForm({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
  onEventAdded,
  onEventUpdated,
}: EventFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState<'individual' | 'group' | 'workshop'>('individual');
  const [capacity, setCapacity] = useState('');
  const [clients, setClients] = useState<RiseUser[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Fetch clients for selection
  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      
      try {
        const clientsRef = collection(db, 'users');
        const clientsQuery = query(clientsRef, where('role', '==', 'client'));
        const querySnapshot = await getDocs(clientsQuery);
        
        const clientsData: RiseUser[] = [];
        querySnapshot.forEach((doc) => {
          clientsData.push({ id: doc.id, ...doc.data() } as RiseUser);
        });
        
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    
    fetchClients();
  }, [user]);

  // Populate form with selected event data when editing
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || '');
      setDescription(selectedEvent.description || '');
      setDate(new Date(selectedEvent.start));
      setStartTime(format(new Date(selectedEvent.start), 'HH:mm'));
      setEndTime(format(new Date(selectedEvent.end), 'HH:mm'));
      setLocation(selectedEvent.location || '');
      setEventType(selectedEvent.eventType || 'individual');
      setCapacity(selectedEvent.capacity?.toString() || '');
      setSelectedClients(selectedEvent.clientIds || []);
    }
  }, [selectedEvent]);

  // Handle client selection
  const handleClientToggle = (clientId: string) => {
    if (eventType === 'individual') {
      setSelectedClients([clientId]);
    } else {
      setSelectedClients(prev => 
        prev.includes(clientId)
          ? prev.filter(id => id !== clientId)
          : [...prev, clientId]
      );
    }
  };

  // Create or update event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.uid || !date) return;
    
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }
    
    if (selectedClients.length === 0) {
      setError('Veuillez sélectionner au moins un client');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Parse times and create Date objects
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startDate = new Date(date);
      startDate.setHours(startHour, startMinute, 0);
      
      const endDate = new Date(date);
      endDate.setHours(endHour, endMinute, 0);
      
      // Validate end time is after start time
      if (endDate <= startDate) {
        setError('L\'heure de fin doit être après l\'heure de début');
        return;
      }
      
      const eventData = {
        title,
        description,
        start: Timestamp.fromDate(startDate),
        end: Timestamp.fromDate(endDate),
        location,
        eventType,
        capacity: capacity ? parseInt(capacity) : undefined,
        clientIds: selectedClients,
        organizerId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      if (selectedEvent) {
        // Update existing event
        const eventRef = doc(db, 'events', selectedEvent.id);
        await updateDoc(eventRef, {
          ...eventData,
          createdAt: selectedEvent.createdAt, // Preserve original creation date
        });
        
        if (onEventUpdated) onEventUpdated();
      } else {
        // Create new event
        await addDoc(collection(db, 'events'), eventData);
        
        if (onEventAdded) onEventAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Une erreur est survenue lors de l\'enregistrement de l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!selectedEvent || !user || !user.uid) return;
    
    try {
      setIsDeleting(true);
      
      const eventRef = doc(db, 'events', selectedEvent.id);
      await deleteDoc(eventRef);
      
      if (onEventUpdated) onEventUpdated();
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Une erreur est survenue lors de la suppression de l\'événement');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{selectedEvent ? 'Modifier l\'événement' : 'Nouvel événement'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'événement</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Séance de coaching, Atelier méditation..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détails sur le contenu de l'événement..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type d'événement</Label>
              <RadioGroup 
                value={eventType} 
                onValueChange={(value) => {
                  setEventType(value as 'individual' | 'group' | 'workshop');
                  // Reset selected clients when switching types
                  setSelectedClients([]);
                }}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="cursor-pointer">Séance individuelle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="group" id="group" />
                  <Label htmlFor="group" className="cursor-pointer">Séance de groupe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="workshop" id="workshop" />
                  <Label htmlFor="workshop" className="cursor-pointer">Atelier</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Lieu (optionnel)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Salle, adresse..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Heure de début</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">Heure de fin</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            {(eventType === 'group' || eventType === 'workshop') && (
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité maximale (optionnel)</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="capacity"
                    type="number"
                    min="2"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Nombre de participants"
                    className="pl-10"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>
                {eventType === 'individual' ? 'Sélectionner un client' : 'Sélectionner les clients'}
              </Label>
              <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
                {clients.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">Aucun client disponible</p>
                ) : (
                  <div className="space-y-2">
                    {clients.map((client) => (
                      <div key={client.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`client-${client.id}`}
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={() => handleClientToggle(client.id)}
                          disabled={eventType === 'individual' && selectedClients.length === 1 && !selectedClients.includes(client.id)}
                        />
                        <Label htmlFor={`client-${client.id}`} className="cursor-pointer">
                          {client.displayName || client.email}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {eventType === 'individual' 
                  ? 'Sélectionnez un seul client pour une séance individuelle.' 
                  : 'Vous pouvez sélectionner plusieurs clients pour cet événement.'}
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 border-t pt-4">
            <div className="flex gap-2 w-full sm:w-auto">
              {selectedEvent && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isLoading || isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isDeleting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </>
                  )}
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading || isDeleting}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || isDeleting}
              className="w-full sm:w-auto bg-[#c9a227] hover:bg-[#b18e23]"
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                selectedEvent ? 'Mettre à jour' : 'Créer l\'événement'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
