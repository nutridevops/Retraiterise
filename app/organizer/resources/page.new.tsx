'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getAllResources } from '@/lib/resourceService';
import { Resource } from '@/lib/types';
import { ResourceBrowser } from '@/components/ResourceBrowser';
import { useToast } from '@/hooks/use-toast';

export default function OrganizerResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all resources when the component mounts
  useEffect(() => {
    fetchResources();
  }, []);

  // Function to fetch resources
  const fetchResources = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const fetchedResources = await getAllResources();
      setResources(fetchedResources);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || "Une erreur s'est produite lors du chargement des ressources.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <ResourceBrowser
        initialResources={resources}
        isOrganizer={true}
        showUploadButton={true}
        title="Gestion des ressources"
        description="Ajoutez, modifiez et gérez les ressources pour vos clients."
      />
    </div>
  );
}
