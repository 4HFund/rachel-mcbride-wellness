// Rachel McBride Coaching landing page interactions

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');

  const heroFadeItems = document.querySelectorAll('#hero .fade-up');

  heroFadeItems.forEach((el) => {
    el.classList.add('visible');
  });

  const fadeItems = Array.from(document.querySelectorAll('.fade-up')).filter((el) => {
    return !el.closest('#hero');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeItems.forEach((el) => {
      observer.observe(el);
    });
  } else {
    fadeItems.forEach((el) => {
      el.classList.add('visible');
    });
  }

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
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  if (nav) {
    const updateNavState = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };

    updateNavState();

    window.addEventListener('scroll', updateNavState, {
      passive: true
    });
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');

      if (!item) return;

      const isAlreadyOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach((faq) => {
        faq.classList.remove('open');

        const faqButton = faq.querySelector('.faq-question');

        if (faqButton) {
          faqButton.setAttribute('aria-expanded', 'false');
        }
      });

      if (!isAlreadyOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.querySelectorAll('.mobile-menu a[href^="#"]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.classList.add('visible');
    });
  }, 1800);
});
