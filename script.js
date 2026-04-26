/* ====================================================
   SAMRIDDHI BHOG — MAIN JAVASCRIPT
   Navigation · WhatsApp · Scroll Reveal · Animations
   ==================================================== */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '919999999999';
  const WHATSAPP_MSG = encodeURIComponent('Hello! I would like to place an order with Samriddhi Bhog.');

  /* ── Hero video autoplay ── */
  function initHeroVideo() {
    var vid = document.querySelector('.hero-video');
    if (!vid) return;
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.setAttribute('muted', '');
    vid.play().catch(function () {});
  }

  /* ── Navbar scroll ── */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    function update() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ── Mobile nav ── */
  function initMobileNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileNav = document.querySelector('.nav-mobile');
    const closeBtn = document.querySelector('.nav-mobile-close');
    const overlay = document.querySelector('.nav-overlay');
    if (!hamburger || !mobileNav) return;

    function open() {
      mobileNav.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      mobileNav.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    mobileNav.querySelectorAll('.mobile-link').forEach(function (l) {
      l.addEventListener('click', close);
    });
  }

  /* ── Active nav link ── */
  function setActiveLink() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ── Scroll reveal ── */
  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Staggered grid children ── */
  function initStaggeredGrids() {
    var grids = document.querySelectorAll('.why-grid, .products-grid, .recipes-grid, .infra-grid, .infra-gallery, .infra-stats');
    grids.forEach(function (grid) {
      var children = Array.from(grid.children);
      children.forEach(function (child, i) {
        child.classList.add('stagger-' + Math.min(i + 1, 6));
      });
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach(function (child) {
              child.classList.add('visible');
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(grid);
    });
  }

  /* ── Scroll progress bar ── */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Counter animation ── */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var prefix = el.dataset.prefix || '';
        var start = 0;
        var step = target / 50;
        var timer = setInterval(function () {
          start += step;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          el.textContent = prefix + Math.round(start) + suffix;
        }, 25);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ── Product filter tabs ── */
  function initProductFilter() {
    var tabs = document.querySelectorAll('.filter-tab');
    var cards = document.querySelectorAll('.product-card[data-cat]');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.dataset.cat;
        cards.forEach(function (card) {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = '';
            card.style.animation = 'heroSlideUp .4s ease both';
            setTimeout(function () { card.style.animation = ''; }, 500);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Card tilt on hover ── */
  function initCardTilt() {
    var cards = document.querySelectorAll('.why-card, .product-card, .recipe-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var midX = rect.width / 2;
        var midY = rect.height / 2;
        var rotX = ((y - midY) / midY) * -4;
        var rotY = ((x - midX) / midX) * 4;
        card.style.transform = 'translateY(-8px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
        card.style.transition = 'transform .1s ease, box-shadow .3s ease';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'all .3s ease';
      });
    });
  }

  /* ── WhatsApp float ── */
  function initWhatsApp() {
    var btn = document.querySelector('.whatsapp-float-btn');
    if (!btn || btn.getAttribute('href')) return;
    btn.addEventListener('click', function () {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + WHATSAPP_MSG, '_blank');
    });
  }

  /* ── Contact form ── */
  function initContactForm() {
    var form = document.querySelector('#contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var origText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#25D366';
        btn.style.borderColor = '#25D366';
        form.reset();
        setTimeout(function () {
          btn.textContent = origText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 3500);
      }, 1200);
    });
  }

  /* ── Smooth scroll ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Dealership form ── */
  function initDealerForm() {
    var form = document.querySelector('#dealer-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var origText = btn.textContent;
      btn.textContent = 'Submitting…';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Submitted ✓';
        btn.style.background = '#25D366';
        btn.style.borderColor = '#25D366';
        form.reset();
        setTimeout(function () {
          btn.textContent = origText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 3500);
      }, 1200);
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroVideo();
    initNavbar();
    initMobileNav();
    setActiveLink();
    initScrollReveal();
    initStaggeredGrids();
    initScrollProgress();
    initCounters();
    initProductFilter();
    initCardTilt();
    initWhatsApp();
    initContactForm();
    initDealerForm();
    initSmoothScroll();
  });
})();
