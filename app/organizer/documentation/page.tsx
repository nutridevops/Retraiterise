'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function OrganizerDocumentation() {
  const clientGuidePath = '/documentation/client/guide-utilisateur.md';
  const organizerGuidePath = '/documentation/organizer/guide-organisateur.md';
  
  const handleDownload = (guidePath: string) => {
    window.open(guidePath, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0A291C]">Documentation</h1>
        <p className="text-muted-foreground">
          Guides et ressources pour les organisateurs R.I.S.E.
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="organizer-guide" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="organizer-guide">
            <FileText className="h-4 w-4 mr-2" />
            Guide de l'Organisateur
          </TabsTrigger>
          <TabsTrigger value="client-guide">
            <FileText className="h-4 w-4 mr-2" />
            Guide Utilisateur Client
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="organizer-guide">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[#c9a227]" />
                Guide de l'Organisateur
              </CardTitle>
              <CardDescription>
                Guide complet pour les organisateurs R.I.S.E.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
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
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-900 overflow-auto">
                <MarkdownRenderer 
                  filePath={organizerGuidePath} 
                  className="w-full min-h-[600px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="client-guide">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[#c9a227]" />
                Guide Utilisateur Client
              </CardTitle>
              <CardDescription>
                Guide complet d'utilisation de l'Espace Client R.I.S.E.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
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
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-900 overflow-auto">
                <MarkdownRenderer 
                  filePath={clientGuidePath} 
                  className="w-full min-h-[600px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ressources pour organisateurs</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Modèles de documents</CardTitle>
              <CardDescription>
                Templates pour vos communications avec les clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0" asChild>
                <Link href="#templates">
                  Accéder aux modèles
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formation continue</CardTitle>
              <CardDescription>
                Ressources pour améliorer vos compétences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0" asChild>
                <Link href="#formation">
                  Voir les formations
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support technique</CardTitle>
              <CardDescription>
                Besoin d'assistance technique ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0" asChild>
                <Link href="/organizer/support">
                  Contacter le support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
