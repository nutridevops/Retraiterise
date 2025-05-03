'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMessages } from '@/hooks/use-messages';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MailOpen, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';

interface RecentMessagesWidgetProps {
  maxMessages?: number;
  portalType: 'client' | 'organizer';
}

export function RecentMessagesWidget({ maxMessages = 3, portalType }: RecentMessagesWidgetProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { messages, loading } = useMessages();
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setRecentMessages(messages.slice(0, maxMessages));
    }
  }, [messages, maxMessages]);

  // Get initials for avatar
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine if the message is from the current user
  const isFromCurrentUser = (message: any) => {
    return message.senderId === user?.uid;
  };

  const navigateToMessages = () => {
    router.push(`/${portalType}/messages`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Messages récents</CardTitle>
            <CardDescription>
              Vos dernières communications
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {loading ? '...' : messages.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {loading ? (
          <div className="flex justify-center py-6">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Mail className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-center text-muted-foreground">
              Aucun message pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-accent/50 cursor-pointer"
                onClick={navigateToMessages}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {isFromCurrentUser(message)
                      ? getInitials(user?.displayName)
                      : getInitials(message.senderName || 'Utilisateur')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {isFromCurrentUser(message)
                        ? `À: ${message.receiverName || 'Destinataire'}`
                        : `De: ${message.senderName || 'Expéditeur'}`}
                    </p>
                    <div className="flex items-center">
                      {!message.read && message.receiverId === user?.uid ? (
                        <Badge variant="default" className="ml-2 bg-primary">
                          Non lu
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {message.subject || 'Sans objet'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {message.createdAt
                      ? formatDistanceToNow(message.createdAt.toDate(), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : ''}
                  </p>
                </div>
                {!message.read && message.receiverId === user?.uid ? (
                  <MailOpen className="h-4 w-4 text-primary flex-shrink-0" />
                ) : (
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={navigateToMessages}
        >
          Voir tous les messages
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
