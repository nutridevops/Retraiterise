'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getClientResources } from '@/lib/resourceService';
import { Resource } from '@/lib/types';
import { ResourceBrowser } from '@/components/ResourceBrowser';
import { useToast } from '@/hooks/use-toast';

export default function ClientResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch resources when the component mounts or user changes
  useEffect(() => {
    async function fetchResources() {
      if (!user) return;

      try {
        setIsLoading(true);
        const fetchedResources = await getClientResources(user.uid);
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
    }

    fetchResources();
  }, [user, toast]);

  return (
    <div className="container py-10">
      <ResourceBrowser
        initialResources={resources}
        isOrganizer={false}
        showUploadButton={false}
        title="Ressources"
        description="Accédez à vos documents, vidéos et autres ressources exclusives."
      />
    </div>
  );
}
