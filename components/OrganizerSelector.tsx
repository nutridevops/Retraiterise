'use client';

import { useState } from 'react';
import { Organizer } from '@/lib/bookingService';
import { ORGANIZERS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface OrganizerSelectorProps {
  onOrganizerSelect?: (organizer: Organizer) => void;
  selectedOrganizerId?: string;
  showTitle?: boolean;
}

export function OrganizerSelector({ 
  onOrganizerSelect, 
  selectedOrganizerId,
  showTitle = true 
}: OrganizerSelectorProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Find the currently selected organizer
  const selectedOrganizer = selectedOrganizerId 
    ? ORGANIZERS.find(org => org.id === selectedOrganizerId) 
    : undefined;

  // Handle organizer selection
  const handleSelectOrganizer = (organizer: Organizer) => {
    if (onOrganizerSelect) {
      onOrganizerSelect(organizer);
    }
    
    toast({
      title: "Organisateur sélectionné",
      description: `Vous avez sélectionné ${organizer.name} comme votre organisateur.`,
    });
    
    setIsDialogOpen(false);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Votre organisateur</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedOrganizer ? 'Changer' : 'Sélectionner'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Choisissez votre organisateur</DialogTitle>
                <DialogDescription>
                  Sélectionnez l'organisateur avec lequel vous souhaitez communiquer et prendre rendez-vous.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                {ORGANIZERS.map((organizer) => (
                  <Card 
                    key={organizer.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOrganizerId === organizer.id 
                        ? 'border-[#c9a227] shadow-md' 
                        : 'hover:border-[#c9a227]/50'
                    }`}
                    onClick={() => handleSelectOrganizer(organizer)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex flex-col items-center space-y-2">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={organizer.imageUrl} alt={organizer.name} />
                          <AvatarFallback className="text-lg bg-[#0A291C] text-white">
                            {getInitials(organizer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <CardTitle className="text-base">{organizer.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {organizer.title}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {selectedOrganizer ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={selectedOrganizer.imageUrl} alt={selectedOrganizer.name} />
                <AvatarFallback className="text-lg bg-[#0A291C] text-white">
                  {getInitials(selectedOrganizer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{selectedOrganizer.name}</CardTitle>
                <CardDescription className="text-sm">
                  {selectedOrganizer.title}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm">{selectedOrganizer.email}</p>
              </div>
            </div>
          </CardContent>
          {!showTitle && (
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    Changer d'organisateur
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Choisissez votre organisateur</DialogTitle>
                    <DialogDescription>
                      Sélectionnez l'organisateur avec lequel vous souhaitez communiquer et prendre rendez-vous.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    {ORGANIZERS.map((organizer) => (
                      <Card 
                        key={organizer.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedOrganizerId === organizer.id 
                            ? 'border-[#c9a227] shadow-md' 
                            : 'hover:border-[#c9a227]/50'
                        }`}
                        onClick={() => handleSelectOrganizer(organizer)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex flex-col items-center space-y-2">
                            <Avatar className="w-20 h-20">
                              <AvatarImage src={organizer.imageUrl} alt={organizer.name} />
                              <AvatarFallback className="text-lg bg-[#0A291C] text-white">
                                {getInitials(organizer.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                              <CardTitle className="text-base">{organizer.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {organizer.title}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          )}
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aucun organisateur sélectionné</CardTitle>
            <CardDescription>
              Sélectionnez un organisateur pour commencer à communiquer et prendre rendez-vous.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#c9a227] hover:bg-[#b18e23] text-white">
                  Sélectionner un organisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Choisissez votre organisateur</DialogTitle>
                  <DialogDescription>
                    Sélectionnez l'organisateur avec lequel vous souhaitez communiquer et prendre rendez-vous.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  {ORGANIZERS.map((organizer) => (
                    <Card 
                      key={organizer.id}
                      className="cursor-pointer transition-all hover:shadow-md hover:border-[#c9a227]/50"
                      onClick={() => handleSelectOrganizer(organizer)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex flex-col items-center space-y-2">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={organizer.imageUrl} alt={organizer.name} />
                            <AvatarFallback className="text-lg bg-[#0A291C] text-white">
                              {getInitials(organizer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center">
                            <CardTitle className="text-base">{organizer.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {organizer.title}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
