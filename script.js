/* ==========================================================================
   AGL DIGITAL ECOSYSTEM — script.js
   1. Navigation & menu      5. Governance photo upload
   2. Quick dock + stepper   6. Carousel / counters / FAQ
   3. Search & dates         7. Lightbox / modal / forms
   4. AEP registration       8. Reveal animations
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================== 1. NAVIGATION ===================== */
  window.toggleMenu = function () {
    var nav = $('#navLinks'), ov = $('#navOverlay'), tg = $('#menuToggle');
    var open = nav.classList.toggle('active');
    ov.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (tg) {
      tg.setAttribute('aria-expanded', String(open));
      tg.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    }
  };

  // mobile dropdown accordions
  $$('.dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        var parent = this.parentElement;
        $$('.dropdown').forEach(function (d) { if (d !== parent) d.classList.remove('active'); });
        parent.classList.toggle('active');
      }
    });
  });

  // close mobile menu when a real link is used
  $$('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 768 && !this.parentElement.classList.contains('dropdown')) {
        if ($('#navLinks').classList.contains('active')) window.toggleMenu();
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($('#navLinks').classList.contains('active')) window.toggleMenu();
    $('#searchOverlay').classList.remove('active');
    closeLightbox();
    closeModal();
  });

  // smooth in-page scrolling that respects the sticky header
  window.scrollToId = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - 88;
    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      window.scrollToId(href.slice(1));
      if (history.replaceState) history.replaceState(null, '', href);
    });
  });

  /* ===================== 2. QUICK DOCK + SECTION STEPPER ===================== */
  window.goTop = function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  window.goFooter = function () {
    var f = $('#site-footer');
    if (f) window.scrollTo({ top: f.offsetTop - 10, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  var sections = $$('.snap-section');
  var stepper  = $('#sectionStepper');
  var dock     = $('#quickDock');
  var prevBtn  = $('#stepPrev');
  var nextBtn  = $('#stepNext');
  var label    = $('#stepLabel');
  var current  = 0;

  function currentIndex() {
    var y = window.pageYOffset + 140, idx = 0;
    sections.forEach(function (s, i) { if (s.offsetTop <= y) idx = i; });
    return idx;
  }

  window.stepSection = function (dir) {
    var target = Math.min(Math.max(currentIndex() + dir, 0), sections.length - 1);
    var el = sections[target];
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 84, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  function syncStepper() {
    if (!sections.length) return;
    current = currentIndex();
    if (label) label.textContent = sections[current].getAttribute('data-section-name') || '';
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === sections.length - 1;
  }

  /* ===================== 2b. SCROLL PROGRESS + VISIBILITY ===================== */
  var bar = $('#scrollProgress');
  var header = $('#siteHeader');
  var ticking = false;

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (window.pageYOffset / max) * 100 : 0;
    if (bar) bar.style.width = pct + '%';

    var past = window.pageYOffset > 380;
    if (dock) dock.classList.toggle('visible', past);
    if (stepper) stepper.classList.toggle('visible', past);
    if (header) header.classList.toggle('shrunk', window.pageYOffset > 40);

    syncStepper();
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', syncStepper);

  /* ===================== 3. SEARCH + DATES ===================== */
  window.toggleSearch = function () {
    var ov = $('#searchOverlay');
    ov.classList.toggle('active');
    if (ov.classList.contains('active')) $('#searchInput').focus();
  };

  var searchInput = $('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var q = this.value.trim().toLowerCase();
      if (!q) return;
      var map = [
        ['aep', 'aep-register'], ['register', 'aep-register'], ['sep', 'aep-sep'], ['wep', 'aep-wep'],
        ['hep', 'aep-hep'], ['pep', 'aep-pep'], ['rep', 'aep-rep'], ['eep', 'aep-eep'], ['bep', 'aep-bep'],
        ['asa', 'asa-academy'], ['course', 'asa-academy'], ['skill', 'asa-academy'],
        ['shop', 'agl-shop'], ['food', 'shop-food'], ['clothing', 'shop-clothing'],
        ['shelter', 'shop-shelter'], ['health', 'shop-healthcare'], ['education', 'shop-education'],
        ['domain', 'domain-services'], ['hosting', 'hosting-services'], ['ssl', 'ssl-services'],
        ['email', 'email-services'], ['security', 'web-security'], ['builder', 'website-builder'],
        ['contact', 'contact-agl'], ['privacy', 'privacy-policy'], ['about', 'about-agl'],
        ['board', 'administration-governance'], ['director', 'administration-governance'],
        ['journey', 'agl-journey'], ['constitution', 'constitution'], ['faq', 'f-head']
      ];
      var hit = map.find(function (p) { return q.indexOf(p[0]) > -1; });
      window.toggleSearch();
      this.value = '';
      if (hit) { window.scrollToId(hit[1]); }
      else { openModal('No match found', '<p>Nothing on this page matches “' + q.replace(/[<>]/g, '') + '”. Try AEP, ASA, hosting, shop or contact.</p>'); }
    });
  }

  function updateDates() {
    var now = new Date();
    var en = $('#english-date');
    if (en) en.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    var days = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
    var months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
    var bn = function (n) { return String(n).replace(/\d/g, function (d) { return '০১২৩৪৫৬৭৮৯'[d]; }); };
    var bd = $('#bangla-date');
    if (bd) bd.textContent = days[now.getDay()] + ', ' + bn(now.getDate()) + ' ' + months[now.getMonth()] + ' ' + bn(now.getFullYear());
    var yr = $('#year');
    if (yr) yr.textContent = now.getFullYear();
  }
  updateDates();

  /* ===================== 4. AEP REGISTRATION ===================== */
  var aepSelect   = $('#aep-program-select');
  var linkBox     = $('#aep-google-link-box');
  var googleLink  = $('#aep-google-link');
  var biodataForm = $('#aep-biodata-form');
  var confirmBox  = $('#aep-confirmation');

  if (aepSelect) {
    aepSelect.addEventListener('change', function () {
      var opt = this.options[this.selectedIndex];
      var link = opt ? opt.getAttribute('data-link') : null;
      if (link) {
        googleLink.href = link;
        linkBox.hidden = false;
        biodataForm.hidden = false;
        confirmBox.hidden = true;
      } else {
        linkBox.hidden = true;
        biodataForm.hidden = true;
        confirmBox.hidden = true;
      }
    });
  }

  if (biodataForm) {
    biodataForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('#aep-name').value || '').replace(/[<>]/g, '');
      confirmBox.innerHTML =
        '<h3>Registration submitted</h3><p>Thank you, <strong>' + name +
        '</strong>. Your AEP registration has been received. Our team will contact you shortly.</p>';
      confirmBox.hidden = false;
      biodataForm.reset();
      biodataForm.hidden = true;
      linkBox.hidden = true;
      aepSelect.value = '';
      confirmBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  }

  window.selectAEP = function (program) {
    if (!aepSelect) return;
    aepSelect.value = program;
    aepSelect.dispatchEvent(new Event('change'));
    window.scrollToId('aep-register');
    aepSelect.focus({ preventScroll: true });
  };

  window.jumpToContact = function (subject) {
    var sel = $('#cf-subject');
    if (sel && subject) sel.value = subject;
    window.scrollToId('contact-agl');
    return false;
  };

  /* ===================== 5. DOCUMENT & PHOTO UPLOADS ===================== */
  $$('.doc-upload-input').forEach(function (input) {
    input.addEventListener('change', function () {
      var el = $('#status-' + this.getAttribute('data-doc'));
      if (el && this.files && this.files[0]) el.textContent = 'Uploaded: ' + this.files[0].name;
    });
  });

  $$('.person-upload-input').forEach(function (input) {
    input.addEventListener('change', function () {
      if (!this.files || !this.files[0]) return;
      var id = this.getAttribute('data-person');
      var file = this.files[0];
      var url = URL.createObjectURL(file);

      var status = $('#status-' + id);
      if (status) status.textContent = 'Uploaded: ' + file.name;

      var frame = $('.person-card[data-person="' + id + '"] .person-photo-frame');
      if (frame) {
        frame.innerHTML = '<img src="' + url + '" alt="Uploaded portrait" id="photo-' + id + '">';
      }
      var dl = $('#download-' + id);
      if (dl) { dl.href = url; dl.setAttribute('download', id + '-photo.jpg'); }
    });
  });

  // reset the "checking" placeholders once the page is ready
  $$('.doc-status').forEach(function (el) {
    if (el.textContent.indexOf('Checking') === 0) el.textContent = 'No document uploaded yet.';
  });

  /* ===================== 6. CAROUSEL / COUNTERS / FAQ ===================== */
  var slide = 0;
  var slides = $$('.testimonial-card').length || 1;

  function updateCarousel() {
    var track = $('#testimonialTrack');
    if (track) track.style.transform = 'translateX(-' + (slide * 100) + '%)';
    $$('.carousel-dot').forEach(function (d, i) { d.classList.toggle('active', i === slide); });
  }
  window.moveCarousel = function (dir) { slide = (slide + dir + slides) % slides; updateCarousel(); };
  window.goToSlide = function (n) { slide = n; updateCarousel(); };

  var autoplay = null;
  function startAutoplay() {
    if (reduceMotion || autoplay) return;
    autoplay = setInterval(function () { slide = (slide + 1) % slides; updateCarousel(); }, 6000);
  }
  function stopAutoplay() { clearInterval(autoplay); autoplay = null; }
  var carousel = $('.testimonial-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
  }
  startAutoplay();

  // counters
  function animateCounters() {
    $$('.stat-number').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      if (reduceMotion) { el.textContent = target.toLocaleString() + '+'; return; }
      var start = performance.now(), dur = 1800;
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString() + '+';
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }
  var statsSection = $('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateCounters(); so.disconnect(); } });
    }, { threshold: .3 });
    so.observe(statsSection);
  }

  // FAQ accordion
  $$('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.parentElement;
      var wasOpen = item.classList.contains('active');
      $$('.faq-item').forEach(function (i) {
        i.classList.remove('active');
        var q = $('.faq-question', i);
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) { item.classList.add('active'); this.setAttribute('aria-expanded', 'true'); }
    });
  });

  // ASA flip cards — tap support on touch devices
  $$('.flip-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      this.classList.toggle('flipped');
    });
  });

  /* ===================== 7. LIGHTBOX / MODAL / FORMS ===================== */
  window.openLightbox = function (el, caption) {
    var img = el.querySelector('img');
    var lb = $('#lightbox');
    if (!lb || !img) return;
    $('#lightboxImg').src = img.src;
    $('#lightboxImg').alt = img.alt || '';
    $('#lightboxCaption').textContent = caption || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  window.closeLightbox = function () {
    var lb = $('#lightbox');
    if (lb) lb.classList.remove('active');
    document.body.style.overflow = '';
  };
  $$('.gallery-item').forEach(function (fig) {
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var cap = fig.querySelector('.gallery-overlay span');
        window.openLightbox(fig, cap ? cap.textContent : '');
      }
    });
  });

  window.openModal = function (title, body) {
    var m = $('#aglModal');
    if (!m) return;
    $('#modalTitle').textContent = title || 'Announcement';
    $('#modalBody').innerHTML = body || '<p>Content here.</p>';
    m.classList.add('active');
  };
  window.closeModal = function () {
    var m = $('#aglModal');
    if (m) m.classList.remove('active');
  };
  var modal = $('#aglModal');
  if (modal) modal.addEventListener('click', function (e) { if (e.target === this) window.closeModal(); });

  window.handleNewsletter = function (e) {
    e.preventDefault();
    var ok = $('#newsletterSuccess');
    if (!ok) return;
    ok.style.display = 'block';
    e.target.reset();
    setTimeout(function () { ok.style.display = 'none'; }, 4500);
  };

  window.handleContact = function (e) {
    e.preventDefault();
    var form = $('#contactForm'), ok = $('#contactSuccess');
    if (!ok) return;
    ok.hidden = false;
    if (form) form.style.display = 'none';
    setTimeout(function () {
      ok.hidden = true;
      if (form) { form.reset(); form.style.display = 'block'; }
    }, 5000);
  };

  /* ===================== 8. REVEAL + HERO TILT ===================== */
  if ('IntersectionObserver' in window) {
    var revealTargets = $$('.reveal, .company-block, .shop-block, .price-card, .flip-card, .person-card');
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('active'); ro.unobserve(en.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { ro.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('active'); });
  }

  // subtle pointer-driven 3D tilt on the hero card (desktop only)
  var hero = $('#heroTilt');
  if (hero && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    var frame;
    hero.addEventListener('mousemove', function (e) {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5;
        var y = (e.clientY - r.top) / r.height - .5;
        hero.style.transform = 'perspective(1400px) rotateX(' + (-y * 4).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg)';
        frame = null;
      });
    });
    hero.addEventListener('mouseleave', function () {
      hero.style.transform = 'perspective(1400px) rotateX(0) rotateY(0)';
    });
  }

  onScroll();
})();