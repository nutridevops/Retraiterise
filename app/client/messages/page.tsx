'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { MessageList } from '@/components/MessageList';
import { MessageDetail } from '@/components/MessageDetail';
import { MessageComposer } from '@/components/MessageComposer';
import { Message } from '@/lib/types';
import { deleteMessage, getAllUsers } from '@/lib/messageService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare, Inbox, Loader2 } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';

export default function ClientMessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch organizers when the component mounts
  useEffect(() => {
    if (user) {
      fetchOrganizers();
    }
  }, [user]);

  // Function to fetch organizers
  const fetchOrganizers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await getAllUsers(user?.uid || '');
      // Filter only organizers and admins
      const organizerUsers = allUsers.filter(
        (u) => u.role === 'organizer' || u.role === 'admin'
      );
      setOrganizers(organizerUsers);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || "Une erreur s'est produite lors du chargement des organisateurs.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle message selection
  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsComposing(false);
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      await deleteMessage(messageId, user.uid);
      
      toast({
        title: 'Message supprimé',
        description: 'Le message a été supprimé avec succès.',
      });
      
      // If the deleted message is currently selected, go back to the list
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || "Une erreur s'est produite lors de la suppression du message.",
        variant: 'destructive',
      });
    }
  };

  // Handle new message composition
  const handleComposeClick = () => {
    setIsComposing(true);
    setSelectedMessage(null);
  };

  // Handle message sent (after composing)
  const handleMessageSent = () => {
    setIsComposing(false);
    // Refresh the message list (this will be handled by the MessageList component)
  };

  // Go back to the message list
  const handleBackToList = () => {
    setSelectedMessage(null);
    setIsComposing(false);
  };

  return (
    <ClientOnly>
      <div className="container mx-auto py-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Messagerie</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Chargement...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {!selectedMessage && !isComposing ? (
              <Tabs defaultValue="inbox" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="inbox" className="flex items-center">
                      <Inbox className="h-4 w-4 mr-2" />
                      Boîte de réception
                    </TabsTrigger>
                  </TabsList>
                  <Button onClick={handleComposeClick} className="bg-[#c9a227] hover:bg-[#b18e23] text-white">
                    <PenSquare className="h-4 w-4 mr-2" />
                    Nouveau message
                  </Button>
                </div>

                <TabsContent value="inbox" className="mt-0">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Vos messages</CardTitle>
                      <CardDescription>
                        Consultez vos messages et communiquez avec les organisateurs de la retraite.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MessageList
                        onSelectMessage={handleSelectMessage}
                        onDeleteMessage={handleDeleteMessage}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : selectedMessage ? (
              <MessageDetail
                message={selectedMessage}
                onBack={handleBackToList}
                onDelete={handleDeleteMessage}
                recipients={organizers}
              />
            ) : isComposing ? (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Button variant="ghost" size="sm" onClick={handleBackToList}>
                    Retour
                  </Button>
                  <h2 className="text-xl font-bold">Nouveau message</h2>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Envoyer un message</CardTitle>
                    <CardDescription>
                      Envoyez un message aux organisateurs de la retraite.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MessageComposer
                      recipients={organizers}
                      onMessageSent={handleMessageSent}
                    />
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
