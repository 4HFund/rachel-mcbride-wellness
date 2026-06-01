document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.querySelector('.mobile-close');

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  function openMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  function toggleMenu() {
    if (!mobileMenu) return;
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealItems = document.querySelectorAll('.fade-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });

  document.querySelectorAll('.hero .fade-up, .reset-landing .fade-up, .permission-hero .fade-up').forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, 120 + index * 90);
  });

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const currentItem = button.closest('.faq-item');
      const alreadyOpen = currentItem.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('open');
        const question = item.querySelector('.faq-question');
        if (question) question.setAttribute('aria-expanded', 'false');
      });

      if (!alreadyOpen) {
        currentItem.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const resetForm = document.getElementById('resetForm');

  if (resetForm) {
    resetForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const firstNameInput = document.getElementById('firstName');
      const emailInput = document.getElementById('email');
      const error = document.getElementById('formError');

      const firstName = firstNameInput.value.trim();
      const email = emailInput.value.trim();

      if (!firstName || !email) {
        if (error) error.textContent = 'Please enter your first name and email address.';
        return;
      }

      const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailLooksValid) {
        if (error) error.textContent = 'Please enter a valid email address.';
        return;
      }

      localStorage.setItem('rmc_first_name', firstName);
      localStorage.setItem('rmc_email', email);

      /*
        Future email-platform integration:
        Replace the localStorage-only behavior above with your provider form action or API.
        Good options: Flodesk, ConvertKit, Mailchimp, MailerLite, or Kit.
        After successful provider submission, redirect to permission.html.
      */

      window.location.href = 'permission.html';
    });
  }

  const personalGreeting = document.getElementById('personalGreeting');

  if (personalGreeting) {
    const firstName = localStorage.getItem('rmc_first_name');

    if (firstName) {
      personalGreeting.textContent = `${firstName}, your reset is ready.`;
    } else {
      personalGreeting.textContent = 'Your reset is ready.';
    }
  }
});