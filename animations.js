/* =========================================
   ANIMATIONS.JS — Pack Bíblico Infantil
   Camada de animações: não altera nada do original
   ========================================= */

(function () {
  'use strict';

  /* ─── 1. INJETAR LINK DO CSS ─── */
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'animations.css';
  document.head.appendChild(link);

  /* ─── 2. PROGRESS BAR DE SCROLL ─── */
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / max * 100) + '%';
  }, { passive: true });

  /* ─── 3. SCROLL REVEAL (IntersectionObserver) ─── */
  function addRevealClass(selector, animClass, delayIndex) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add(animClass);
      if (delayIndex) {
        const d = Math.min(i + 1, 5);
        el.classList.add('delay-' + d);
      }
    });
  }

  addRevealClass('.section-title', 'anim-reveal', false);
  addRevealClass('.section-sub', 'anim-reveal', false);
  addRevealClass('.sec-subtitle', 'anim-reveal', false);
  addRevealClass('.stat-card', 'anim-scale', true);
  addRevealClass('.test-item', 'anim-reveal', true);
  addRevealClass('.step', 'anim-left', true);
  addRevealClass('.pain-item', 'anim-reveal', true);
  addRevealClass('.trust-pill', 'anim-scale', true);
  addRevealClass('.wa-card', 'anim-scale', true);
  addRevealClass('.faq-item', 'anim-reveal', true);
  addRevealClass('.ba-card', 'anim-scale', true);
  addRevealClass('.games-image', 'anim-reveal', false);
  addRevealClass('.guarantee-inner', 'anim-reveal', false);
  addRevealClass('.community-bar', 'anim-reveal', false);
  addRevealClass('.plan-card', 'anim-reveal', true);
  addRevealClass('.hero h1', 'anim-reveal', false);
  addRevealClass('.hero .subtitle', 'anim-reveal', false);
  addRevealClass('.social-approval', 'anim-reveal', false);

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.anim-reveal, .anim-scale, .anim-left, .anim-right'
  ).forEach(function (el) { observer.observe(el); });

  /* ─── 4. CONTADOR ANIMADO NOS STAT CARDS ─── */
  function animateCounter(el, target, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);

    const timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = prefix + Math.round(start) + suffix;
    }, step);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const numEl = entry.target.querySelector('.stat-num');
      if (!numEl || numEl.dataset.animated) return;
      numEl.dataset.animated = '1';

      const text = numEl.textContent.trim();
      // "+753" → 753, "4.9" → 4.9, "+600" → 600
      const prefix = text.startsWith('+') ? '+' : '';
      const hasStar = numEl.querySelector('.star');
      if (hasStar) {
        // "⭐ 4.9"
        const numPart = parseFloat(text.replace(/[^0-9.]/g, ''));
        const starEl = numEl.querySelector('.star').outerHTML;
        let s = 0;
        const dur = 1000, st = 20, inc = numPart / (dur / st);
        const t = setInterval(function () {
          s += inc;
          if (s >= numPart) { s = numPart; clearInterval(t); }
          numEl.innerHTML = starEl + ' ' + s.toFixed(1);
        }, st);
      } else {
        const numPart = parseInt(text.replace(/[^0-9]/g, ''), 10);
        const suffix = text.includes('MXN') ? ' MXN' : '';
        numEl.textContent = prefix + '0' + suffix;
        animateCounter(numEl, numPart, prefix, suffix);
      }
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-card').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ─── 5. FAQ SMOOTH TRANSITION (substitui display:none do original) ─── */
  // Aguarda o original rodar e depois sobrescreve o comportamento
  window.addEventListener('load', function () {
    document.querySelectorAll('.faq-q').forEach(function (q) {
      const a = q.nextElementSibling;
      if (!a || !a.classList.contains('faq-a')) return;

      // Remove o listener original (não conseguimos, mas sobrepomos o estilo)
      a.style.display = '';        // anula o display:none injetado pelo JS original
      a.classList.remove('faq-open');

      q.addEventListener('click', function () {
        const isOpen = a.classList.contains('faq-open');

        // Fecha todos
        document.querySelectorAll('.faq-a').forEach(function (el) {
          el.classList.remove('faq-open');
        });
        document.querySelectorAll('.faq-q').forEach(function (el) {
          el.classList.remove('open');
        });

        if (!isOpen) {
          a.classList.add('faq-open');
          q.classList.add('open');
        }
      });
    });
  });

  /* ─── 6. RIPPLE EFFECT NOS BOTÕES ─── */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-primary, .btn-secondary, .btn-guarantee-white, .sticky-cta a');
    if (!btn) return;

    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.cssText = [
      'width:' + diameter + 'px',
      'height:' + diameter + 'px',
      'left:' + (e.clientX - rect.left - radius) + 'px',
      'top:' + (e.clientY - rect.top - radius) + 'px',
    ].join(';');
    circle.classList.add('ripple-effect');

    const existing = btn.querySelector('.ripple-effect');
    if (existing) existing.remove();

    // btn needs relative positioning (já tem, mas garantimos)
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.appendChild(circle);
    setTimeout(function () { circle.remove(); }, 700);
  });

  /* ─── 7. PARTICLE SPARKLES AO CLICAR NOS CTAs PRINCIPAIS ─── */
  function spawnSparkles(x, y) {
    const colors = ['#F97316', '#FBBF24', '#16A34A', '#fff', '#FED7AA'];
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.classList.add('sparkle');
      const size = Math.random() * 8 + 4;
      const angle = Math.random() * 360;
      const dist = Math.random() * 80 + 40;
      const tx = Math.cos(angle * Math.PI / 180) * dist;
      const ty = Math.sin(angle * Math.PI / 180) * dist;
      el.style.cssText = [
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + (x - size / 2) + 'px',
        'top:' + (y - size / 2) + 'px',
        'background:' + colors[Math.floor(Math.random() * colors.length)],
        '--tx:' + tx + 'px',
        '--ty:' + ty + 'px',
      ].join(';');
      document.body.appendChild(el);
      setTimeout(function () { el.remove(); }, 850);
    }
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-primary, .btn-guarantee-white');
    if (!btn) return;
    spawnSparkles(e.clientX, e.clientY);
  });

  /* ─── 9. STICKY CTA — text pulse para urgência ─── */
  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    const ctaLink = stickyCta.querySelector('a');
    if (ctaLink) {
      setInterval(function () {
        ctaLink.style.transition = 'transform 0.18s ease';
        ctaLink.style.transform = 'scale(1.06)';
        setTimeout(function () {
          ctaLink.style.transform = 'scale(1)';
        }, 180);
      }, 3000);
    }
  }

  /* ─── 10. HERO ENTER ANIMATION ─── */
  window.addEventListener('load', function () {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(18px)';
      hero.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          hero.style.opacity = '1';
          hero.style.transform = 'translateY(0)';
        });
      });
    }
  });

  /* ─── 11. TOP BAR pulse de atenção ─── */
  const topBar = document.querySelector('.top-bar');
  if (topBar) {
    setInterval(function () {
      topBar.style.transition = 'background 0.3s ease';
      topBar.style.background = '#D9621C';
      setTimeout(function () {
        topBar.style.background = '#ED7D31';
      }, 320);
    }, 5000);
  }

})();
