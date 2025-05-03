'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import OrganizerLayout from '@/components/layouts/OrganizerLayout';

export default function OrganizerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only allow organizer and admin roles to access organizer portal
  const allowedRoles: UserRole[] = ['organizer', 'admin'];

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <OrganizerLayout>
        {children}
      </OrganizerLayout>
    </ProtectedRoute>
  );
}
