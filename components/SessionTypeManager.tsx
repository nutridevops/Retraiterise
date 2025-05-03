'use client';

import { useState } from 'react';
import { SessionType } from '@/lib/bookingService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, Edit, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SessionTypeManagerProps {
  sessionTypes: SessionType[];
  isLoading: boolean;
  onCreateSessionType: (sessionType: Omit<SessionType, 'id'>) => Promise<any>;
  onUpdateSessionType: (sessionTypeId: string, sessionType: Partial<Omit<SessionType, 'id'>>) => Promise<boolean>;
  onDeleteSessionType: (sessionTypeId: string) => Promise<boolean>;
  organizerId: string;
}

export function SessionTypeManager({
  sessionTypes,
  isLoading,
  onCreateSessionType,
  onUpdateSessionType,
  onDeleteSessionType,
  organizerId
}: SessionTypeManagerProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedSessionTypeId, setSelectedSessionTypeId] = useState<string | null>(null);
  const [newSessionType, setNewSessionType] = useState<Omit<SessionType, 'id'>>({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    organizerId: organizerId,
    isActive: true,
  });
  const [editSessionType, setEditSessionType] = useState<Partial<Omit<SessionType, 'id'>>>({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    isActive: true,
  });

  // Handle form input changes for new session type
  const handleNewInputChange = (field: keyof Omit<SessionType, 'id'>, value: any) => {
    setNewSessionType(prev => ({ ...prev, [field]: value }));
  };

  // Handle form input changes for edit session type
  const handleEditInputChange = (field: keyof Omit<SessionType, 'id'>, value: any) => {
    setEditSessionType(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission for new session type
  const handleCreateSubmit = async () => {
    // Validate form
    if (!newSessionType.name || !newSessionType.description || newSessionType.duration <= 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateSessionType(newSessionType);
      setShowAddDialog(false);
      
      // Reset form
      setNewSessionType({
        name: '',
        description: '',
        duration: 60,
        price: 0,
        organizerId: organizerId,
        isActive: true,
      });
    } catch (error) {
      console.error('Error creating session type:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission for edit session type
  const handleUpdateSubmit = async () => {
    if (!selectedSessionTypeId) return;
    
    // Validate form
    if (!editSessionType.name || !editSessionType.description || (editSessionType.duration && editSessionType.duration <= 0)) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateSessionType(selectedSessionTypeId, editSessionType);
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error updating session type:', error);
    } finally {
      setIsSubmitting(false);
      setSelectedSessionTypeId(null);
    }
  };

  // Handle session type deletion
  const handleDelete = async (sessionTypeId: string) => {
    try {
      setIsDeleting(sessionTypeId);
      await onDeleteSessionType(sessionTypeId);
    } catch (error) {
      console.error('Error deleting session type:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Open edit dialog with session type data
  const openEditDialog = (sessionType: SessionType) => {
    setSelectedSessionTypeId(sessionType.id);
    setEditSessionType({
      name: sessionType.name,
      description: sessionType.description,
      duration: sessionType.duration,
      price: sessionType.price,
      isActive: sessionType.isActive,
    });
    setShowEditDialog(true);
  };

  // Format price to display as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">Types de séances</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#c9a227] hover:bg-[#b18e23] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un type de séance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un type de séance</DialogTitle>
              <DialogDescription>
                Créez un nouveau type de séance que les clients pourront réserver.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={newSessionType.name}
                  onChange={(e) => handleNewInputChange('name', e.target.value)}
                  placeholder="Ex: Séance de coaching individuel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSessionType.description}
                  onChange={(e) => handleNewInputChange('description', e.target.value)}
                  placeholder="Décrivez ce que les clients peuvent attendre de cette séance..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    value={newSessionType.duration}
                    onChange={(e) => handleNewInputChange('duration', parseInt(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step={0.01}
                    value={newSessionType.price}
                    onChange={(e) => handleNewInputChange('price', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button 
                onClick={handleCreateSubmit}
                disabled={isSubmitting}
                className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Session Type Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le type de séance</DialogTitle>
            <DialogDescription>
              Modifiez les détails de ce type de séance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nom</Label>
              <Input
                id="edit-name"
                value={editSessionType.name}
                onChange={(e) => handleEditInputChange('name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editSessionType.description}
                onChange={(e) => handleEditInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Durée (minutes)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min={1}
                  value={editSessionType.duration}
                  onChange={(e) => handleEditInputChange('duration', parseInt(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Prix (€)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={editSessionType.price}
                  onChange={(e) => handleEditInputChange('price', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              onClick={handleUpdateSubmit}
              disabled={isSubmitting}
              className="bg-[#c9a227] hover:bg-[#b18e23] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
        </div>
      ) : sessionTypes.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            Vous n'avez créé aucun type de séance. Ajoutez-en un pour que les clients puissent réserver.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessionTypes.map((sessionType) => (
            <Card key={sessionType.id} className={!sessionType.isActive ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{sessionType.name}</CardTitle>
                  {sessionType.isActive ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Actif</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">Inactif</span>
                  )}
                </div>
                <CardDescription>
                  {formatPrice(sessionType.price)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{sessionType.duration} minutes</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {sessionType.description}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => openEditDialog(sessionType)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(sessionType.id || '')}
                  disabled={isDeleting === sessionType.id}
                >
                  {isDeleting === sessionType.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
