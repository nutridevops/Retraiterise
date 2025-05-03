'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DocumentationViewerProps {
  type: 'client' | 'organizer';
  showClientGuide?: boolean;
}

export function DocumentationViewer({ type, showClientGuide = false }: DocumentationViewerProps) {
  const [activeTab, setActiveTab] = useState<string>(type === 'client' ? 'client-guide' : 'organizer-guide');

  const clientGuidePath = '/documentation/client/guide-utilisateur.md';
  const organizerGuidePath = '/documentation/organizer/guide-organisateur.md';

  const handleDownload = (guidePath: string) => {
    window.open(guidePath, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
        <CardDescription>
          {type === 'client' 
            ? 'Guide d\'utilisation de l\'Espace Client R.I.S.E.' 
            : 'Guides d\'utilisation pour les organisateurs R.I.S.E.'}
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 px-6">
          {(type === 'client' || showClientGuide) && (
            <TabsTrigger value="client-guide">
              <FileText className="h-4 w-4 mr-2" />
              Guide Utilisateur Client
            </TabsTrigger>
          )}
          
          {type === 'organizer' && (
            <TabsTrigger value="organizer-guide">
              <FileText className="h-4 w-4 mr-2" />
              Guide de l'Organisateur
            </TabsTrigger>
          )}
        </TabsList>

        {(type === 'client' || showClientGuide) && (
          <TabsContent value="client-guide" className="p-6">
            <div className="flex justify-end mb-4 space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownload(clientGuidePath)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <a 
                  href={clientGuidePath}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                </a>
              </Button>
            </div>
            <Separator className="mb-4" />
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <iframe 
                src={clientGuidePath} 
                className="w-full h-[600px] border-0"
                title="Guide Utilisateur Client"
              />
            </div>
          </TabsContent>
        )}

        {type === 'organizer' && (
          <TabsContent value="organizer-guide" className="p-6">
            <div className="flex justify-end mb-4 space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownload(organizerGuidePath)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <a 
                  href={organizerGuidePath}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                </a>
              </Button>
            </div>
            <Separator className="mb-4" />
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <iframe 
                src={organizerGuidePath} 
                className="w-full h-[600px] border-0"
                title="Guide de l'Organisateur"
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}
