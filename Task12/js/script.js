/* ==========================================================================
   THE COMPONENT CATALOG — script.js
   Small, focused behaviours: each function owns one interaction.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initIndexRail();
  initNavAPill();
  initNavABurger();
  initNavCScrollShrink();
  initGlowCards();
});

/* --------------------------------------------------------------------------
   Index rail: mobile toggle + active-specimen highlight via IntersectionObserver
   -------------------------------------------------------------------------- */
function initIndexRail(){
  const toggle = document.getElementById('railToggle');
  const list = document.querySelector('.index-rail__list');

  if (toggle && list) {
    toggle.addEventListener('click', () => {
      const isOpen = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile list after a link is chosen
    list.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        list.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const specimens = document.querySelectorAll('.specimen[id]');
  const railLinks = document.querySelectorAll('.index-rail__list a');
  if (!specimens.length || !railLinks.length) return;

  const linkById = new Map();
  railLinks.forEach(link => linkById.set(link.getAttribute('href').slice(1), link));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkById.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        railLinks.forEach(l => l.classList.remove('is-current'));
        link.classList.add('is-current');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  specimens.forEach(spec => observer.observe(spec));
}

/* --------------------------------------------------------------------------
   Spec 01 — Bar Nav: position the sliding pill under the active link
   -------------------------------------------------------------------------- */
function initNavAPill(){
  const links = document.querySelectorAll('[data-navA]');
  const pill = document.getElementById('navAPill');
  if (!links.length || !pill) return;

  const movePillTo = (link) => {
    pill.style.left = link.offsetLeft + 'px';
    pill.style.width = link.offsetWidth + 'px';
  };

  const active = document.querySelector('[data-navA].is-active') || links[0];
  // Wait a frame so fonts/layout have settled before measuring offsets
  requestAnimationFrame(() => movePillTo(active));

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');
      movePillTo(link);
    });
  });

  window.addEventListener('resize', () => {
    const current = document.querySelector('[data-navA].is-active');
    if (current) movePillTo(current);
  });
}

/* --------------------------------------------------------------------------
   Spec 01 — Bar Nav: mobile hamburger toggle
   -------------------------------------------------------------------------- */
function initNavABurger(){
  const burger = document.getElementById('navABurger');
  const links = document.getElementById('navALinks');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });
}

/* --------------------------------------------------------------------------
   Spec 03 — Float Nav: shrink the pill bar once its stage has scrolled
   -------------------------------------------------------------------------- */
function initNavCScrollShrink(){
  const stage = document.getElementById('navCStage');
  const nav = document.getElementById('navC');
  if (!stage || !nav) return;

  stage.addEventListener('scroll', () => {
    nav.classList.toggle('is-shrunk', stage.scrollTop > 40);
  });
}

/* --------------------------------------------------------------------------
   Spec 05 — Lift & Glow: track the cursor so the glow spot can follow it
   -------------------------------------------------------------------------- */
function initGlowCards(){
  const cards = document.querySelectorAll('[data-glow]');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', x + '%');
      card.style.setProperty('--y', y + '%');
    });
  });
}
