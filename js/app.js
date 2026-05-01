// Rachel McBride Coaching landing page interactions

const heroFadeItems = document.querySelectorAll('#hero .fade-up');

heroFadeItems.forEach((el) => {
  el.classList.add('visible');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.05,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.fade-up:not(#hero .fade-up)').forEach((el) => {
  observer.observe(el);
});

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');

  if (!menu || !hamburger) return;

  const isOpen = menu.classList.toggle('open');

  menu.setAttribute('aria-hidden', String(!isOpen));
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('no-scroll', isOpen);
}

window.toggleMenu = toggleMenu;

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');

  if (!menu || !hamburger) return;

  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }
});

const nav = document.getElementById('siteNav');

window.addEventListener('scroll', () => {
  if (!nav) return;

  if (window.scrollY > 30) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const allItems = document.querySelectorAll('.faq-item');

    allItems.forEach((faq) => {
      if (faq !== item) {
        faq.classList.remove('open');
      }
    });

    item.classList.toggle('open');
  });
});

setTimeout(() => {
  document.querySelectorAll('.fade-up').forEach((el) => {
    el.classList.add('visible');
  });
}, 1800);
