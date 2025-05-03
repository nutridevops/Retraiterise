'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DocumentationPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to client guide by default
    router.push('/documentation/client');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Documentation R.I.S.E. Retreat</h1>
        <p className="mb-4">Redirection vers la documentation...</p>
        <div className="flex gap-4 justify-center">
          <Link href="/documentation/client" className="px-4 py-2 bg-[#c9a227] text-white rounded hover:bg-[#a58420]">
            Guide Client
          </Link>
          <Link href="/documentation/organizer" className="px-4 py-2 bg-[#0A291C] text-white rounded hover:bg-[#153e2c]">
            Guide Organisateur
          </Link>
        </div>
      </div>
    </div>
  );
}
