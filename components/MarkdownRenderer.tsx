'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MarkdownRendererProps {
  filePath: string;
  className?: string;
}

export function MarkdownRenderer({ filePath, className = '' }: MarkdownRendererProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch(filePath);
        
        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Error loading markdown file:', err);
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [filePath]);

  useEffect(() => {
    // This effect runs after the content is loaded and rendered
    // It adds the necessary styling and enables the JavaScript functionality
    if (!loading && content && typeof window !== 'undefined') {
      // Add the CSS file if it doesn't already exist
      if (!document.getElementById('documentation-css')) {
        const link = document.createElement('link');
        link.id = 'documentation-css';
        link.rel = 'stylesheet';
        link.href = '/documentation/documentation.css';
        document.head.appendChild(link);
      }

      // Add the JS file if it doesn't already exist
      if (!document.getElementById('documentation-js')) {
        const script = document.createElement('script');
        script.id = 'documentation-js';
        script.src = '/documentation/documentation.js';
        script.defer = true;
        document.body.appendChild(script);
      }

      // Initialize any JavaScript functionality
      document.body.classList.add('js-enabled');
    }
  }, [loading, content]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border rounded-lg bg-red-50">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
