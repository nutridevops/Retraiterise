'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// CSS for documentation
const documentationStyles = `
:root {
  --text-color: #333;
  --background-color: #f5f5dc;
  --card-background: #fff;
  --code-background: #f5f5f5;
  --border-color: #ddd;
  --primary-color: #c9a227;
  --secondary-color: #0A291C;
  --link-color: #0070f3;
  --danger-color: #e53e3e;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --primary-hover-color: #a58420;
}

.documentation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--card-background);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
}

@media (min-width: 992px) {
  .documentation-container {
    flex-direction: row;
    gap: 2rem;
    min-height: 100vh;
  }
}

.documentation-content {
  flex: 1;
  min-width: 0;
}

.toc {
  background-color: var(--code-background);
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
  border-left: 4px solid var(--primary-color);
  width: 100%;
}

@media (min-width: 992px) {
  .toc {
    position: sticky;
    top: 2rem;
    width: 280px;
    flex-shrink: 0;
    align-self: flex-start;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    margin-bottom: 0;
  }
}

.toc h2 {
  margin-top: 0;
  font-size: 1.4rem;
  border-bottom: none;
}

.toc ol {
  padding-left: 1.5rem;
  margin-bottom: 0;
}

.toc li {
  margin-bottom: 0.5rem;
}

.toc a {
  display: block;
  padding: 0.25rem 0;
  transition: color 0.2s ease, transform 0.2s ease;
}

.toc a:hover {
  transform: translateX(3px);
}

.toc a.active {
  color: var(--primary-color);
  font-weight: 600;
}

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.back-to-top.visible {
  opacity: 1;
}

.back-to-top:hover {
  background-color: var(--primary-hover-color);
}

@media (max-width: 991px) {
  .toc {
    position: sticky;
    top: 0;
    z-index: 10;
    max-height: none;
    overflow-y: visible;
  }
  
  .back-to-top {
    bottom: 1rem;
    right: 1rem;
  }
}

h1 {
  font-size: 2.5rem;
  margin-top: 0;
  color: var(--secondary-color);
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

h2 {
  font-size: 1.8rem;
  margin-top: 2rem;
  color: var(--secondary-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.3rem;
}

h3 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  color: var(--secondary-color);
}

.callout {
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  border-left: 4px solid;
}

.callout-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.callout-info {
  background-color: rgba(23, 162, 184, 0.1);
  border-left-color: var(--info-color);
}

.callout-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border-left-color: var(--warning-color);
}

.callout-tip {
  background-color: rgba(40, 167, 69, 0.1);
  border-left-color: var(--success-color);
}

.faq-item {
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.faq-question {
  padding: 1rem;
  background-color: var(--code-background);
  font-weight: bold;
  cursor: pointer;
  position: relative;
}

.faq-answer {
  padding: 1rem;
  display: none;
}

.faq-item.active .faq-answer {
  display: block;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.nav-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.nav-button:hover {
  background-color: var(--primary-hover-color);
  text-decoration: none;
  color: white;
}
`;

export default function OrganizerDocumentationPage() {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    // Initialize FAQ accordion functionality
    const initFaqAccordion = () => {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
          question.addEventListener('click', () => {
            // Toggle active class on the FAQ item
            item.classList.toggle('active');
          });
        }
      });
    };

    // Initialize table of contents highlighting
    const initTOCHighlighting = () => {
      const sections = document.querySelectorAll('section[id]');
      const tocLinks = document.querySelectorAll('.toc a');
      
      if (sections.length === 0 || tocLinks.length === 0) return;
      
      const highlightTOC = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
          const sectionTop = section.getBoundingClientRect().top;
          
          if (sectionTop < 100) {
            currentSectionId = section.id;
          }
        });
        
        tocLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          
          if (href && href.substring(1) === currentSectionId) {
            link.classList.add('active');
          }
        });
      };
      
      window.addEventListener('scroll', highlightTOC);
      highlightTOC(); // Initial highlight
    };

    // Add a back to top button
    const addBackToTopButton = () => {
      // Create the button element
      const backToTopButton = document.createElement('div');
      backToTopButton.className = 'back-to-top';
      backToTopButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
      document.body.appendChild(backToTopButton);

      // Show/hide the button based on scroll position
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });

      // Scroll to top when clicked
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    };

    // Initialize anchor links for smooth scrolling
    const initAnchorLinks = () => {
      const anchorLinks = document.querySelectorAll('.toc a');
      
      anchorLinks.forEach(link => {
        link.addEventListener('click', (e: Event) => {
          e.preventDefault();
          
          const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
          const targetId = href?.substring(1);
          if (!targetId) return;
          
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 20,
              behavior: 'smooth'
            });
          }
        });
      });
    };

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
        
        // Initialize after content is loaded
        setTimeout(() => {
          initFaqAccordion();
          initTOCHighlighting();
          addBackToTopButton();
          initAnchorLinks();
        }, 100);
      } catch (error) {
        console.error('Error fetching documentation:', error);
      }
    };

    fetchContent();

    // Cleanup function
    return () => {
      const backToTopButton = document.querySelector('.back-to-top');
      if (backToTopButton) {
        backToTopButton.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5dc] py-8">
      <style dangerouslySetInnerHTML={{ __html: documentationStyles }} />
      
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
