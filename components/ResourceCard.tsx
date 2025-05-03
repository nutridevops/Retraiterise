'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Printer, 
  Download, 
  Eye, 
  Trash, 
  Edit, 
  Calendar,
  Share2,
  MoreHorizontal,
  Users,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Resource, ResourceType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/lib/auth';
import { deleteResource } from '@/lib/resourceService';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResourceCardProps {
  resource: Resource;
  onDelete?: () => void;
  onEdit?: () => void;
  compact?: boolean;
  showActions?: boolean;
}

export function ResourceCard({ 
  resource, 
  onDelete, 
  onEdit, 
  compact = false,
  showActions = true 
}: ResourceCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Get the appropriate icon based on resource type
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
  
  // Format the creation date
  const formattedDate = resource.createdAt 
    ? formatDistanceToNow(resource.createdAt.toDate(), { addSuffix: true, locale: fr })
    : '';
  
  // Handle resource deletion
  const handleDelete = async () => {
    if (!user || !resource.id) return;
    
    try {
      setIsDeleting(true);
      await deleteResource(resource.id);
      
      toast({
        title: "Ressource supprimée",
        description: "La ressource a été supprimée avec succès.",
      });
      
      if (onDelete) onDelete();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  // Handle share functionality
  const handleShare = () => {
    if (navigator.share && resource.url) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: resource.url,
      }).catch((error) => {
        console.log('Error sharing', error);
        // Fallback: copy to clipboard
        handleCopyLink();
      });
    } else {
      // Fallback: copy to clipboard
      handleCopyLink();
    }
  };
  
  // Copy link to clipboard
  const handleCopyLink = () => {
    if (resource.url) {
      navigator.clipboard.writeText(resource.url).then(() => {
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papiers.",
        });
      });
    }
  };
  
  // Determine if the current user is an organizer
  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';
  
  // Get visibility icon
  const getVisibilityIcon = () => {
    if (resource.visibleTo === 'all') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Users className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Visible par tous les clients</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <User className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Visibilité limitée</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  };
  
  // Determine thumbnail or placeholder
  const getThumbnail = () => {
    if (resource.thumbnailUrl) {
      return resource.thumbnailUrl;
    } else {
      // Return a default thumbnail based on resource type
      switch (resource.type) {
        case 'pdf':
          return '/images/icons/pdf-icon.svg';
        case 'video':
          return '/images/icons/video-icon.svg';
        case 'link':
          return '/images/icons/link-icon.svg';
        case 'printable':
          return '/images/icons/printable-icon.svg';
        default:
          return '/images/icons/pdf-icon.svg';
      }
    }
  };
  
  return (
    <>
      <Card className={`overflow-hidden transition-all hover:shadow-md ${compact ? 'h-full' : ''}`}>
        <CardHeader className={`${compact ? 'p-4 pb-2' : 'pb-2'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {getResourceIcon(resource.type)}
              <CardTitle className={`${compact ? 'text-base' : 'text-lg'} line-clamp-1`}>
                {resource.title}
              </CardTitle>
            </div>
            
            {showActions && isOrganizer && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copier le lien
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {!compact && (
            <CardDescription className="mt-1 line-clamp-2">
              {resource.description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className={compact ? 'p-4 pt-0' : ''}>
          <div className={`overflow-hidden rounded-md ${compact ? 'mb-2' : 'mb-4'}`}>
            <div className="relative aspect-video w-full bg-muted">
              <img 
                src={getThumbnail()} 
                alt={resource.title} 
                className="h-full w-full object-cover transition-all hover:scale-105"
              />
              {resource.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-black/50 p-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5V19L19 12L8 5Z" fill="white" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {resource.tags && resource.tags.length > 0 && !compact && (
            <div className="flex flex-wrap gap-1 mb-2">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className={`flex flex-col space-y-2 ${compact ? 'p-4 pt-0' : ''}`}>
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center">
                {getVisibilityIcon()}
              </div>
            </div>
            
            {compact && resource.tags && resource.tags.length > 0 && (
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs">
                  {resource.tags[0]}
                  {resource.tags.length > 1 && `+${resource.tags.length - 1}`}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex w-full space-x-2">
            {resource.type === 'link' ? (
              <Button 
                asChild 
                className="w-full bg-[#c9a227] hover:bg-[#b18e23] text-white"
              >
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4" />
                  Visiter
                </a>
              </Button>
            ) : (
              <>
                <Button 
                  asChild 
                  variant="outline" 
                  className="flex-1"
                >
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Voir
                  </a>
                </Button>
                <Button 
                  asChild 
                  className="flex-1 bg-[#c9a227] hover:bg-[#b18e23] text-white"
                >
                  <a href={resource.url} download>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </a>
                </Button>
              </>
            )}
            
            {showActions && !compact && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleShare}
                      className="flex-none"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Partager</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette ressource ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La ressource sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
