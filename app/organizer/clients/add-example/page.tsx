'use client';

import { useState } from 'react';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddExampleClientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const createExampleClient = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Create a client document with a custom ID
      const clientId = 'example-client-123';
      const clientRef = doc(db, 'users', clientId);
      
      // Client data
      const clientData = {
        displayName: 'Sophie Martin',
        email: 'sophie.martin@example.com',
        role: 'client',
        phone: '+33 6 12 34 56 78',
        address: '15 Rue de la Paix, 75002 Paris, France',
        bio: 'Professionnelle de 35 ans cherchant à améliorer son équilibre vie professionnelle/personnelle. Intéressée par la méditation et les pratiques de pleine conscience.',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/42.jpg',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add the client to Firestore
      await setDoc(clientRef, clientData);
      
      // Create an organizer document with a custom ID
      const organizerId = 'organizer-123';
      const organizerRef = doc(db, 'users', organizerId);
      
      // Organizer data
      const organizerData = {
        displayName: 'Jean Dupont',
        email: 'jean.dupont@rise-retreat.com',
        role: 'organizer',
        phone: '+33 6 98 76 54 32',
        bio: 'Coach professionnel avec 10 ans d\'expérience dans l\'accompagnement personnel et le bien-être.',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add the organizer to Firestore
      await setDoc(organizerRef, organizerData);
      
      // Create sample notes
      const notes = [
        {
          clientId,
          content: 'Premier rendez-vous très positif. Sophie est motivée et a des objectifs clairs pour sa retraite.',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          createdBy: organizerId,
          createdByName: 'Jean Dupont'
        },
        {
          clientId,
          content: 'A exprimé un intérêt particulier pour les ateliers de méditation et de yoga. À suivre pour les prochaines sessions.',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          createdBy: organizerId,
          createdByName: 'Jean Dupont'
        },
        {
          clientId,
          content: 'Sophie a mentionné des difficultés à maintenir sa pratique quotidienne. Lui proposer des exercices plus courts mais réguliers.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          createdBy: organizerId,
          createdByName: 'Jean Dupont'
        }
      ];
      
      // Add notes to Firestore
      for (const note of notes) {
        await addDoc(collection(db, 'notes'), note);
      }
      
      // Create sample messages
      const messages = [
        {
          content: 'Bonjour Sophie, bienvenue chez R.I.S.E. Retreat ! Comment puis-je vous aider aujourd\'hui ?',
          senderId: organizerId,
          senderName: 'Jean Dupont',
          receiverId: clientId,
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          read: true,
          participants: [organizerId, clientId]
        },
        {
          content: 'Bonjour Jean, merci pour votre accueil ! J\'aimerais en savoir plus sur les prochains ateliers de méditation.',
          senderId: clientId,
          senderName: 'Sophie Martin',
          receiverId: organizerId,
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 10 days ago + 1 hour
          read: true,
          participants: [organizerId, clientId]
        },
        {
          content: 'Bien sûr ! Nous avons un atelier de méditation pleine conscience ce samedi à 10h. Seriez-vous intéressée ?',
          senderId: organizerId,
          senderName: 'Jean Dupont',
          receiverId: clientId,
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
          read: true,
          participants: [organizerId, clientId]
        },
        {
          content: 'Oui, ça me semble parfait ! Je vais m\'inscrire tout de suite.',
          senderId: clientId,
          senderName: 'Sophie Martin',
          receiverId: organizerId,
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 9 days ago + 2 hours
          read: true,
          participants: [organizerId, clientId]
        },
        {
          content: 'Avez-vous des recommandations de lectures sur la méditation que je pourrais consulter avant l\'atelier ?',
          senderId: clientId,
          senderName: 'Sophie Martin',
          receiverId: organizerId,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          read: true,
          participants: [organizerId, clientId]
        }
      ];
      
      // Add messages to Firestore
      for (const message of messages) {
        await addDoc(collection(db, 'messages'), message);
      }
      
      // Create sample files metadata
      const files = [
        {
          clientId,
          name: 'Programme_Meditation_Debutant.pdf',
          url: 'https://firebasestorage.googleapis.com/example/Programme_Meditation_Debutant.pdf',
          type: 'application/pdf',
          size: 2500000, // 2.5 MB
          uploadedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
          uploadedBy: organizerId,
          uploadedByName: 'Jean Dupont'
        },
        {
          clientId,
          name: 'Exercices_Quotidiens.docx',
          url: 'https://firebasestorage.googleapis.com/example/Exercices_Quotidiens.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 1800000, // 1.8 MB
          uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          uploadedBy: organizerId,
          uploadedByName: 'Jean Dupont'
        },
        {
          clientId,
          name: 'Calendrier_Ateliers_2025.xlsx',
          url: 'https://firebasestorage.googleapis.com/example/Calendrier_Ateliers_2025.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 1200000, // 1.2 MB
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          uploadedBy: organizerId,
          uploadedByName: 'Jean Dupont'
        }
      ];
      
      // Add files to Firestore
      for (const file of files) {
        await addDoc(collection(db, 'files'), file);
      }
      
      setSuccess(true);
      setClientId(clientId);
    } catch (error) {
      console.error('Error creating example client:', error);
      setError('Une erreur est survenue lors de la création du client exemple.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Créer un client exemple</CardTitle>
          <CardDescription>
            Cet outil va créer un client exemple avec des notes, des fichiers et des messages pour démontrer les fonctionnalités de l'application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Client exemple créé avec succès !</AlertTitle>
              <AlertDescription>
                Le client exemple "Sophie Martin" a été créé avec succès avec toutes les données associées.
              </AlertDescription>
            </Alert>
          ) : error ? (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <p>En cliquant sur le bouton ci-dessous, vous allez créer :</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Un client exemple (Sophie Martin)</li>
                <li>Un organisateur exemple (Jean Dupont)</li>
                <li>3 notes associées au client</li>
                <li>5 messages entre l'organisateur et le client</li>
                <li>3 fichiers partagés avec le client</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Note : Ces données sont fictives et servent uniquement à des fins de démonstration.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {success ? (
            <Button asChild className="bg-[#c9a227] hover:bg-[#b18e23]">
              <Link href={`/organizer/clients/${clientId}`}>
                Voir le profil client
              </Link>
            </Button>
          ) : (
            <Button 
              onClick={createExampleClient} 
              disabled={isLoading}
              className="bg-[#c9a227] hover:bg-[#b18e23]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                'Créer un client exemple'
              )}
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/organizer/clients">
              Retour à la liste des clients
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
