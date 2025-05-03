'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { uploadResourceFile, createResource } from '@/lib/resourceService';
import { ResourceType } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Loader2, 
  Upload, 
  X, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Printer, 
  Eye, 
  Plus,
  UserPlus,
  Users
} from 'lucide-react';

// Define the form schema with Zod
const resourceFormSchema = z.object({
  title: z.string().min(3, {
    message: 'Le titre doit contenir au moins 3 caractères',
  }),
  description: z.string().min(10, {
    message: 'La description doit contenir au moins 10 caractères',
  }),
  type: z.enum(['pdf', 'video', 'link', 'printable'] as const),
  tags: z.string().optional(),
  url: z.string().optional(),
  visibleTo: z.enum(['all', 'specific'] as const),
  // We'll handle specific clients separately
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

interface ResourceUploadFormProps {
  onSuccess?: () => void;
  existingResource?: any; // For editing mode
}

export function ResourceUploadForm({ onSuccess, existingResource }: ResourceUploadFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Initialize the form
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: existingResource?.title || '',
      description: existingResource?.description || '',
      type: (existingResource?.type as ResourceType) || 'pdf',
      tags: '',
      url: existingResource?.url || '',
      visibleTo: existingResource?.visibleTo === 'all' ? 'all' : 'specific',
    },
  });
  
  // Set up edit mode if existingResource is provided
  useEffect(() => {
    if (existingResource) {
      setIsEditMode(true);
      if (existingResource.tags && Array.isArray(existingResource.tags)) {
        setTags(existingResource.tags);
      }
      if (existingResource.visibleTo && existingResource.visibleTo !== 'all') {
        setSelectedClients(existingResource.visibleTo);
      }
      
      // If it's a link, set the URL
      if (existingResource.type === 'link') {
        form.setValue('url', existingResource.url);
      }
      
      // If there's a thumbnail, set the preview
      if (existingResource.thumbnailUrl) {
        setFilePreview(existingResource.thumbnailUrl);
      }
    }
  }, [existingResource, form]);
  
  // Watch the type field to conditionally render form elements
  const resourceType = form.watch('type');
  const visibilityType = form.watch('visibleTo');
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview for supported file types
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === 'application/pdf') {
        // For PDFs, we could use a PDF icon or the first page as thumbnail
        // Here we'll just use a generic icon
        setFilePreview('/images/icons/pdf-icon.svg');
      } else if (selectedFile.type.startsWith('video/')) {
        // For videos, we could generate a thumbnail, but for now use a generic icon
        setFilePreview('/images/icons/video-icon.svg');
      }
    }
  };
  
  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  // Add a tag when Enter is pressed
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };
  
  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle client selection (mock implementation - would need real client data)
  const toggleClientSelection = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: ResourceFormValues) => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour télécharger des ressources.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      let resourceUrl = values.url;
      let thumbnailUrl = undefined;
      
      // If it's not a link type and we have a file, upload it
      if (values.type !== 'link' && file) {
        const uploadResult = await uploadResourceFile(
          file,
          values.type as ResourceType,
          user.uid
        );
        resourceUrl = uploadResult.url;
        
        // TODO: Generate thumbnail for PDFs and videos if needed
        // For now, we could use the filePreview if it's available
        if (filePreview && !filePreview.startsWith('/images/')) {
          thumbnailUrl = filePreview;
        }
      } else if (values.type !== 'link' && !file && !isEditMode) {
        toast({
          title: 'Fichier requis',
          description: 'Veuillez sélectionner un fichier à télécharger.',
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      } else if (values.type === 'link' && !values.url) {
        toast({
          title: 'URL requise',
          description: 'Veuillez entrer une URL pour la ressource de type lien.',
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }
      
      // Determine visibility
      const visibleTo = values.visibleTo === 'all' ? 'all' : selectedClients.length > 0 ? selectedClients : [user.uid];
      
      // Create the resource in Firestore
      await createResource(
        {
          title: values.title,
          description: values.description,
          type: values.type as ResourceType,
          url: resourceUrl || '',
          thumbnailUrl,
          tags,
          visibleTo,
        },
        user.uid
      );
      
      toast({
        title: isEditMode ? 'Ressource mise à jour' : 'Ressource téléchargée',
        description: isEditMode 
          ? 'La ressource a été mise à jour avec succès.' 
          : 'La ressource a été téléchargée avec succès.',
      });
      
      // Reset the form
      form.reset();
      setFile(null);
      setFilePreview(null);
      setTags([]);
      setTagInput('');
      setSelectedClients([]);
      
      // Call the onSuccess callback if provided
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || "Une erreur s'est produite lors du téléchargement.",
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Get icon based on resource type
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-[#c9a227]" />;
      case 'video':
        return <Video className="h-6 w-6 text-[#c9a227]" />;
      case 'link':
        return <LinkIcon className="h-6 w-6 text-[#c9a227]" />;
      case 'printable':
        return <Printer className="h-6 w-6 text-[#c9a227]" />;
      default:
        return <FileText className="h-6 w-6 text-[#c9a227]" />;
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la ressource" {...field} />
                  </FormControl>
                  <FormDescription>
                    Donnez un titre clair et descriptif à votre ressource.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de la ressource"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Décrivez brièvement le contenu et l'utilité de cette ressource.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de ressource</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pdf">Document PDF</SelectItem>
                      <SelectItem value="video">Vidéo</SelectItem>
                      <SelectItem value="link">Lien externe</SelectItem>
                      <SelectItem value="printable">Document imprimable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisissez le type qui correspond le mieux à votre ressource.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            {resourceType === 'link' ? (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/resource"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Entrez l'URL complète du lien externe.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormItem>
                <FormLabel>Fichier</FormLabel>
                <FormControl>
                  <div className="grid w-full items-center gap-1.5">
                    <Input
                      id="resource-file"
                      type="file"
                      onChange={handleFileChange}
                      accept={
                        resourceType === 'pdf'
                          ? '.pdf'
                          : resourceType === 'video'
                          ? '.mp4,.webm,.mov'
                          : resourceType === 'printable'
                          ? '.pdf,.doc,.docx'
                          : undefined
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  {file ? `Fichier sélectionné: ${file.name}` : isEditMode ? 'Sélectionnez un nouveau fichier pour remplacer l\'existant.' : 'Sélectionnez un fichier à télécharger.'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            
            {/* File preview */}
            {filePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Aperçu:</p>
                <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                  {filePreview.startsWith('data:image') ? (
                    <img 
                      src={filePreview} 
                      alt="Aperçu" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {getResourceIcon(resourceType as ResourceType)}
                      <span className="ml-2 text-sm font-medium">
                        {resourceType === 'pdf' ? 'Document PDF' : 
                         resourceType === 'video' ? 'Fichier vidéo' : 
                         resourceType === 'printable' ? 'Document imprimable' : 'Fichier'}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setFilePreview(null)}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Tags input */}
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Ajouter un tag..."
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addTag}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>
                Ajoutez des tags pour faciliter la recherche. Appuyez sur Entrée ou sur le bouton + pour ajouter.
              </FormDescription>
              
              {/* Tags display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="rounded-full hover:bg-gray-200 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </FormItem>
          </div>
        </div>
        
        {/* Visibility section */}
        <FormField
          control={form.control}
          name="visibleTo"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Visibilité</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Tous les clients
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific" />
                    <Label htmlFor="specific" className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Clients spécifiques
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Choisissez qui peut voir cette ressource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Client selection (would need real client data) */}
        {visibilityType === 'specific' && (
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-2">Sélectionnez les clients:</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cette fonctionnalité sera disponible prochainement. Pour l'instant, la ressource sera visible uniquement par vous.
            </p>
            {/* Placeholder for client selection UI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['client1', 'client2', 'client3'].map(clientId => (
                <div key={clientId} className="flex items-center space-x-2">
                  <Checkbox
                    id={clientId}
                    checked={selectedClients.includes(clientId)}
                    onCheckedChange={() => toggleClientSelection(clientId)}
                  />
                  <Label htmlFor={clientId} className="text-sm">
                    Client {clientId.replace('client', '')} (exemple)
                  </Label>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        <Button
          type="submit"
          className="w-full bg-[#c9a227] hover:bg-[#b18e23] text-white"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? 'Mise à jour en cours...' : 'Téléchargement en cours...'}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {isEditMode ? 'Mettre à jour la ressource' : 'Télécharger la ressource'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
