'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function ClientDocumentation() {
  const clientGuidePath = '/documentation/client/guide-utilisateur.md';
  
  const handleDownload = () => {
    window.open(clientGuidePath, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0A291C]">Documentation</h1>
        <p className="text-muted-foreground">
          Guides et ressources pour vous aider à utiliser la plateforme R.I.S.E.
        </p>
      </div>
      
      <Separator />
      
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
              onClick={handleDownload}
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
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ressources supplémentaires</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">FAQ</CardTitle>
              <CardDescription>
                Réponses aux questions fréquemment posées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0" asChild>
                <Link href="#faq">
                  Consulter la FAQ
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tutoriels vidéo</CardTitle>
              <CardDescription>
                Guides visuels pour utiliser la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0" asChild>
                <Link href="#videos">
                  Voir les tutoriels
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support</CardTitle>
              <CardDescription>
                Besoin d'aide supplémentaire ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0" asChild>
                <Link href="/client/support">
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
