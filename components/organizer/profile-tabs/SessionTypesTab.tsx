'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrganizerProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar, Plus, Trash2, Clock, Users, DollarSign, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { v4 as uuidv4 } from 'uuid';

interface SessionTypesTabProps {
  profile: OrganizerProfile;
  onProfileUpdate: (updatedProfile: Partial<OrganizerProfile>) => void;
}

interface SessionType {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  capacity: number;
  active: boolean;
}

export function SessionTypesTab({ profile, onProfileUpdate }: SessionTypesTabProps) {
  const [newSession, setNewSession] = useState<SessionType>({
    id: '',
    name: '',
    description: '',
    duration: 60,
    price: 0,
    capacity: 1,
    active: true
  });
  const [isAddingSession, setIsAddingSession] = useState(false);

  const handleSessionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSession(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' || name === 'capacity' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleAddSession = () => {
    if (!newSession.name) return;
    
    const sessionWithId = {
      ...newSession,
      id: uuidv4()
    };
    
    const updatedSessionTypes = [...(profile.sessionTypes || []), sessionWithId];
    onProfileUpdate({ sessionTypes: updatedSessionTypes });
    
    // Reset form
    setNewSession({
      id: '',
      name: '',
      description: '',
      duration: 60,
      price: 0,
      capacity: 1,
      active: true
    });
    setIsAddingSession(false);
  };

  const handleRemoveSession = (id: string) => {
    const updatedSessionTypes = (profile.sessionTypes || []).filter(session => session.id !== id);
    onProfileUpdate({ sessionTypes: updatedSessionTypes });
  };

  const handleToggleSessionActive = (id: string) => {
    const updatedSessionTypes = (profile.sessionTypes || []).map(session => {
      if (session.id === id) {
        return {
          ...session,
          active: !session.active
        };
      }
      return session;
    });
    
    onProfileUpdate({ sessionTypes: updatedSessionTypes });
  };

  const handleUpdateSession = (id: string, field: string, value: string | number | boolean) => {
    const updatedSessionTypes = (profile.sessionTypes || []).map(session => {
      if (session.id === id) {
        return {
          ...session,
          [field]: value
        };
      }
      return session;
    });
    
    onProfileUpdate({ sessionTypes: updatedSessionTypes });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[#c9a227]" />
            Types de séances
          </CardTitle>
          <CardDescription>
            Configurez les différents types de séances que vous proposez
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(profile.sessionTypes || []).length === 0 && !isAddingSession && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore configuré de types de séances.
              </p>
              <Button 
                onClick={() => setIsAddingSession(true)}
                className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un type de séance
              </Button>
            </div>
          )}

          {(profile.sessionTypes || []).map((session) => (
            <Card key={session.id} className="border-muted">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    {session.name}
                    <div className="ml-2">
                      {session.active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                          <X className="h-3 w-3 mr-1" />
                          Inactif
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={session.active} 
                        onCheckedChange={() => handleToggleSessionActive(session.id)}
                      />
                      <Label htmlFor={`active-${session.id}`} className="text-sm">
                        {session.active ? 'Actif' : 'Inactif'}
                      </Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveSession(session.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {session.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{session.duration} min</p>
                      <p className="text-xs text-muted-foreground">Durée</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{session.price} €</p>
                      <p className="text-xs text-muted-foreground">Prix</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{session.capacity} {session.capacity > 1 ? 'personnes' : 'personne'}</p>
                      <p className="text-xs text-muted-foreground">Capacité</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {isAddingSession ? (
            <Card className="border-dashed border-2 border-[#c9a227]">
              <CardHeader>
                <CardTitle className="text-lg">Nouveau type de séance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Nom de la séance</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newSession.name}
                    onChange={handleSessionInputChange}
                    placeholder="Ex: Consultation individuelle, Atelier de groupe, etc."
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newSession.description}
                    onChange={handleSessionInputChange}
                    placeholder="Décrivez ce type de séance..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="duration">Durée (minutes)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      value={newSession.duration}
                      onChange={handleSessionInputChange}
                      min={15}
                      step={15}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={newSession.price}
                      onChange={handleSessionInputChange}
                      min={0}
                      step={5}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="capacity">Capacité</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={newSession.capacity}
                      onChange={handleSessionInputChange}
                      min={1}
                      step={1}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingSession(false)}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddSession}
                  className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
                  disabled={!newSession.name}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="text-center">
              <Button 
                onClick={() => setIsAddingSession(true)}
                variant="outline"
                className="border-dashed border-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un type de séance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Badge component for session status
function Badge({ 
  children, 
  variant = "default", 
  className = "" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "outline"; 
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
