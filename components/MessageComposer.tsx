'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth';
import { sendMessage } from '@/lib/messageService';
import { useToast } from '@/hooks/use-toast';

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
import { Loader2, Send, Paperclip, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Define the form schema with Zod
const messageFormSchema = z.object({
  receiverId: z.string().min(1, {
    message: 'Veuillez sélectionner un destinataire',
  }),
  subject: z.string().min(1, {
    message: 'Veuillez entrer un objet',
  }),
  content: z.string().min(1, {
    message: 'Veuillez entrer un message',
  }),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

interface Recipient {
  id: string;
  displayName: string;
  email: string;
  role?: string;
}

interface MessageComposerProps {
  recipients: Recipient[];
  onMessageSent?: () => void;
  defaultReceiverId?: string;
  defaultSubject?: string;
  defaultContent?: string;
  isReply?: boolean;
}

export function MessageComposer({
  recipients,
  onMessageSent,
  defaultReceiverId,
  defaultSubject,
  defaultContent,
  isReply = false,
}: MessageComposerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the form
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      receiverId: defaultReceiverId || '',
      subject: defaultSubject || '',
      content: defaultContent || '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: MessageFormValues) => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour envoyer des messages.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSending(true);

      // Find the recipient to get their name
      const recipient = recipients.find((r) => r.id === values.receiverId);
      const receiverName = recipient?.displayName || '';

      // Send the message
      await sendMessage(
        user.uid,
        values.receiverId,
        values.subject,
        values.content,
        attachments.length > 0 ? attachments : undefined
      );

      toast({
        title: 'Message envoyé',
        description: `Votre message a été envoyé à ${receiverName}.`,
      });

      // Reset the form
      form.reset();
      setAttachments([]);

      // Call the onMessageSent callback if provided
      if (onMessageSent) onMessageSent();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || "Une erreur s'est produite lors de l'envoi du message.",
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isReply && (
          <FormField
            control={form.control}
            name="receiverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinataire</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSending || !!defaultReceiverId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un destinataire" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {recipients.map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        {recipient.displayName} ({recipient.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choisissez la personne à qui vous souhaitez envoyer ce message.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objet</FormLabel>
              <FormControl>
                <Input placeholder="Objet du message" {...field} disabled={isSending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Votre message..."
                  className="min-h-[150px]"
                  {...field}
                  disabled={isSending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attachments section */}
        <div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
            >
              <Paperclip className="mr-2 h-4 w-4" />
              Ajouter des pièces jointes
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <span className="text-xs text-muted-foreground">
              {attachments.length} fichier(s) sélectionné(s)
            </span>
          </div>

          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <Card key={index} className="p-2">
                  <CardContent className="p-0 flex items-center justify-between">
                    <div className="flex items-center">
                      <Paperclip className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#c9a227] hover:bg-[#b18e23] text-white"
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Envoyer le message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
