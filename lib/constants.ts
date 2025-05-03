// Application-wide constants
import { Organizer, SessionType } from './bookingService';

export const ORGANIZERS: Organizer[] = [
  {
    id: "laetitia-lusakivana",
    name: "Laetitia Lusakivana",
    title: "Expert en neuroperformance & neurosciences appliquées",
    email: "laetitia@rise-retreat.com",
    imageUrl: "/images/team/laetitia-lusakivana.svg",
  },
  {
    id: "sandra-leguede",
    name: "Sandra Leguede",
    title: "Coach en neurofitness & bien-être",
    email: "sandra@rise-retreat.com",
    imageUrl: "/images/team/sandra-leguede.svg",
  },
  {
    id: "chris-massamba",
    name: "Chris Massamba",
    title: "Expert en neuro-nutrition",
    email: "chris@rise-retreat.com",
    imageUrl: "/images/team/chris-massamba.svg",
  },
];

export const SESSION_TYPES: SessionType[] = [
  {
    id: "neuroperformance",
    name: "Séance de Neuroperformance",
    description: "Optimisez vos performances cognitives et mentales avec des techniques basées sur les neurosciences.",
    duration: 60,
    price: 120,
    organizerId: "laetitia-lusakivana",
    isActive: true,
  },
  {
    id: "neurofitness",
    name: "Coaching Neurofitness",
    description: "Améliorez votre bien-être physique et mental avec des exercices adaptés à votre profil neurologique.",
    duration: 45,
    price: 90,
    organizerId: "sandra-leguede",
    isActive: true,
  },
  {
    id: "neuronutrition",
    name: "Consultation Neuro-nutrition",
    description: "Découvrez comment l'alimentation peut optimiser le fonctionnement de votre cerveau et améliorer votre santé globale.",
    duration: 60,
    price: 100,
    organizerId: "chris-massamba",
    isActive: true,
  },
];
