'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ClientsPage() {
  const [clients, setClients] = useState<User[]>([]);
  const [filteredClients, setFilteredClients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const usersRef = collection(db, 'users');
        const clientsQuery = query(usersRef, where('role', '==', 'client'));
        const querySnapshot = await getDocs(clientsQuery);
        
        const clientsData: User[] = [];
        querySnapshot.forEach((doc) => {
          clientsData.push({ id: doc.id, ...doc.data() } as User);
        });
        
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = clients.filter(client => 
      client.displayName?.toLowerCase().includes(query) || 
      client.email?.toLowerCase().includes(query)
    );
    
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const getInitials = (name: string | undefined) => {
    if (!name) return 'CL';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <Button className="bg-[#c9a227] hover:bg-[#b18e23]">
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un client..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous les clients</TabsTrigger>
          <TabsTrigger value="active">Clients actifs</TabsTrigger>
          <TabsTrigger value="inactive">Clients inactifs</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a227]"></div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Aucun client trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border border-gray-200">
                          <AvatarImage src={client.profileImageUrl || ''} alt={client.displayName || 'Client'} />
                          <AvatarFallback>{getInitials(client.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{client.displayName || 'Client sans nom'}</CardTitle>
                          <CardDescription className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={client.active ? "default" : "outline"} className={client.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                        {client.active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>Inscrit le: {client.createdAt ? 
                          (typeof client.createdAt === 'object' && 'toDate' in client.createdAt 
                            ? format(client.createdAt.toDate(), 'PPP', { locale: fr })
                            : format(new Date(client.createdAt), 'PPP', { locale: fr })) 
                          : 'Date inconnue'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Link 
                        href={`/organizer/clients/${client.id}`} 
                        className="text-sm font-medium text-[#c9a227] hover:underline"
                      >
                        Voir le profil
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sm"
                        asChild
                      >
                        <Link href={`/organizer/messages?to=${client.id}`}>
                          <Mail className="h-4 w-4 mr-1" />
                          Message
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a227]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients
                .filter(client => client.active)
                .map((client) => (
                  <Card key={client.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border border-gray-200">
                            <AvatarImage src={client.profileImageUrl || ''} alt={client.displayName || 'Client'} />
                            <AvatarFallback>{getInitials(client.displayName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{client.displayName || 'Client sans nom'}</CardTitle>
                            <CardDescription className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.email}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Actif
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Inscrit le: {client.createdAt ? 
                            (typeof client.createdAt === 'object' && 'toDate' in client.createdAt 
                              ? format(client.createdAt.toDate(), 'PPP', { locale: fr })
                              : format(new Date(client.createdAt), 'PPP', { locale: fr })) 
                            : 'Date inconnue'}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Link 
                          href={`/organizer/clients/${client.id}`} 
                          className="text-sm font-medium text-[#c9a227] hover:underline"
                        >
                          Voir le profil
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-sm"
                          asChild
                        >
                          <Link href={`/organizer/messages?to=${client.id}`}>
                            <Mail className="h-4 w-4 mr-1" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="inactive" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a227]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients
                .filter(client => !client.active)
                .map((client) => (
                  <Card key={client.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border border-gray-200">
                            <AvatarImage src={client.profileImageUrl || ''} alt={client.displayName || 'Client'} />
                            <AvatarFallback>{getInitials(client.displayName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{client.displayName || 'Client sans nom'}</CardTitle>
                            <CardDescription className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.email}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">
                          Inactif
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Inscrit le: {client.createdAt ? 
                            (typeof client.createdAt === 'object' && 'toDate' in client.createdAt 
                              ? format(client.createdAt.toDate(), 'PPP', { locale: fr })
                              : format(new Date(client.createdAt), 'PPP', { locale: fr })) 
                            : 'Date inconnue'}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Link 
                          href={`/organizer/clients/${client.id}`} 
                          className="text-sm font-medium text-[#c9a227] hover:underline"
                        >
                          Voir le profil
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-sm"
                          asChild
                        >
                          <Link href={`/organizer/messages?to=${client.id}`}>
                            <Mail className="h-4 w-4 mr-1" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
