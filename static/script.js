/* ============================================
   CELLEB - Main JavaScript
   ============================================ */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = mobileNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
      });
    });
  }

  // Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Scroll to Top on Navigation Click
  const navLinks = document.querySelectorAll('a[href^="/"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    });
  });

  // Active Link Highlighting
  const currentPage = window.location.pathname;
  const allNavLinks = document.querySelectorAll('.top-nav a, .mobile-nav a');
  
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '/' && href === '/')) {
      link.style.color = '#d4af37';
      link.style.fontWeight = 'bold';
    }
  });

  // Search Box Toggle
  const searchBtn = document.querySelector('[aria-label="Search"]');
  const searchBox = document.querySelector('.search-box');
  
  if (searchBtn && searchBox) {
    searchBtn.addEventListener('click', function() {
      searchBox.classList.toggle('active');
    });
  }
});

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  const lazyImages = document.querySelectorAll('img.lazy');
  lazyImages.forEach(img => imageObserver.observe(img));
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});
