'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { User, Note, Message } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Calendar, Mail, Phone, MapPin, Edit, Save, Plus, FileText, Send, Upload, Paperclip, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientNote extends Note {
  id: string;
}

interface ClientFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const { user } = useAuth();
  const [client, setClient] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<User>>({});
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || !user) return;
      
      try {
        setIsLoading(true);
        const clientDoc = await getDoc(doc(db, 'users', clientId as string));
        
        if (clientDoc.exists()) {
          const clientData = { id: clientDoc.id, ...clientDoc.data() } as User;
          setClient(clientData);
          setEditedClient(clientData);
        }
        
        // Fetch client notes
        try {
          // Try with ordering first
          const notesQuery = query(
            collection(db, 'notes'),
            where('clientId', '==', clientId),
            orderBy('createdAt', 'desc')
          );
          
          const notesSnapshot = await getDocs(notesQuery);
          const notesData: ClientNote[] = [];
          
          notesSnapshot.forEach((doc) => {
            notesData.push({ id: doc.id, ...doc.data() } as ClientNote);
          });
          
          setNotes(notesData);
        } catch (notesError) {
          console.error('Error with ordered notes query, falling back to simple query:', notesError);
          
          // Fallback to simple query without ordering if index doesn't exist
          const simpleNotesQuery = query(
            collection(db, 'notes'),
            where('clientId', '==', clientId)
          );
          
          const notesSnapshot = await getDocs(simpleNotesQuery);
          const notesData: ClientNote[] = [];
          
          notesSnapshot.forEach((doc) => {
            notesData.push({ id: doc.id, ...doc.data() } as ClientNote);
          });
          
          // Sort client-side instead
          notesData.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          setNotes(notesData);
        }
        
        // Fetch client files
        try {
          // Try with ordering first
          const filesQuery = query(
            collection(db, 'files'),
            where('clientId', '==', clientId),
            orderBy('uploadedAt', 'desc')
          );
          
          const filesSnapshot = await getDocs(filesQuery);
          const filesData: ClientFile[] = [];
          
          filesSnapshot.forEach((doc) => {
            filesData.push({ id: doc.id, ...doc.data() } as ClientFile);
          });
          
          setFiles(filesData);
        } catch (filesError) {
          console.error('Error with ordered files query, falling back to simple query:', filesError);
          
          // Fallback to simple query without ordering if index doesn't exist
          const simpleFilesQuery = query(
            collection(db, 'files'),
            where('clientId', '==', clientId)
          );
          
          const filesSnapshot = await getDocs(simpleFilesQuery);
          const filesData: ClientFile[] = [];
          
          filesSnapshot.forEach((doc) => {
            filesData.push({ id: doc.id, ...doc.data() } as ClientFile);
          });
          
          // Sort client-side instead
          filesData.sort((a, b) => {
            if (!a.uploadedAt || !b.uploadedAt) return 0;
            
            const dateA = typeof a.uploadedAt === 'object' && 'toDate' in a.uploadedAt 
              ? a.uploadedAt.toDate().getTime() 
              : new Date(a.uploadedAt).getTime();
              
            const dateB = typeof b.uploadedAt === 'object' && 'toDate' in b.uploadedAt 
              ? b.uploadedAt.toDate().getTime() 
              : new Date(b.uploadedAt).getTime();
              
            return dateB - dateA; // descending order
          });
          
          setFiles(filesData);
        }
        
        // Fetch messages between organizer and client
        const messagesQuery = query(
          collection(db, 'messages'),
          where('participants', 'array-contains', [user.id, clientId]),
          orderBy('timestamp', 'asc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesData: Message[] = [];
        
        messagesSnapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() } as Message);
        });
        
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId, user]);

  const handleSaveChanges = async () => {
    if (!client || !clientId) return;
    
    try {
      await updateDoc(doc(db, 'users', clientId as string), {
        ...editedClient,
        updatedAt: new Date()
      });
      
      setClient({ ...client, ...editedClient });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !clientId || !user) return;
    
    try {
      const noteData = {
        clientId,
        content: newNote,
        createdAt: new Date(),
        createdBy: user.id,
        createdByName: user.displayName || 'Organizer'
      };
      
      const docRef = await addDoc(collection(db, 'notes'), noteData);
      
      setNotes([{ id: docRef.id, ...noteData } as ClientNote, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !clientId || !user) return;
    
    try {
      setUploadingFile(true);
      
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `client-files/${clientId}/${Date.now()}_${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      
      // Get download URL
      const downloadURL = await getDownloadURL(fileRef);
      
      // Save file metadata to Firestore
      const fileData = {
        clientId,
        name: selectedFile.name,
        url: downloadURL,
        type: selectedFile.type,
        size: selectedFile.size,
        uploadedAt: new Date(),
        uploadedBy: user.id,
        uploadedByName: user.displayName || 'Organizer'
      };
      
      const docRef = await addDoc(collection(db, 'files'), fileData);
      
      setFiles([{ id: docRef.id, ...fileData } as ClientFile, ...files]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !clientId || !user) return;
    
    try {
      setSendingMessage(true);
      
      const messageData = {
        content: newMessage,
        senderId: user.id,
        senderName: user.displayName || 'Organizer',
        receiverId: clientId,
        timestamp: new Date(),
        read: false,
        participants: [user.id, clientId]
      };
      
      const docRef = await addDoc(collection(db, 'messages'), messageData);
      
      setMessages([...messages, { id: docRef.id, ...messageData } as Message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'CL';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a227]"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <h2 className="text-xl font-semibold mb-2">Client introuvable</h2>
        <p className="text-muted-foreground mb-4">Le client demandé n'existe pas ou a été supprimé.</p>
        <Button asChild>
          <Link href="/organizer/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste des clients
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/organizer/clients">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Profil Client</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border border-gray-200">
                <AvatarImage src={client.profileImageUrl || ''} alt={client.displayName || 'Client'} />
                <AvatarFallback>{getInitials(client.displayName)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle className="text-2xl">{client.displayName || 'Client sans nom'}</CardTitle>
                <CardDescription className="flex items-center justify-center mt-1">
                  <Mail className="h-3 w-3 mr-1" />
                  {client.email}
                </CardDescription>
                <Badge variant={client.active ? "default" : "outline"} className={client.active ? "bg-green-100 text-green-800 hover:bg-green-100 mt-2" : "mt-2"}>
                  {client.active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nom complet</Label>
                    <Input
                      id="displayName"
                      value={editedClient.displayName || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, displayName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={editedClient.phone || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      value={editedClient.address || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={editedClient.bio || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, bio: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{client.address || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Inscrit le: {client.createdAt ? 
                      (typeof client.createdAt === 'object' && 'toDate' in client.createdAt 
                        ? format(client.createdAt.toDate(), 'PPP', { locale: fr })
                        : format(new Date(client.createdAt), 'PPP', { locale: fr })) 
                      : 'Date inconnue'}</span>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Biographie</h3>
                    <p className="text-sm text-muted-foreground">{client.bio || 'Aucune biographie disponible.'}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleSaveChanges} className="flex-1 bg-[#c9a227] hover:bg-[#b18e23]">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Modifier le profil
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Tabs for Notes, Files, and Messages */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="files">Fichiers</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notes du client</CardTitle>
                  <CardDescription>
                    Ajoutez des notes et des observations sur ce client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ajouter une nouvelle note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleAddNote} className="bg-[#c9a227] hover:bg-[#b18e23]">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[400px] pr-4">
                      {notes.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>Aucune note pour ce client</p>
                          <p className="text-sm">Ajoutez la première note ci-dessus</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {notes.map((note) => (
                            <Card key={note.id}>
                              <CardContent className="pt-4">
                                <p className="text-sm">{note.content}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    Par {note.createdByName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(
                                      typeof note.createdAt === 'object' && 'toDate' in note.createdAt 
                                        ? note.createdAt.toDate() 
                                        : new Date(note.createdAt), 
                                      'PPp', 
                                      { locale: fr }
                                    )}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fichiers du client</CardTitle>
                  <CardDescription>
                    Partagez des documents avec votre client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1 border rounded-md p-2">
                        <Input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                        <Label
                          htmlFor="file-upload"
                          className="flex items-center justify-center gap-2 cursor-pointer p-4 border border-dashed rounded-md hover:bg-gray-50"
                        >
                          <Upload className="h-4 w-4" />
                          {selectedFile ? selectedFile.name : 'Sélectionner un fichier'}
                        </Label>
                      </div>
                      <Button 
                        onClick={handleFileUpload} 
                        disabled={!selectedFile || uploadingFile}
                        className="bg-[#c9a227] hover:bg-[#b18e23]"
                      >
                        {uploadingFile ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Paperclip className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[400px] pr-4">
                      {files.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>Aucun fichier pour ce client</p>
                          <p className="text-sm">Ajoutez le premier fichier ci-dessus</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {files.map((file) => (
                            <Card key={file.id}>
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <a 
                                      href={file.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[#c9a227] hover:underline"
                                    >
                                      {file.name}
                                    </a>
                                  </div>
                                  <Badge variant="outline">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    Par {file.uploadedByName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(
                                      typeof file.uploadedAt === 'object' && 'toDate' in file.uploadedAt 
                                        ? file.uploadedAt.toDate() 
                                        : new Date(file.uploadedAt), 
                                      'PPp', 
                                      { locale: fr }
                                    )}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    Communiquez directement avec votre client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ScrollArea className="h-[400px] pr-4 mb-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Mail className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>Aucun message avec ce client</p>
                          <p className="text-sm">Envoyez le premier message ci-dessous</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div 
                              key={message.id} 
                              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.senderId === user?.id 
                                    ? 'bg-[#c9a227] text-white' 
                                    : 'bg-gray-100'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {format(
                                    typeof message.timestamp === 'object' && 'toDate' in message.timestamp 
                                      ? message.timestamp.toDate() 
                                      : new Date(message.timestamp), 
                                    'HH:mm', 
                                    { locale: fr }
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Écrivez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim() || sendingMessage}
                        className="bg-[#c9a227] hover:bg-[#b18e23]"
                      >
                        {sendingMessage ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
