'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrganizerDocumentationPage() {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    // Fetch the content of the guide
    const fetchContent = async () => {
      try {
        const response = await fetch('/documentation/organizer/guide-organisateur.md');
        if (!response.ok) {
          throw new Error('Failed to fetch documentation');
        }
        
        const text = await response.text();
        // Extract the HTML content (remove the link and script tags)
        const contentWithoutTags = text
          .replace(/<link.*?>/g, '')
          .replace(/<script.*?<\/script>/g, '');
        
        setContent(contentWithoutTags);
      } catch (error) {
        console.error('Error fetching documentation:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5dc] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#0A291C]">Documentation R.I.S.E.</h1>
          <div className="flex gap-4">
            <Link href="/organizer/dashboard" className="px-4 py-2 bg-[#0A291C] text-white rounded hover:bg-[#153e2c]">
              Retour au Dashboard
            </Link>
            <Link href="/documentation/client" className="px-4 py-2 bg-[#0A291C] text-white rounded hover:bg-[#153e2c]">
              Guide Client
            </Link>
            <Link href="/documentation/organizer" className="px-4 py-2 bg-[#c9a227] text-white rounded hover:bg-[#a58420]">
              Guide Organisateur
            </Link>
          </div>
        </div>
        
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
