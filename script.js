/* ====================================================
   SAMRIDDHI BHOG — MAIN JAVASCRIPT
   Navigation · WhatsApp · Scroll Reveal · Animations
   ==================================================== */

(function () {
  'use strict';

  /* ---- Config ---- */
  const WHATSAPP_NUMBER = '919876543210'; // Demo number — replace before going live
  const WHATSAPP_MSG    = encodeURIComponent('Hello! I would like to place an order with Samriddhi Bhog. Please assist me.');

  /* ---- Navbar scroll behaviour ---- */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function updateNavbar() {
      if (window.scrollY > 40) {
        navbar.classList.remove('navbar--transparent');
        navbar.classList.add('navbar--solid');
      } else {
        navbar.classList.add('navbar--transparent');
        navbar.classList.remove('navbar--solid');
      }
    }

    // Hero pages start transparent; inner pages start solid
    const isHero = document.querySelector('.hero, .sb-hero, .video-hero');
    if (!isHero) {
      navbar.classList.add('navbar--solid');
    } else {
      updateNavbar();
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
  }

  /* ---- Mobile nav ---- */
  function initMobileNav() {
    const hamburger  = document.querySelector('.nav-hamburger');
    const mobileNav  = document.querySelector('.nav-mobile');
    const closeBtn   = document.querySelector('.nav-mobile-close');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => mobileNav.classList.remove('open'))
    );
  }

  /* ---- Active nav link ---- */
  function setActiveLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .footer-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Scroll reveal ---- */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => observer.observe(el));
  }

  /* ---- Stagger children ---- */
  function initStagger() {
    document.querySelectorAll('.stagger-children').forEach(parent => {
      Array.from(parent.children).forEach((child, i) => {
        child.classList.add('reveal');
        child.style.transitionDelay = `${i * 0.08}s`;
      });
    });
    initScrollReveal();
  }

  /* ---- Counter animation ---- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count], [data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count || el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const dec    = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        let start    = 0;
        const step   = target / 60;
        const timer  = setInterval(() => {
          start += step;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          el.textContent = prefix + start.toFixed(dec) + suffix;
        }, 20);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* ---- Product filter tabs ---- */
  function initProductFilter() {
    const tabs  = document.querySelectorAll('.filter-tab, .pr-filter-btn');
    const cards = document.querySelectorAll('.product-card[data-cat], .pr-card[data-category]');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat || tab.dataset.filter;
        cards.forEach(card => {
          const cardCat = card.dataset.cat || card.dataset.category;
          if (cat === 'all' || cardCat === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- WhatsApp floating button ---- */
  function initWhatsApp() {
    const btn = document.querySelector('.whatsapp-float-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`, '_blank');
    });
  }

  /* ---- Contact form ---- */
  function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate submission (replace with real endpoint)
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#059669';
        form.reset();
        setTimeout(() => {
          btn.textContent = origText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3500);
      }, 1200);
    });
  }

  /* ---- WhatsApp order button inline ---- */
  function initWhatsAppOrder() {
    document.querySelectorAll('[data-whatsapp-order]').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = btn.dataset.whatsappOrder || 'your product';
        const msg = encodeURIComponent(`Hello! I would like to place an order for ${product} from Samriddhi Bhog.`);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
      });
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---- Init all ---- */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileNav();
    setActiveLink();
    initScrollReveal();
    initStagger();
    initCounters();
    initProductFilter();
    initWhatsApp();
    initContactForm();
    initWhatsAppOrder();
    initSmoothScroll();
  });
})();
