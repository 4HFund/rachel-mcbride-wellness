// Rachel McBride Coaching landing page interactions

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');

  /* ---------- Scroll reveal ---------- */

  // Hero content is above the fold — reveal immediately.
  document.querySelectorAll('#hero .fade-up').forEach((el) => {
    el.classList.add('visible');
  });

  const fadeItems = Array.from(document.querySelectorAll('.fade-up'))
    .filter((el) => !el.closest('#hero'));

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

    fadeItems.forEach((el) => observer.observe(el));
  } else {
    // No IntersectionObserver support — show everything up front.
    fadeItems.forEach((el) => el.classList.add('visible'));
  }
  // NOTE: the old 1.8s setTimeout fallback was removed. It forced every
  // element visible regardless of scroll position, defeating the reveal.

  /* ---------- Mobile menu (with focus trap) ---------- */

  const FOCUSABLE = 'a[href], button:not([disabled])';
  let lastFocused = null;

  function getMenuFocusables() {
    return menu ? Array.from(menu.querySelectorAll(FOCUSABLE)) : [];
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const items = getMenuFocusables();
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function closeMenu() {
    if (!menu || !hamburger) return;

    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    menu.removeEventListener('keydown', trapFocus);

    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function toggleMenu() {
    if (!menu || !hamburger) return;

    const isOpen = menu.classList.toggle('open');

    menu.setAttribute('aria-hidden', String(!isOpen));
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);

    if (isOpen) {
      lastFocused = document.activeElement;
      menu.addEventListener('keydown', trapFocus);
      const items = getMenuFocusables();
      if (items.length) items[0].focus();
    } else {
      menu.removeEventListener('keydown', trapFocus);
      if (lastFocused) {
        lastFocused.focus();
        lastFocused = null;
      }
    }
  }

  window.toggleMenu = toggleMenu;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.querySelectorAll('.mobile-menu a[href^="#"]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Nav scroll state ---------- */

  if (nav) {
    const updateNavState = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
  }

  /* ---------- FAQ accordion (scrollHeight-based, no clipping) ---------- */

  const faqItems = document.querySelectorAll('.faq-item');

  function setFaqHeight(item, open) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;
    answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
  }

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    // Initialize any item marked open in the markup.
    if (item.classList.contains('open')) {
      setFaqHeight(item, true);
      button.setAttribute('aria-expanded', 'true');
    }

    button.addEventListener('click', () => {
      const isAlreadyOpen = item.classList.contains('open');

      faqItems.forEach((faq) => {
        faq.classList.remove('open');
        const faqButton = faq.querySelector('.faq-question');
        if (faqButton) faqButton.setAttribute('aria-expanded', 'false');
        setFaqHeight(faq, false);
      });

      if (!isAlreadyOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        setFaqHeight(item, true);
      }
    });
  });

  // Keep an open FAQ correctly sized if the viewport width changes.
  window.addEventListener('resize', () => {
    const openItem = document.querySelector('.faq-item.open');
    if (openItem) setFaqHeight(openItem, true);
  }, { passive: true });
});
