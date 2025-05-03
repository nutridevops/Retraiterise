'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import ClientLayout from '@/components/layouts/ClientLayout';

export default function ClientAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only allow client, organizer, and admin roles to access client portal
  const allowedRoles: UserRole[] = ['client', 'organizer', 'admin'];

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <ClientLayout>
        {children}
      </ClientLayout>
    </ProtectedRoute>
  );
}
