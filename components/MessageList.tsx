'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { markMessageAsRead } from '@/lib/messageService';
import { Message } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useMessages } from '@/hooks/use-messages';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Paperclip, 
  Loader2, 
  ChevronDown 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageListProps {
  onSelectMessage?: (message: Message) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export function MessageList({ onSelectMessage, onDeleteMessage }: MessageListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, loading: isLoading, error } = useMessages();
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Update filtered messages when messages change
  useEffect(() => {
    setFilteredMessages(messages.slice(0, 20));
    setHasMore(messages.length > 20);
  }, [messages]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erreur',
        description: error || "Une erreur s'est produite lors du chargement des messages.",
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Handle message selection
  const handleSelectMessage = async (message: Message) => {
    if (onSelectMessage) {
      onSelectMessage(message);
    }

    // If the message is unread and the current user is the receiver, mark it as read
    if (!message.read && message.receiverId === user?.uid && message.id) {
      try {
        await markMessageAsRead(message.id);
        // The real-time listener will update the UI
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

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
  const isFromCurrentUser = (message: Message) => {
    return message.senderId === user?.uid;
  };

  // Load more messages
  const loadMoreMessages = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      setFilteredMessages(messages.slice(0, filteredMessages.length + 20));
      setHasMore(messages.length > filteredMessages.length + 20);
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Chargement des messages...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Mail className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            Aucun message pour le moment.
          </p>
        </div>
      ) : (
        <>
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                !message.read && message.receiverId === user?.uid
                  ? 'border-l-4 border-l-primary'
                  : ''
              }`}
              onClick={() => handleSelectMessage(message)}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback>
                        {isFromCurrentUser(message)
                          ? getInitials(user?.displayName)
                          : getInitials(message.senderName || 'Utilisateur')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {message.subject || 'Sans objet'}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {isFromCurrentUser(message)
                          ? `À: ${message.receiverName || 'Destinataire'}`
                          : `De: ${message.senderName || 'Expéditeur'}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!message.read && message.receiverId === user?.uid && (
                      <Badge variant="default" className="bg-primary">
                        Non lu
                      </Badge>
                    )}
                    {message.attachments && message.attachments.length > 0 && (
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                    )}
                    {!message.read && message.receiverId === user?.uid ? (
                      <MailOpen className="h-4 w-4 text-primary" />
                    ) : (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {message.content}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <span className="text-xs text-muted-foreground">
                  {message.createdAt
                    ? formatDistanceToNow(message.createdAt.toDate(), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : ''}
                </span>
                {onDeleteMessage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (message.id) onDeleteMessage(message.id);
                    }}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}

          {hasMore && (
            <Button
              variant="outline"
              className="w-full"
              onClick={loadMoreMessages}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Charger plus de messages
                </>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
