'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrganizerProfile } from '@/lib/types';
import { 
  PersonalInfoTab,
  ProfessionalInfoTab,
  LocationContactTab,
  SessionTypesTab,
  AvailabilityTab,
  SocialLinksTab
} from './profile-tabs';

interface OrganizerProfileTabsProps {
  profile: OrganizerProfile;
  activeTab: string;
  onProfileUpdate: (updatedProfile: Partial<OrganizerProfile>) => void;
}

export function OrganizerProfileTabs({ 
  profile, 
  activeTab,
  onProfileUpdate
}: OrganizerProfileTabsProps) {
  return (
    <div className="space-y-6">
      {activeTab === 'personal' && (
        <PersonalInfoTab 
          profile={profile} 
          onProfileUpdate={onProfileUpdate} 
        />
      )}
      
      {activeTab === 'professional' && (
        <ProfessionalInfoTab 
          profile={profile} 
          onProfileUpdate={onProfileUpdate} 
        />
      )}
      
      {activeTab === 'location' && (
        <LocationContactTab 
          profile={profile} 
          onProfileUpdate={onProfileUpdate} 
        />
      )}
      
      {activeTab === 'sessions' && (
        <SessionTypesTab 
          profile={profile} 
          onProfileUpdate={onProfileUpdate} 
        />
      )}
      
      {activeTab === 'availability' && (
        <AvailabilityTab 
          profile={profile} 
          onProfileUpdate={onProfileUpdate} 
        />
      )}
      
      {activeTab === 'social' && (
        <SocialLinksTab 
          profile={profile} 
          onProfileUpdate={onProfileUpdate} 
        />
      )}
    </div>
  );
}
