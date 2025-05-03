'use client';

import { OrganizerSelector } from '@/components/OrganizerSelector';
import { useState } from 'react';
import { Organizer } from '@/lib/bookingService';

export default function TestPage() {
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | undefined>();
  
  const handleOrganizerSelect = (organizer: Organizer) => {
    console.log('Selected organizer:', organizer);
    setSelectedOrganizerId(organizer.id);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Organizer Selector</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <OrganizerSelector 
          selectedOrganizerId={selectedOrganizerId}
          onOrganizerSelect={handleOrganizerSelect}
          showTitle={true}
        />
      </div>
    </div>
  );
}
