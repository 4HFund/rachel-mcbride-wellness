document.addEventListener('DOMContentLoaded', () => {
  // 1. Premium Cascading Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', 
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Automatic stagger effect for luxurious reveal
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Attach observer and calculate staggered delays automatically
  document.querySelectorAll('.fade-up').forEach((el, index) => {
    if (!el.classList.contains('delay-1') && 
        !el.classList.contains('delay-2') && 
        !el.classList.contains('delay-3') && 
        !el.classList.contains('delay-4') && 
        !el.classList.contains('delay-5')) {
       el.dataset.delay = (index % 4) * 100; 
    }
    observer.observe(el);
  });

  // Hero section elements should fade in immediately without scroll
  document.querySelectorAll('#hero .fade-up').forEach((el) => {
    setTimeout(() => { el.classList.add('visible'); }, 100);
  });

  // 2. Buttery Smooth Navigation Glassmorphism
  const nav = document.getElementById('siteNav');
  if (nav) {
    const updateNavState = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
  }

  // 3. Mobile Menu Logic
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');

  function closeMenu() {
    if (!menu || !hamburger) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  function toggleMenu() {
    if (!menu || !hamburger) return;
    const isOpen = menu.classList.toggle('open');
    menu.setAttribute('aria-hidden', String(!isOpen));
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  }

  window.toggleMenu = toggleMenu;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.querySelectorAll('.mobile-menu a[href^="#"]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // 4. Smooth FAQ Accordion
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) return;

      const isAlreadyOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach((faq) => {
        faq.classList.remove('open');
        const faqButton = faq.querySelector('.faq-question');
        if (faqButton) faqButton.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
