import { Scrambler } from './scrambler.js';
import { Terminal } from './terminal.js';
import { initParticles } from './particles.js';
import { initCursor } from './cursor.js';
import { initCracks } from './cracks.js';

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. TERMINAL ───────────────────────────────────────── */
  new Terminal();

  /* ── 2. TEXT SCRAMBLER ─────────────────────────────────── */
  const nameEl = document.getElementById('shuffle-name');
  if (nameEl) {
    const finalText = nameEl.innerText;
    // Freeze the h1 height before animation — grid uses align-items:center
    // so any height change in the left column shifts the terminal column.
    const h1 = nameEl.closest('h1');
    if (h1) {
      const h1Height = h1.getBoundingClientRect().height;
      h1.style.height = (h1Height + 16) + 'px';
      h1.style.overflow = 'hidden';
      setTimeout(() => {
        h1.style.overflow = 'visible';
        h1.style.height = 'auto';
      }, 1800);
    }
    const s = new Scrambler(nameEl);
    setTimeout(() => s.run(finalText), 300);
    nameEl.addEventListener('dblclick', () => s.run(finalText));
    nameEl.addEventListener('touchstart', () => s.run(finalText), { passive: true });
  }

  document.querySelectorAll('.metric-number').forEach((el, index) => {
    const orig = el.innerText;
    const s = new Scrambler(el);
    setTimeout(() => s.run(orig), 600 + index * 150);
  });

  const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouchDevice()) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const span = link.querySelector('span');
      if (!span) return;
      const orig = span.innerText;
      const s = new Scrambler(span);
      link.addEventListener('mouseenter', () => s.run(orig));
    });

    document.querySelectorAll('.project-card').forEach(card => {
      const title = card.querySelector('.project-title');
      if (!title) return;
      const orig = title.innerText;
      const s = new Scrambler(title);
      card.addEventListener('mouseenter', () => s.run(orig));
    });

    document.querySelectorAll('.metric-card').forEach(card => {
      const numEl = card.querySelector('.metric-number');
      const labelEl = card.querySelector('.metric-label');
      if (!numEl || !labelEl) return;
      const numOrig = numEl.innerText;
      const labelOrig = labelEl.innerText;
      const numScrambler = new Scrambler(numEl);
      const labelScrambler = new Scrambler(labelEl);
      card.addEventListener('mouseenter', () => {
        numScrambler.run(numOrig);
        labelScrambler.run(labelOrig);
      });
    });
  }

  /* ── 3. THEME ──────────────────────────────────────────── */
  const themeBtns = document.querySelectorAll('.theme-btn');
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
    try { localStorage.setItem('ms-portfolio-theme', theme); } catch (_) { }
  };
  themeBtns.forEach(b => b.addEventListener('click', () => setTheme(b.dataset.theme)));
  try { setTheme(localStorage.getItem('ms-portfolio-theme') || 'mint'); }
  catch (_) { setTheme('mint'); }

  /* ── 4. PROJECT FILTER ─────────────────────────────────── */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;
      let delay = 0;

      projectCards.forEach(card => {
        const cats = card.dataset.category.split(' ');
        const match = f === 'all' || cats.includes(f);

        if (match) {
          card.classList.remove('inactive');
          card.classList.add('active');
          card.style.transitionDelay = `${delay}ms`;
          delay += 35;
        } else {
          card.classList.remove('active');
          card.classList.add('inactive');
          card.style.transitionDelay = '0ms';
        }
      });
    });
  });

  /* ── 5. COPY BUTTONS ───────────────────────────────────── */
  const setupCopy = (id, text) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 1600);
      }).catch(() => { });
    });
  };
  setupCopy('copy-email-btn', 'mathewsshaji@gmail.com');
  setupCopy('copy-loc-btn', 'Kochi, Kerala, India');

  /* ── 6. MOBILE MENU ────────────────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks   = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target === navLinks) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 7. SCROLL: NAVBAR + ACTIVE LINKS ─────────────────── */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const allLinks = document.querySelectorAll('.nav-link');

  const updateNav = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);

    let current = sections[0]?.id || 'home';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 140) current = sec.id;
    });
    if (window.innerHeight + y >= document.body.offsetHeight - 60) {
      current = 'contact';
    }

    allLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── 8. SCROLL REVEAL ──────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ── 9. PARTICLES ──────────────────────────────────────── */
  initParticles();

  /* ── 10. EXPERIENCE STICKY PANEL ──────────────────────── */
  const expDesktop = document.getElementById('exp-desktop');
  if (expDesktop) {
    const sidebarItems = expDesktop.querySelectorAll('.exp-sidebar-item');
    const details      = expDesktop.querySelectorAll('.exp-detail');
    const progressBar  = document.getElementById('exp-progress');

    let lastActiveKey = null;
    const showExp = (key) => {
      if (lastActiveKey === key) return;
      lastActiveKey = key;
      sidebarItems.forEach(i => i.classList.toggle('active', i.dataset.exp === key));
      details.forEach(d => d.classList.toggle('active', d.id === `exp-${key}`));
    };

    sidebarItems.forEach(item => {
      item.addEventListener('click', () => showExp(item.dataset.exp));
    });

    const keys = ['exotic', 'cp', 'xmig', 'intern'];
    const onScroll = () => {
      const rect   = expDesktop.getBoundingClientRect();
      const total  = expDesktop.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct    = Math.min(1, scrolled / total);

      if (progressBar) progressBar.style.width = (pct * 100) + '%';

      const idx = Math.min(keys.length - 1, Math.floor(pct * keys.length));
      showExp(keys[idx]);
    };

    expDesktop.style.height = '400vh';
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 11. CUSTOM CURSOR ─────────────────────────────────── */
  initCursor();

  /* ── 12. MOBILE ACCORDIONS ─────────────────────────────── */

  /**
   * Generic accordion helper.
   * @param {string} toggleSel   - CSS selector for the toggle <button>
   * @param {boolean} mobileOnly - if true, only activates below 768px
   */
  const initAccordion = (toggleSel, mobileOnly = false) => {
    const allBtns = Array.from(document.querySelectorAll(toggleSel));

    const closeBtn = (btn) => {
      const id   = btn.getAttribute('aria-controls');
      const body = id ? document.getElementById(id) : null;
      btn.setAttribute('aria-expanded', 'false');
      if (body) {
        body.style.maxHeight = body.scrollHeight + 'px';
        body.classList.remove('open');
        body.offsetHeight; // force reflow
        body.style.maxHeight = '0px';
      }
    };

    const openBtn = (btn, body) => {
      btn.setAttribute('aria-expanded', 'true');
      body.classList.add('open');
      body.offsetHeight; // force layout recalculation so padding height is factored in!
      body.style.maxHeight = body.scrollHeight + 'px';
      
      const onTransitionEnd = (e) => {
        if (e.propertyName === 'max-height') {
          if (btn.getAttribute('aria-expanded') === 'true') {
            body.style.maxHeight = 'none';
          }
          body.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      body.addEventListener('transitionend', onTransitionEnd);

      // Smooth scroll the header into view with a comfortable top offset
      setTimeout(() => {
        const rect = btn.getBoundingClientRect();
        const headerOffset = 100; // Offset for sticky navigation bar
        const elementPosition = rect.top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 350);
    };

    allBtns.forEach(btn => {
      const bodyId = btn.getAttribute('aria-controls');
      const body   = bodyId ? document.getElementById(bodyId) : null;
      if (!body) return;

      // Initialize closed heights
      if (!mobileOnly || window.innerWidth <= 768) {
        body.style.maxHeight = '0px';
      }

      btn.addEventListener('click', () => {
        if (mobileOnly && window.innerWidth > 768) return;

        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          closeBtn(btn);
        } else {
          // Collapse all siblings first
          allBtns.forEach(other => { if (other !== btn) closeBtn(other); });
          openBtn(btn, body);
        }
      });
    });

    // Handle screen resize to reset inline styles on desktop
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 768;
      
      allBtns.forEach(btn => {
        const id = btn.getAttribute('aria-controls');
        const body = id ? document.getElementById(id) : null;
        if (!body) return;

        if (mobileOnly && !isMobile) {
          body.style.maxHeight = '';
          body.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else if (!body.classList.contains('open')) {
          body.style.maxHeight = '0px';
        }
      });
    }, { passive: true });
  };

  // Experience mobile timeline cards
  initAccordion('.timeline-toggle', false);

  // Project cards
  initAccordion('.project-toggle', true);

  // Skills categories
  initAccordion('.skills-toggle', true);

  // Spark/crack effects on click
  initCracks();

});
