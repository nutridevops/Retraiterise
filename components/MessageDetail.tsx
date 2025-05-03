'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Message } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Reply, 
  Trash2, 
  Download, 
  Paperclip,
  ArrowLeft
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MessageComposer } from './MessageComposer';

interface MessageDetailProps {
  message: Message;
  onBack: () => void;
  onDelete?: (messageId: string) => void;
  recipients: any[];
}

export function MessageDetail({ message, onBack, onDelete, recipients }: MessageDetailProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);

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
  const isFromCurrentUser = message.senderId === user?.uid;

  // Handle reply
  const handleReply = () => {
    setIsReplying(true);
  };

  // Handle message sent (after reply)
  const handleMessageSent = () => {
    setIsReplying(false);
    onBack(); // Go back to the message list
  };

  // Find the recipient for the reply
  const replyRecipient = recipients.find(
    (r) => r.id === (isFromCurrentUser ? message.receiverId : message.senderId)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-xl font-bold">Détail du message</h2>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {isFromCurrentUser
                    ? getInitials(user?.displayName)
                    : getInitials(message.senderName || 'Utilisateur')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{message.subject || 'Sans objet'}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>
                    {isFromCurrentUser
                      ? `De: Vous (${user?.email})`
                      : `De: ${message.senderName || 'Expéditeur'} (${message.senderEmail || ''})`}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>
                    {isFromCurrentUser
                      ? `À: ${message.receiverName || 'Destinataire'} (${message.receiverEmail || ''})`
                      : `À: Vous (${user?.email})`}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {message.createdAt && (
                <span>
                  {format(message.createdAt.toDate(), 'PPP à HH:mm', { locale: fr })}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <div className="whitespace-pre-wrap mb-4">{message.content}</div>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Paperclip className="h-4 w-4 mr-1" />
                Pièces jointes ({message.attachments.length})
              </h3>
              <div className="space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center">
                      <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">
                        {attachment.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={attachment.name}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReply}
              disabled={isReplying}
            >
              <Reply className="h-4 w-4 mr-2" />
              Répondre
            </Button>
          </div>
          {onDelete && message.id && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(message.id!)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </CardFooter>
      </Card>

      {isReplying && replyRecipient && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Répondre</h3>
          <MessageComposer
            recipients={recipients}
            defaultReceiverId={replyRecipient.id}
            defaultSubject={`Re: ${message.subject || 'Sans objet'}`}
            onMessageSent={handleMessageSent}
            isReply={true}
          />
        </div>
      )}
    </div>
  );
}
