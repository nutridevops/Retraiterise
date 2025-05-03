import { Timestamp } from "firebase/firestore";

// Resource types
export type ResourceType = 'pdf' | 'video' | 'audio' | 'document' | 'link' | 'printable';

// Resource interface
export interface Resource {
  id?: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  tags?: string[];
  type?: ResourceType | string;
  url?: string;
  thumbnailUrl?: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
  visibleTo?: 'all' | string[]; // Access control (all clients or specific UIDs)
}

// User interface (extends Firebase User)
export interface User {
  id?: string;
  uid: string;
  email: string;
  displayName: string;
  role: 'client' | 'organizer' | 'admin';
  profileImageUrl?: string;
  active?: boolean;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt?: any;
  updatedAt?: any;
  lastLogin?: Timestamp;      // Last login timestamp
}

// Message interface
export interface Message {
  id?: string;
  content: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  timestamp: any;
  read: boolean;
  participants: string[];
  subject?: string;
  createdAt?: any;
}

// Event interface
export interface Event {
  id: string;                // Event ID
  title: string;             // Event title
  description: string;       // Event description
  startTime: Timestamp;      // Start time
  endTime: Timestamp;        // End time
  type: 'zoom' | 'in-person' | 'workshop';
  location?: string;         // Location or Zoom link
  organizers: string[];      // Organizer UIDs
  participants?: string[];   // Participant UIDs (if limited)
  maxParticipants?: number;  // Optional capacity limit
  createdAt: Timestamp;      // Creation date
  updatedAt: Timestamp;      // Last update
}

// Note interface
export interface Note {
  clientId: string;
  content: string;
  createdAt: any;
  createdBy: string;
  createdByName: string;
}

// ClientNote interface
export interface ClientNote extends Note {
  id: string;
}

// ClientFile interface
export interface ClientFile {
  id: string;
  clientId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: any;
  uploadedBy: string;
  uploadedByName: string;
}

// User interface (extends Firebase User)
export interface RiseUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'client' | 'organizer' | 'admin';
  createdAt?: any;
  phoneNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  bio?: string;
  status?: 'active' | 'inactive';
}

// Organizer Profile interface
export interface OrganizerProfile {
  displayName: string;
  email: string;
  phone?: string;
  title?: string;
  bio?: string;
  specialties?: string[];
  certifications?: string[];
  languages?: string[];
  experience?: string;
  education?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  availability?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
  sessionTypes?: {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    capacity: number;
    active: boolean;
  }[];
  avatarUrl?: string;
  coverImageUrl?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
