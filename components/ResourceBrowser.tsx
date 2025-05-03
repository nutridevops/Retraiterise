'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { getAllResources } from '@/lib/resourceService';
import { Resource } from '@/lib/types';
import { ResourceGrid } from '@/components/ResourceGrid';
import { ResourceUploadForm } from '@/components/ResourceUploadForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, RefreshCcw, Grid, List, FileText, Video, Music, Link2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ResourceBrowserProps {
  isOrganizer?: boolean;
  initialResources?: Resource[];
  showUploadButton?: boolean;
  showViewToggle?: boolean;
  defaultView?: 'grid' | 'list';
  title?: string;
  description?: string;
}

export function ResourceBrowser({
  isOrganizer = false,
  initialResources,
  showUploadButton = true,
  showViewToggle = true,
  defaultView = 'grid',
  title = "Ressources",
  description = "Parcourez et gérez vos ressources",
}: ResourceBrowserProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>(initialResources || []);
  const [isLoading, setIsLoading] = useState(!initialResources);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);

  // Load resources from Firestore - memoized with useCallback
  const loadResources = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const fetchedResources = await getAllResources();
      setResources(fetchedResources);
    } catch (error: any) {
      // Check if it's an index error
      if (error.message && error.message.includes('requires an index')) {
        toast({
          title: "Erreur d'index Firestore",
          description: "Une configuration de base de données est nécessaire. Veuillez contacter l'administrateur.",
          variant: "destructive",
        });
        console.error('Firestore index error:', error);
        // Set empty resources to prevent continuous retries
        setResources([]);
      } else {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les ressources.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Load resources on component mount if not provided
  useEffect(() => {
    if (!initialResources) {
      loadResources();
    }
  }, [initialResources, loadResources]);

  // Handle resource upload success
  const handleUploadSuccess = useCallback(() => {
    setUploadDialogOpen(false);
    setEditingResource(null);
    loadResources();
    toast({
      title: "Succès",
      description: "La ressource a été enregistrée avec succès.",
    });
  }, [loadResources, toast]);

  // Handle resource edit
  const handleEdit = useCallback((resource: Resource) => {
    setEditingResource(resource);
    setUploadDialogOpen(true);
  }, []);

  // Handle resource delete
  const handleDelete = useCallback(() => {
    loadResources();
  }, [loadResources]);

  // Toggle view mode between grid and list
  const toggleViewMode = useCallback(() => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  }, [viewMode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {showViewToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="h-9"
            >
              {viewMode === 'grid' ? (
                <>
                  <List className="h-4 w-4 mr-2" />
                  Liste
                </>
              ) : (
                <>
                  <Grid className="h-4 w-4 mr-2" />
                  Grille
                </>
              )}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadResources}
            className="h-9"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          
          {isOrganizer && showUploadButton && (
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#c9a227] hover:bg-[#b18e23] text-white h-9">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingResource ? "Modifier la ressource" : "Ajouter une nouvelle ressource"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingResource
                      ? "Modifiez les détails de la ressource ci-dessous."
                      : "Remplissez le formulaire ci-dessous pour ajouter une nouvelle ressource."}
                  </DialogDescription>
                </DialogHeader>
                <ResourceUploadForm
                  onSuccess={handleUploadSuccess}
                  existingResource={editingResource}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
          <TabsTrigger value="video">Vidéos</TabsTrigger>
          <TabsTrigger value="link">Liens</TabsTrigger>
          <TabsTrigger value="printable">Imprimables</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ResourceGrid
            resources={resources.map(r => ({ ...r, type: r.type || '' }))}
            isLoading={isLoading}
            onEdit={isOrganizer ? handleEdit : undefined}
            onDelete={handleDelete}
            compact={viewMode === 'grid'}
          />
        </TabsContent>
        
        <TabsContent value="pdf" className="mt-0">
          <ResourceGrid
            resources={resources.filter(r => r.type === 'pdf').map(r => ({ ...r, type: r.type || '' }))}
            isLoading={isLoading}
            onEdit={isOrganizer ? handleEdit : undefined}
            onDelete={handleDelete}
            compact={viewMode === 'grid'}
            showFilters={false}
          />
        </TabsContent>
        
        <TabsContent value="video" className="mt-0">
          <ResourceGrid
            resources={resources.filter(r => r.type === 'video').map(r => ({ ...r, type: r.type || '' }))}
            isLoading={isLoading}
            onEdit={isOrganizer ? handleEdit : undefined}
            onDelete={handleDelete}
            compact={viewMode === 'grid'}
            showFilters={false}
          />
        </TabsContent>
        
        <TabsContent value="link" className="mt-0">
          <ResourceGrid
            resources={resources.filter(r => r.type === 'link').map(r => ({ ...r, type: r.type || '' }))}
            isLoading={isLoading}
            onEdit={isOrganizer ? handleEdit : undefined}
            onDelete={handleDelete}
            compact={viewMode === 'grid'}
            showFilters={false}
          />
        </TabsContent>
        
        <TabsContent value="printable" className="mt-0">
          <ResourceGrid
            resources={resources.filter(r => r.type === 'printable').map(r => ({ ...r, type: r.type || '' }))}
            isLoading={isLoading}
            onEdit={isOrganizer ? handleEdit : undefined}
            onDelete={handleDelete}
            compact={viewMode === 'grid'}
            showFilters={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
