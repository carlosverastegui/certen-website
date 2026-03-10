document.addEventListener('DOMContentLoaded', () => {
  // --- Header shadow on scroll ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Mobile menu toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
    });
  });

  // --- Smooth scroll with header offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(other => {
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').hidden = true;
      });

      // Toggle clicked item
      if (!isOpen) {
        button.setAttribute('aria-expanded', 'true');
        item.querySelector('.faq-answer').hidden = false;
      }
    });
  });

  // --- Energy Cables Animation ---
  function initEnergyCables() {
    const container = document.querySelector('.energy-cables');
    const svg = container && container.querySelector('.energy-cables-svg');
    const strip = document.querySelector('.integration-strip');
    const callout = document.querySelector('.solution-callout');
    if (!container || !svg || !strip || !callout) return;

    const defs = svg.querySelector('defs');

    function buildPaths() {
      // Clear previous paths (keep defs)
      while (svg.lastChild && svg.lastChild !== defs) {
        svg.removeChild(svg.lastChild);
      }

      const items = strip.querySelectorAll('.integration-item');
      const containerRect = container.getBoundingClientRect();
      const calloutRect = callout.getBoundingClientRect();

      // Target: center-top of callout, physically touching its top edge
      const targetX = calloutRect.left + calloutRect.width / 2 - containerRect.left;
      const targetY = calloutRect.top - containerRect.top;

      items.forEach((item, i) => {
        const itemRect = item.getBoundingClientRect();
        // Source: center-bottom of each card, physically touching its bottom edge
        const startX = itemRect.left + itemRect.width / 2 - containerRect.left;
        const startY = itemRect.bottom - containerRect.top;

        // Cubic Bezier control points — vertically biased for smooth funnel
        const midY = (startY + targetY) / 2;
        const d = `M ${startX} ${startY} C ${startX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;

        // Base cable line
        const basePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        basePath.setAttribute('d', d);
        basePath.setAttribute('class', 'cable-base');
        svg.appendChild(basePath);

        // Animated pulse overlay
        const pulsePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pulsePath.setAttribute('d', d);
        pulsePath.setAttribute('class', 'cable-pulse');
        pulsePath.setAttribute('data-index', i);
        svg.appendChild(pulsePath);
      });
    }

    buildPaths();

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildPaths, 150);
    });

    // IntersectionObserver: pause when off-screen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          container.classList.toggle('paused', !entry.isIntersecting);
        });
      }, { threshold: 0.1 });
      observer.observe(container);
    }
  }

  initEnergyCables();

  // --- Problem card image switcher ---
  const problemCards = document.querySelectorAll('.problem-card[data-image]');
  const problemViewer = document.querySelector('.problem-image-viewer img');
  if (problemCards.length && problemViewer) {
    problemCards.forEach(card => {
      card.addEventListener('click', () => {
        problemCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        problemViewer.src = card.dataset.image;
        problemViewer.alt = card.querySelector('h3').textContent + ' illustration';
      });
    });
  }

  // --- Early access form (visual only) ---
  const form = document.querySelector('.early-access-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Thank you!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Get Early Access';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }
});
