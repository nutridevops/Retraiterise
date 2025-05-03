// Initialize FAQ accordion functionality
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        // Toggle active class on the FAQ item
        item.classList.toggle('active');
      });
    }
  });
}

// Initialize anchor links for smooth scrolling
function initAnchorLinks() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 20,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}

// Initialize table of contents highlighting
function initTOCHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const tocLinks = document.querySelectorAll('.toc a');
  
  if (sections.length === 0 || tocLinks.length === 0) return;
  
  function highlightTOC() {
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      
      if (window.scrollY >= sectionTop - 100) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    tocLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      
      if (href === currentSectionId) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', highlightTOC);
  highlightTOC(); // Initial highlight
}

// Add a back to top button
function addBackToTopButton() {
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
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize FAQ accordion functionality
  initFaqAccordion();
  
  // Initialize anchor links
  initAnchorLinks();
  
  // Initialize table of contents highlighting
  initTOCHighlighting();
  
  // Add back to top button
  addBackToTopButton();
});
