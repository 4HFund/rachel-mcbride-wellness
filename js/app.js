document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.querySelector('.mobile-close');
  const scrollProgress = document.getElementById('scrollProgress');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ANALYTICS PLACEHOLDER */

  function trackEvent(eventName, data = {}) {
    console.log('Track:', eventName, data);
  }

  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => {
      trackEvent(element.dataset.track, {
        text: element.textContent.trim(),
        href: element.getAttribute('href') || null
      });
    });
  });

  /* NAVBAR + SCROLL PROGRESS */

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }

  function updateScrollProgress() {
    if (!scrollProgress) return;

    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;
  }

  function handleScroll() {
    updateNav();
    updateScrollProgress();
    updateStickyCTA();
    updateParallaxNotes();
  }

  updateNav();
  updateScrollProgress();
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* MOBILE MENU */

  function openMenu() {
    if (!mobileMenu || !hamburger) return;

    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');

    trackEvent('Mobile Menu Opened');
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

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      closeBreathTool();
      closeSoftPrompt();
    }
  });

  /* REVEAL ANIMATIONS */

  const revealItems = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && revealItems.length) {
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
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  document.querySelectorAll('.hero .fade-up, .reset-landing .fade-up, .permission-hero .fade-up').forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, 120 + index * 90);
  });

  /* SMOOTH ANCHOR OFFSET */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const navHeight = nav ? nav.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* ACTIVE NAV LINK HIGHLIGHTING */

  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const navSections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute('href');
      const section = document.querySelector(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => link.classList.remove('active'));

        const match = navSections.find((item) => item.section === entry.target);
        if (match) match.link.classList.add('active');
      });
    }, {
      threshold: 0.36,
      rootMargin: '-20% 0px -55% 0px'
    });

    navSections.forEach(({ section }) => sectionObserver.observe(section));
  }

  /* FAQ ACCORDION */

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const currentItem = button.closest('.faq-item');
      if (!currentItem) return;

      const alreadyOpen = currentItem.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('open');

        const question = item.querySelector('.faq-question');
        if (question) question.setAttribute('aria-expanded', 'false');
      });

      if (!alreadyOpen) {
        currentItem.classList.add('open');
        button.setAttribute('aria-expanded', 'true');

        trackEvent('FAQ Opened', {
          question: button.textContent.trim()
        });
      }
    });
  });

  /* STARTING POINT QUIZ */

  const quiz = document.getElementById('startingPointQuiz');
  const quizResult = document.getElementById('quizResult');
  const quizResultTitle = document.getElementById('quizResultTitle');
  const quizResultText = document.getElementById('quizResultText');
  const quizResultButton = document.getElementById('quizResultButton');

  const quizResults = {
    pause: {
      title: 'Start with Permission to Pause.',
      text: 'Your body may need a pause before it needs a plan. Begin with a simple 5-minute practice to notice what you feel, check in with your body, release the stress signal, and choose one supportive step.',
      button: 'Start Permission to Pause',
      href: 'reset.html',
      sticky: 'Start Permission to Pause'
    },
    permission: {
      title: 'Create a Permission Slip.',
      text: 'When you feel emotionally drained, sometimes your heart needs words it can hold onto. Create a beautiful reminder of what you are allowed to release, protect, or choose today.',
      button: 'Create a Permission Slip',
      href: 'permission.html',
      sticky: 'Create a Permission Slip'
    },
    circle: {
      title: 'Explore a Women’s Circle.',
      text: 'You may need a place to exhale with women who understand the invisible load. A guided circle can help you step out of the noise and come back to yourself.',
      button: 'Explore Women’s Circles',
      href: '#services',
      sticky: 'Explore Support'
    },
    coaching: {
      title: 'Book a Free Connection Call.',
      text: 'If you are ready for deeper support, begin with a simple conversation. No pressure. No performance. Just a calm place to talk about what has been feeling heavy.',
      button: 'Book a Free Connection Call',
      href: '#booking',
      sticky: 'Book a Free Call'
    }
  };

  if (quiz && quizResult && quizResultTitle && quizResultText && quizResultButton) {
    quiz.querySelectorAll('.quiz-option').forEach((option) => {
      option.addEventListener('click', () => {
        const resultKey = option.dataset.result;
        const result = quizResults[resultKey];

        if (!result) return;

        quiz.querySelectorAll('.quiz-option').forEach((item) => {
          item.classList.remove('selected');
        });

        option.classList.add('selected');

        quizResultTitle.textContent = result.title;
        quizResultText.textContent = result.text;
        quizResultButton.textContent = result.button;
        quizResultButton.setAttribute('href', result.href);

        localStorage.setItem('rmc_quiz_result', resultKey);
        localStorage.setItem('rmc_smart_cta_text', result.sticky);
        localStorage.setItem('rmc_smart_cta_href', result.href);

        updateSmartStickyContent();

        trackEvent('Starting Point Quiz Selected', {
          result: resultKey,
          label: option.textContent.trim()
        });
      });
    });
  }

  /* SMART STICKY CTA */

  const mobileStickyCTA = document.getElementById('smartStickyCTA') || document.querySelector('.mobile-sticky-cta');
  const smartStickyLink = document.getElementById('smartStickyLink');
  const bookingSection = document.getElementById('booking');
  const servicesSection = document.getElementById('services');
  const quizSection = document.getElementById('quiz');
  const freeToolsSection = document.getElementById('free-tools');

  function setSmartSticky(text, href) {
    if (!smartStickyLink) return;

    smartStickyLink.textContent = text;
    smartStickyLink.setAttribute('href', href);
  }

  function updateSmartStickyContent() {
    const storedText = localStorage.getItem('rmc_smart_cta_text');
    const storedHref = localStorage.getItem('rmc_smart_cta_href');

    if (storedText && storedHref) {
      setSmartSticky(storedText, storedHref);
    }
  }

  updateSmartStickyContent();

  function isElementNearViewport(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.72 && rect.bottom > window.innerHeight * 0.18;
  }

  function updateStickyCTA() {
    if (!mobileStickyCTA || !smartStickyLink) return;

    if (bookingSection) {
      const bookingRect = bookingSection.getBoundingClientRect();
      const bookingVisible = bookingRect.top < window.innerHeight * 0.75 && bookingRect.bottom > 120;
      mobileStickyCTA.classList.toggle('is-hidden', bookingVisible);

      if (bookingVisible) return;
    }

    const storedText = localStorage.getItem('rmc_smart_cta_text');
    const storedHref = localStorage.getItem('rmc_smart_cta_href');

    if (storedText && storedHref) return;

    if (isElementNearViewport(servicesSection)) {
      setSmartSticky('Find the Right Support', '#quiz');
    } else if (isElementNearViewport(freeToolsSection)) {
      setSmartSticky('Start Permission to Pause', 'reset.html');
    } else if (isElementNearViewport(quizSection)) {
      setSmartSticky('Choose My First Step', '#quiz');
    } else {
      setSmartSticky('Start Permission to Pause', 'reset.html');
    }
  }

  updateStickyCTA();

  /* BREATH TOOL */

  const breathTrigger = document.getElementById('breathToolTrigger');
  const breathOverlay = document.getElementById('breathOverlay');
  const breathClose = document.getElementById('breathClose');
  const breathStart = document.getElementById('breathStart');
  const breathCircle = document.getElementById('breathCircle');
  const breathInstruction = document.getElementById('breathInstruction');

  let breathTimerIds = [];
  let breathIsRunning = false;

  function clearBreathTimers() {
    breathTimerIds.forEach((timerId) => clearTimeout(timerId));
    breathTimerIds = [];
  }

  function resetBreathTool() {
    clearBreathTimers();
    breathIsRunning = false;

    if (breathCircle) breathCircle.className = 'breath-circle';
    if (breathInstruction) breathInstruction.textContent = 'Ready';
    if (breathStart) {
      breathStart.disabled = false;
      breathStart.textContent = 'Start Breathing';
    }
  }

  function openBreathTool() {
    if (!breathOverlay) return;

    breathOverlay.classList.add('open');
    breathOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    resetBreathTool();

    trackEvent('Breath Tool Opened');

    setTimeout(() => {
      if (breathStart) breathStart.focus();
    }, 50);
  }

  function closeBreathTool() {
    if (!breathOverlay) return;

    breathOverlay.classList.remove('open');
    breathOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');

    resetBreathTool();
  }

  function runBreathTool() {
    if (!breathCircle || !breathInstruction || !breathStart || breathIsRunning) return;

    breathIsRunning = true;
    breathStart.disabled = true;
    breathStart.textContent = 'Breathing...';

    let cycle = 0;
    const maxCycles = 3;

    function cycleBreath() {
      if (cycle >= maxCycles) {
        breathCircle.className = 'breath-circle';
        breathInstruction.textContent = 'Rest.';
        breathStart.textContent = 'Again';
        breathStart.disabled = false;
        breathIsRunning = false;

        trackEvent('Breath Tool Completed');
        return;
      }

      cycle += 1;

      breathInstruction.textContent = 'Inhale...';
      breathCircle.className = 'breath-circle inhale';

      breathTimerIds.push(setTimeout(() => {
        breathInstruction.textContent = 'Hold...';
        breathCircle.className = 'breath-circle hold';
      }, 4000));

      breathTimerIds.push(setTimeout(() => {
        breathInstruction.textContent = 'Exhale slowly...';
        breathCircle.className = 'breath-circle exhale';
      }, 6000));

      breathTimerIds.push(setTimeout(() => {
        cycleBreath();
      }, 12000));
    }

    cycleBreath();
  }

  if (breathTrigger) breathTrigger.addEventListener('click', openBreathTool);
  if (breathClose) breathClose.addEventListener('click', closeBreathTool);
  if (breathStart) breathStart.addEventListener('click', runBreathTool);

  if (breathOverlay) {
    breathOverlay.addEventListener('click', (event) => {
      if (event.target === breathOverlay) closeBreathTool();
    });
  }

  /* HERO FLOATING NOTE PARALLAX */

  const noteOne = document.querySelector('.note-one');
  const noteTwo = document.querySelector('.note-two');

  function updateParallaxNotes() {
    if (prefersReducedMotion || !noteOne || !noteTwo) return;

    const scrollY = window.scrollY;

    if (scrollY > window.innerHeight) return;

    noteOne.style.transform = `translateY(${scrollY * -0.035}px)`;
    noteTwo.style.transform = `translateY(${scrollY * 0.045}px)`;
  }

  updateParallaxNotes();

  /* MAGNETIC BUTTONS */

  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach((button) => {
      button.addEventListener('mousemove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }

  /* PREMIUM CARD TILT */

  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.premium-card, .service-card, .testimonial-card, .next-step-card, .quiz-option').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 3.5;
        const rotateX = ((y / rect.height) - 0.5) * -3.5;

        card.style.transform = `translateY(-7px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* RESTORE NAME + EMAIL IF USER ALREADY ENTERED */

  const storedFirstName = localStorage.getItem('rmc_first_name');
  const storedEmail = localStorage.getItem('rmc_email');

  const firstNameFields = document.querySelectorAll('#firstName, #permissionFirstName');
  const emailFields = document.querySelectorAll('#email, #emailAddress, #permissionEmail');

  if (storedFirstName) {
    firstNameFields.forEach((field) => {
      if (!field.value) field.value = storedFirstName;
    });
  }

  if (storedEmail) {
    emailFields.forEach((field) => {
      if (!field.value) field.value = storedEmail;
    });
  }

  /* RESET / PERMISSION TO PAUSE FORM CAPTURE */

  const resetForm = document.getElementById('resetForm');

  if (resetForm) {
    resetForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const firstNameInput = document.getElementById('firstName');
      const emailInput = document.getElementById('email');
      const error = document.getElementById('formError');

      if (!firstNameInput || !emailInput) return;

      const firstName = firstNameInput.value.trim();
      const email = emailInput.value.trim();
      const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (error) error.textContent = '';

      if (!firstName || !email) {
        if (error) error.textContent = 'Please enter your first name and email address.';
        return;
      }

      if (!emailLooksValid) {
        if (error) error.textContent = 'Please enter a valid email address.';
        return;
      }

      localStorage.setItem('rmc_first_name', firstName);
      localStorage.setItem('rmc_email', email);

      trackEvent('Permission to Pause Lead Captured', {
        firstNameProvided: Boolean(firstName),
        emailProvided: Boolean(email)
      });

      showCalmRedirect(() => {
        window.location.href = 'permission.html';
      });
    });
  }

  function showCalmRedirect(callback) {
    const redirect = document.createElement('div');
    redirect.className = 'calm-redirect';
    redirect.innerHTML = `
      <div class="calm-redirect-card">
        <p class="eyebrow centered">Take one breath</p>
        <h2>Your pause is ready.</h2>
        <p>Redirecting you to a calm place to begin...</p>
        <div class="calm-redirect-line"><span></span></div>
      </div>
    `;

    document.body.appendChild(redirect);

    requestAnimationFrame(() => {
      redirect.classList.add('visible');
    });

    setTimeout(() => {
      callback();
    }, 1400);
  }

  /* PERSONALIZED PERMISSION / THANK-YOU COPY */

  const personalGreeting = document.getElementById('personalGreeting');

  if (personalGreeting) {
    if (storedFirstName) {
      personalGreeting.textContent = `${storedFirstName}, your pause is ready.`;
    } else {
      personalGreeting.textContent = 'Your pause is ready.';
    }
  }

  /* LAST SECTION MEMORY */

  const memorySections = document.querySelectorAll('main section[id]');

  if ('IntersectionObserver' in window && memorySections.length) {
    const memoryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          localStorage.setItem('rmc_last_section', entry.target.id);
        }
      });
    }, {
      threshold: 0.55
    });

    memorySections.forEach((section) => memoryObserver.observe(section));
  }

  /* SOFT EXIT PROMPT */

  const exitPromptAlreadyShown = sessionStorage.getItem('rmc_exit_prompt_shown');

  if (!exitPromptAlreadyShown && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mouseout', (event) => {
      const leavingTop = event.clientY <= 0;

      if (!leavingTop) return;
      if (document.getElementById('softPrompt')) return;

      sessionStorage.setItem('rmc_exit_prompt_shown', 'true');
      showSoftPrompt();
    });
  }

  function showSoftPrompt() {
    const prompt = document.createElement('div');

    prompt.id = 'softPrompt';
    prompt.className = 'soft-prompt';
    prompt.innerHTML = `
      <button class="soft-prompt-close" type="button" aria-label="Close prompt">×</button>
      <p class="soft-prompt-kicker">Before you go</p>
      <h3>A calm place to begin is still here.</h3>
      <p>If your body feels overloaded, start with Permission to Pause.</p>
      <a href="reset.html" class="btn btn-primary" data-track="exit_prompt_pause">Start Permission to Pause</a>
    `;

    document.body.appendChild(prompt);

    requestAnimationFrame(() => {
      prompt.classList.add('visible');
    });

    trackEvent('Soft Exit Prompt Shown');

    const close = prompt.querySelector('.soft-prompt-close');
    if (close) {
      close.addEventListener('click', closeSoftPrompt);
    }

    const link = prompt.querySelector('[data-track]');
    if (link) {
      link.addEventListener('click', () => {
        trackEvent(link.dataset.track, {
          text: link.textContent.trim(),
          href: link.getAttribute('href')
        });
      });
    }
  }

  function closeSoftPrompt() {
    const prompt = document.getElementById('softPrompt');
    if (!prompt) return;

    prompt.classList.remove('visible');

    setTimeout(() => {
      prompt.remove();
    }, 300);
  }

  /* PAGE LOAD MEMORY NUDGE */

  const lastSection = localStorage.getItem('rmc_last_section');

  if (lastSection) {
    trackEvent('Returning Visitor Last Section', {
      lastSection
    });
  }
});