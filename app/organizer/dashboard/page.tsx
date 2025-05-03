'use client';

import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, MessageSquare, Calendar, BarChart, PlusCircle, Settings, UserPlus, BookOpen } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '@/components/ClientOnly';
import { RecentMessagesWidget } from '@/components/RecentMessagesWidget';
import Image from 'next/image';

export default function OrganizerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header with welcome message */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#0A291C] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <div className="bg-[#D4AF37] rounded-full p-3">
            <Users className="h-8 w-8 text-[#0A291C]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bienvenue, {user?.displayName || 'Organisateur'}
            </h1>
            <p className="text-gray-300">
              Portail de gestion pour l'équipe R.I.S.E. Retreat
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button className="bg-[#D4AF37] hover:bg-[#c9a227] text-[#0A291C]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvel événement
          </Button>
          <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#0A291C]/50">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis le mois dernier
            </p>
            <div className="mt-2">
              <Link href="/organizer/clients" className="text-xs text-blue-600 hover:underline">
                Voir tous les clients →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ressources</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +5 depuis le mois dernier
            </p>
            <div className="mt-2">
              <Link href="/organizer/resources" className="text-xs text-amber-600 hover:underline">
                Gérer les ressources →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions programmées</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Pour les 7 prochains jours
            </p>
            <div className="mt-2">
              <Link href="/organizer/bookings" className="text-xs text-green-600 hover:underline">
                Voir le calendrier →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages non lus</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Nouveaux messages
            </p>
            <div className="mt-2">
              <Link href="/organizer/messages" className="text-xs text-purple-600 hover:underline">
                Voir les messages →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-[#0A291C]">Actions rapides</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-[#0A291C]">
                <UserPlus className="mr-2 h-5 w-5 text-blue-600" />
                Gérer les clients
              </CardTitle>
              <CardDescription>
                Voir et gérer les comptes clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-[#0A291C] hover:bg-[#0c3423] text-white">
                <Link href="/organizer/clients">
                  Voir les clients
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-[#0A291C]">
                <BookOpen className="mr-2 h-5 w-5 text-amber-600" />
                Ajouter une ressource
              </CardTitle>
              <CardDescription>
                Télécharger un nouveau document ou vidéo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-[#0A291C] hover:bg-[#0c3423] text-white">
                <Link href="/organizer/resources/new">
                  Ajouter une ressource
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-[#0A291C]">
                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                Créer un événement
              </CardTitle>
              <CardDescription>
                Planifier un nouvel atelier ou session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-[#0A291C] hover:bg-[#0c3423] text-white">
                <Link href="/organizer/events/new">
                  Créer un événement
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Messages */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-[#0A291C]">Messages récents</h2>
        <Card className="bg-white border-none shadow-md">
          <CardContent className="p-0">
            <ClientOnly>
              <RecentMessagesWidget portalType="organizer" maxMessages={5} />
            </ClientOnly>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-[#0A291C]">Activité récente</h2>
        <div className="space-y-4">
          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-[#0A291C]">Nouveau client inscrit</p>
                <p className="text-sm text-muted-foreground">Marie Dupont - 29 Avril 2025</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-[#0A291C]">Ressource téléchargée</p>
                <p className="text-sm text-muted-foreground">Guide de méditation - 28 Avril 2025</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-[#0A291C]">Session réservée</p>
                <p className="text-sm text-muted-foreground">Jean Martin - 27 Avril 2025</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Preview */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-[#0A291C]">Aperçu des analyses</h2>
        <Card className="bg-white border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-[#0A291C]">Engagement des clients</CardTitle>
            <CardDescription>
              Aperçu de l'activité des clients sur le portail
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <BarChart className="h-16 w-16 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Les analyses détaillées seront disponibles prochainement
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
