/* =========================================================
   AGL DIGITAL ECOSYSTEM — MASTER JAVASCRIPT (FINAL)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. MAIN WEBSITE LOGIC
     ========================================================= */
  
  // Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');

  window.addEventListener('scroll', () => {
    if (scrollProgress) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
    }
    if (header) {
      header.style.boxShadow = window.scrollY > 50 
        ? '0 4px 30px rgba(0,0,0,0.15)' 
        : '0 4px 20px rgba(0,0,0,0.06)';
    }
  });

  // Global Navigation Functions
  window.scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  
  window.goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  window.goFooter = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  window.toggleMenu = () => {
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    if (navLinks) navLinks.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  };

  window.toggleSearch = () => {
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay) {
      searchOverlay.classList.toggle('active');
      if (searchOverlay.classList.contains('active')) {
        document.getElementById('searchInput')?.focus();
      }
    }
  };

  // Mobile Dropdown Toggle
  document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // Dates (English & Bangla)
  const enDateEl = document.getElementById('english-date');
  const bnDateEl = document.getElementById('bangla-date');
  if (enDateEl || bnDateEl) {
    const now = new Date();
    if (enDateEl) {
      enDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    }
    if (bnDateEl) {
      const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
      const bnDays = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
      const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
      const toBn = (num) => String(num).split('').map(d => bnDigits[+d] || d).join('');
      bnDateEl.textContent = `${bnDays[now.getDay()]}, ${toBn(now.getDate())} ${bnMonths[now.getMonth()]} ${toBn(now.getFullYear())}`;
    }
  }

  // Testimonial Carousel
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let carouselInterval;

  window.goToSlide = (index) => {
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };

  window.moveCarousel = (dir) => {
    goToSlide(currentSlide + dir);
    resetCarouselTimer();
  };

  function startCarouselTimer() {
    carouselInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  function resetCarouselTimer() {
    clearInterval(carouselInterval);
    startCarouselTimer();
  }

  if (track) {
    startCarouselTimer();
    track.parentElement.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    track.parentElement.addEventListener('mouseleave', startCarouselTimer);
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Modals & Lightbox
  const modal = document.getElementById('aglModal');
  window.openModal = (title, htmlContent) => {
    if (!modal) return;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = htmlContent;
    modal.classList.add('active');
  };
  window.closeModal = () => { if (modal) modal.classList.remove('active'); };

  const lightbox = document.getElementById('lightbox');
  window.openLightbox = (figure, caption) => {
    if (!lightbox) return;
    const img = figure.querySelector('img');
    if (img) {
      document.getElementById('lightboxImg').src = img.src;
      document.getElementById('lightboxCaption').textContent = caption;
      lightbox.classList.add('active');
    }
  };
  window.closeLightbox = () => { if (lightbox) lightbox.classList.remove('active'); };

  // Form Handlers
  const aepSelect = document.getElementById('aep-program-select');
  const googleLinkBox = document.getElementById('aep-google-link-box');
  const googleLink = document.getElementById('aep-google-link');
  const aepForm = document.getElementById('aep-biodata-form');

  window.selectAEP = (programCode) => {
    if (aepSelect) {
      aepSelect.value = programCode;
      aepSelect.dispatchEvent(new Event('change'));
      scrollToId('aep-register');
    }
  };

  if (aepSelect) {
    aepSelect.addEventListener('change', (e) => {
      const link = e.target.options[e.target.selectedIndex].getAttribute('data-link');
      if (link) {
        if (googleLink) googleLink.href = link;
        if (googleLinkBox) googleLinkBox.hidden = false;
        if (aepForm) aepForm.hidden = false;
      } else {
        if (googleLinkBox) googleLinkBox.hidden = true;
        if (aepForm) aepForm.hidden = true;
      }
    });
  }

  if (aepForm) {
    aepForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const confirm = document.getElementById('aep-confirmation');
      if (confirm) {
        confirm.hidden = false;
        confirm.innerHTML = '<h3>Registration Submitted!</h3><p>Thank you. Our team will verify your transaction ID and contact you soon.</p>';
        aepForm.reset();
        aepForm.hidden = true;
      }
    });
  }

  window.handleContact = (e) => {
    e.preventDefault();
    const success = document.getElementById('contactSuccess');
    if (success) {
      success.hidden = false;
      e.target.reset();
      setTimeout(() => success.hidden = true, 5000);
    }
  };

  window.handleNewsletter = (e) => {
    e.preventDefault();
    const success = document.getElementById('newsletterSuccess');
    if (success) {
      success.classList.add('show');
      e.target.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  };

  window.jumpToContact = (subject) => {
    scrollToId('contact-agl');
    const subjectSelect = document.getElementById('cf-subject');
    if (subjectSelect) subjectSelect.value = subject;
  };

  // Stats Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;
  window.addEventListener('scroll', () => {
    if (statsAnimated) return;
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        statsAnimated = true;
        statNumbers.forEach(stat => {
          const target = +stat.getAttribute('data-target');
          const duration = 2000;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = Math.ceil(current);
            }
          }, stepTime);
        });
      }
    }
  });

  // 3D Hero Tilt Effect
  const heroTilt = document.getElementById('heroTilt');
  if (heroTilt && window.innerWidth > 900) {
    heroTilt.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 40;
      const y = (window.innerHeight / 2 - e.clientY) / 40;
      heroTilt.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
    heroTilt.addEventListener('mouseleave', () => {
      heroTilt.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }


  /* =========================================================
     2. CINEMATIC LOADING SCREEN CONTROLLER (10 STEPS)
     ========================================================= */
  const preloader = document.getElementById('aglPreloader');
  if (!preloader) return;

  // i18n Dictionary
  const I18N = {
    bn: {
      skip: 'স্কিপ করুন', login: 'লগইন', register: 'রেজিস্টার', logout: 'লগআউট', aep_reg: 'AEP রেজিস্ট্রেশন', theme_lang: 'বাংলা / English',
      s1_eyebrow: 'অধ্যায় ০১ · শিকড়', s1_title: 'বাংলাদেশ, আমাদের প্রাণের ভূমি 🇧🇩', s1_desc: 'আমাদের প্রাণের ভূমি — যেখান থেকে শুরু প্রতিটি স্বপ্নের।',
      s2_eyebrow: 'অধ্যায় ০২ · বিস্তার', s2_title: '১,৪৭,৫৭০ বর্গকিলোমিটার বিস্তৃত', s2_div: 'বিভাগ', s2_dist: 'জেলা', s2_upz: 'উপজেলা', s2_uni: 'ইউনিয়ন', s2_quote: '"One Country. One Community. Endless Possibilities."',
      s3_bn: 'অতঃপর যখন সালাত সমাপ্ত হবে, তখন তোমরা পৃথিবীতে ছড়িয়ে পড়ো এবং আল্লাহর অনুগ্রহ (জীবিকা) অন্বেষণ করো। আর আল্লাহকে অধিক স্মরণ করো, যাতে তোমরা সফলকাম হতে পারো।', s3_src: 'সূরা আল-জুমুআহ · ৬২:১০',
      s4_eyebrow: 'অধ্যায় ০৪ · পরিচয়', s4_tagline: 'Build Future Together',
      s5_eyebrow: 'অধ্যায় ০৫ · ভিত্তি', s5_title: 'ভিশন · মিশন · দর্শন', p_vision: 'ভিশন', p_vision_txt: 'One Brand. One Name. One Network.', p_mission: 'মিশন', p_mission_txt: 'Empowering Youth Through Work.', p_phil: 'দর্শন', p_phil_txt: 'এথিক্যাল ইসলামিক',
      s6_eyebrow: 'অধ্যায় ০৬ · নেটওয়ার্ক', s6_title: '১০টি কৌশলগত অঞ্চল', s6_desc: 'Connecting Communities Across Bangladesh.',
      s7_eyebrow: 'অধ্যায় ০৭ · খাত', s7_title: '৫টি মূল ব্যবসায়িক খাত', s7_desc: 'Building Opportunities Through Business.', sec_food: 'খাদ্য', sec_clothes: 'বস্ত্র', sec_shelter: 'আশ্রয়', sec_health: 'স্বাস্থ্য', sec_edu: 'শিক্ষা',
      s8_eyebrow: 'অধ্যায় ০৮ · যাত্রা', s8_title: 'Empowering Youth Through Work',
      s9_tagline: 'Build Future Together', s9_status: 'আপনার ভবিষ্যৎ প্রস্তুত হচ্ছে…', s9_welcome: 'Anuprerona Global Limited-এ স্বাগতম',
      s10_by: 'ডেভেলপ করেছে', s10_role: 'ডিজাইন • ডেভেলপমেন্ট • ডিজিটাল ইনোভেশন', s10_msg: '"Build Future Together."', s10_ready: 'প্রবেশ করছে'
    },
    en: {
      skip: 'Skip Intro', login: 'Login', register: 'Register', logout: 'Logout', aep_reg: 'AEP Registration', theme_lang: 'English / বাংলা',
      s1_eyebrow: 'Chapter 01 · Rooted', s1_title: 'Bangladesh, Our Homeland 🇧🇩', s1_desc: 'The land of our heart — where every dream begins.',
      s2_eyebrow: 'Chapter 02 · Expanse', s2_title: '147,570 Square Kilometers', s2_div: 'Divisions', s2_dist: 'Districts', s2_upz: 'Upazilas', s2_uni: 'Unions', s2_quote: '"One Country. One Community. Endless Possibilities."',
      s3_bn: 'Then when the prayer is concluded, disperse within the land and seek from the bounty of Allah, and remember Allah often that you may succeed.', s3_src: 'Surah Al-Jumu\'ah · 62:10',
      s4_eyebrow: 'Chapter 04 · Identity', s4_tagline: 'Build Future Together',
      s5_eyebrow: 'Chapter 05 · Foundation', s5_title: 'Vision · Mission · Philosophy', p_vision: 'Vision', p_vision_txt: 'One Brand. One Name. One Network.', p_mission: 'Mission', p_mission_txt: 'Empowering Youth Through Work.', p_phil: 'Philosophy', p_phil_txt: 'Ethical Islamic',
      s6_eyebrow: 'Chapter 06 · Network', s6_title: '10 Strategic Regions', s6_desc: 'Connecting Communities Across Bangladesh.',
      s7_eyebrow: 'Chapter 07 · Sectors', s7_title: '5 Core Business Sectors', s7_desc: 'Building Opportunities Through Business.', sec_food: 'Food', sec_clothes: 'Clothes', sec_shelter: 'Shelter', sec_health: 'Healthcare', sec_edu: 'Education',
      s8_eyebrow: 'Chapter 08 · Journey', s8_title: 'Empowering Youth Through Work',
      s9_tagline: 'Build Future Together', s9_status: 'Preparing Your Future…', s9_welcome: 'Welcome to Anuprerona Global Limited',
      s10_by: 'Developed by', s10_role: 'Design • Development • Digital Innovation', s10_msg: '"Build Future Together."', s10_ready: 'Entering in'
    }
  };

  let currentLang = 'bn';
  
  // Theme/Language Toggle Button
  const langBtn = document.getElementById('aglThemeToggle');
  const langLabel = langBtn?.querySelector('.agl-theme-text');
  const progressBar = document.getElementById('aglProgressBar');
  const progressNum = document.getElementById('aglProgressNum');

  function applyLang(lang) {
    currentLang = lang;
    preloader.setAttribute('lang', lang);
    preloader.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (I18N[lang][key] !== undefined) el.textContent = I18N[lang][key];
    });
    if (langLabel) langLabel.textContent = I18N[lang].theme_lang;
    
    // Sync with main site select if exists
    const mainLangSelect = document.getElementById('langSelect');
    if (mainLangSelect) mainLangSelect.value = lang;
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => applyLang(currentLang === 'bn' ? 'en' : 'bn'));
  }

  // Session Guard: Skip loading screen if already seen
  if (sessionStorage.getItem('aglPreloaderSession') === '1') {
    preloader.classList.add('agl-hidden');
    document.body.style.overflow = '';
    setTimeout(() => preloader.remove(), 100);
    return;
  }
  document.body.style.overflow = 'hidden';

  window.aglClosePreloader = function () {
    preloader.classList.add('agl-hidden');
    document.body.style.overflow = '';
    sessionStorage.setItem('aglPreloaderSession', '1');
    setTimeout(() => preloader.remove(), 900);
  };

  const skipBtn = document.getElementById('aglSkipBtn');
  const prevBtn = document.getElementById('aglPrev');
  const nextBtn = document.getElementById('aglNext');
  const playPause = document.getElementById('aglPlayPause');
  const playIcon = document.getElementById('aglPlayIcon');
  const progressStep = document.getElementById('aglProgressStep');
  const statusText = document.getElementById('aglStatusText');
  const welcomeText = document.getElementById('aglWelcome');
  const steps = preloader.querySelectorAll('.agl-step');
  const dots_loader = preloader.querySelectorAll('.agl-dot');
  const starsBox = document.getElementById('aglStars');
  const countNum = document.getElementById('aglCountNum');
  const countRing = document.getElementById('aglCountRing');

  // Stars Generator
  if (starsBox && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const count = window.innerWidth < 600 ? 30 : 60;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'agl-star';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDuration = (2 + Math.random() * 4) + 's';
      s.style.animationDelay = (-Math.random() * 6) + 's';
      starsBox.appendChild(s);
    }
  }

  const BN_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function toNum(n) {
    if (currentLang !== 'bn') return String(n);
    return String(n).split('').map(d => BN_DIGITS[+d] ?? d).join('');
  }

  const TOTAL_STEPS = 10;
  const STEP_DURATIONS = {
    1: 3200, 2: 3400, 3: 5200, 4: 2800, 5: 3400,
    6: 3800, 7: 3400, 8: 3600, 9: 3800, 10: 4400
  };

  let currentStep = 1;
  let isPlaying = true;
  let autoTimer = null;
  let progressRAF = null;
  let aborted = false;
  let countdownTimer = null;

  function showStep(n, opts = {}) {
    if (aborted) return;
    n = Math.max(1, Math.min(TOTAL_STEPS, n));
    if (n === currentStep && !opts.force) return;
    currentStep = n;

    steps.forEach(el => el.classList.toggle('agl-active', Number(el.dataset.step) === n));
    dots_loader.forEach(d => d.classList.toggle('active', Number(d.dataset.step) === n));
    
    if (prevBtn) prevBtn.disabled = n === 1;
    if (nextBtn) nextBtn.disabled = n === TOTAL_STEPS;
    if (progressStep) progressStep.textContent = `Step ${n} / ${TOTAL_STEPS}`;

    if (n === 9) startProgressAnimation();
    if (n === 10) startCountdown();
    else stopCountdown();

    if (isPlaying && !opts.manual && n < TOTAL_STEPS) {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => showStep(n + 1), STEP_DURATIONS[n]);
    } else if (n === TOTAL_STEPS && !isPlaying) {
      clearTimeout(autoTimer);
    }
  }

  function startProgressAnimation() {
    cancelAnimationFrame(progressRAF);
    const duration = STEP_DURATIONS[9] - 200;
    const start = performance.now();
    if (progressBar) progressBar.style.width = '0%';
    if (progressNum) progressNum.textContent = toNum(0) + '%';

    function tick(now) {
      if (aborted || currentStep !== 9) return;
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      if (progressBar) progressBar.style.width = pct + '%';
      if (progressNum) progressNum.textContent = toNum(Math.round(pct)) + '%';
      
      if (pct < 100) progressRAF = requestAnimationFrame(tick);
      else {
        if (statusText) statusText.textContent = currentLang === 'bn' ? 'প্রায় শেষ…' : 'Almost there…';
        setTimeout(() => {
          if (currentStep === 9 && welcomeText) welcomeText.classList.add('agl-show');
        }, 300);
      }
    }
    progressRAF = requestAnimationFrame(tick);
  }

  function startCountdown() {
    stopCountdown();
    let n = 3;
    if (countNum) countNum.textContent = n;
    if (countRing) {
      countRing.style.transition = 'none';
      countRing.style.strokeDashoffset = '283';
      void countRing.offsetWidth;
      countRing.style.transition = 'stroke-dashoffset 0.95s linear';
      countRing.style.strokeDashoffset = '0';
    }

    countdownTimer = setInterval(() => {
      n--;
      if (n < 0) {
        stopCountdown();
        window.aglClosePreloader();
        return;
      }
      if (countNum) {
        countNum.textContent = n;
        countNum.style.animation = 'none';
        void countNum.offsetWidth;
        countNum.style.animation = 'countPulse 1s ease-in-out infinite';
      }
      if (countRing) {
        countRing.style.transition = 'none';
        countRing.style.strokeDashoffset = '283';
        void countRing.offsetWidth;
        countRing.style.transition = 'stroke-dashoffset 0.95s linear';
        countRing.style.strokeDashoffset = '0';
      }
    }, 1000);
  }

  function stopCountdown() {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  function setPlaying(state) {
    isPlaying = state;
    if (playIcon) playIcon.className = state ? 'fas fa-pause' : 'fas fa-play';
    if (playPause) playPause.setAttribute('aria-label', state ? 'Pause' : 'Play');
    clearTimeout(autoTimer);
    if (state && currentStep < TOTAL_STEPS) {
      autoTimer = setTimeout(() => showStep(currentStep + 1), STEP_DURATIONS[currentStep]);
    }
    if (state && currentStep === 9) startProgressAnimation();
  }

  if (playPause) playPause.addEventListener('click', () => setPlaying(!isPlaying));

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearTimeout(autoTimer);
      if (currentStep === 10) stopCountdown();
      showStep(currentStep - 1, { manual: true });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearTimeout(autoTimer);
      if (currentStep === 10) stopCountdown();
      showStep(currentStep + 1, { manual: true });
    });
  }

  dots_loader.forEach(d => {
    d.addEventListener('click', () => {
      clearTimeout(autoTimer);
      if (currentStep === 10) stopCountdown();
      showStep(Number(d.dataset.step), { manual: true });
    });
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      aborted = true;
      stopCountdown();
      cancelAnimationFrame(progressRAF);
      clearTimeout(autoTimer);
      window.aglClosePreloader();
    });
  }

  // Keyboard shortcuts for Loader
  document.addEventListener('keydown', (e) => {
    if (aborted) return;
    if (e.key === 'Escape') skipBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === ' ') { e.preventDefault(); playPause?.click(); }
  });

  // Init Loader
  applyLang(currentLang);
  if (prevBtn) prevBtn.disabled = true;

  const fontsReady = (document.fonts && document.fonts.ready)
    ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))])
    : Promise.resolve();

  fontsReady.then(() => showStep(1, { force: true }));

});// ============ ADDITIONAL JS FOR THEME & TOP BAR ============

// Toggle Language Dropdown from Globe Icon
window.toggleLang = function() {
  const select = document.getElementById('langSelect');
  if (select) {
    select.focus(); // Opens the select dropdown
  }
};

// Toast Notification Helper (for main site language change)
window.showToast = function(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: var(--maroon); color: var(--white); padding: 12px 24px;
    border-radius: 50px; font-size: 0.85rem; z-index: 999999;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 1px solid var(--gold);
    animation: toastFade 3s ease forwards;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// Add toast animation style dynamically
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes toastFade {
    0% { opacity: 0; transform: translate(-50%, 20px); }
    10% { opacity: 1; transform: translate(-50%, 0); }
    90% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, -20px); }
  }
`;
document.head.appendChild(toastStyle);/* =========================================================
   LIFE STATUS BAR LOGIC
   ========================================================= */
(function initLifeStatusBar() {
  const clockEl = document.getElementById('lsb-clock');
  const greetingEl = document.getElementById('lsb-greeting');
  const marqueeEl = document.querySelector('.lsb-marquee span');
  
  if (!clockEl) return;

  // 1. Live Clock Function
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    clockEl.textContent = strTime;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 2. Dynamic Greeting (Based on Time & Language)
  function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const isBn = document.getElementById('aglPreloader')?.getAttribute('data-lang') === 'bn' || document.documentElement.lang === 'bn';
    
    let greeting = '';
    if (hour >= 5 && hour < 12) {
      greeting = isBn ? 'শুভ সকাল' : 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      greeting = isBn ? 'শুভ অপরাহ্ন' : 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      greeting = isBn ? 'শুভ সন্ধ্যা' : 'Good Evening';
    } else {
      greeting = isBn ? 'শুভ রাত্রি' : 'Good Night';
    }
    if (greetingEl) greetingEl.textContent = greeting + ' • AGL';
  }
  updateGreeting();

  // 3. Rotating Marquee Messages
  const messages = [
    "🚀 Build Future Together — Empowering Youth Through Work",
    "🌟 One Brand. One Name. One Network.",
    "🤝 Ethical Islamic Ribba-Free Business",
    "📚 LEARN → SKILL → ENTREPRENEUR → BUSINESS → INCOME → GROWTH",
    "🇧🇩 Connecting Communities Across Bangladesh"
  ];
  let msgIndex = 0;
  if (marqueeEl) {
    setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      marqueeEl.style.opacity = '0';
      setTimeout(() => {
        marqueeEl.textContent = messages[msgIndex];
        marqueeEl.style.opacity = '1';
      }, 500);
    }, 8000); // Change message every 8 seconds
  }

  // 4. Sync Greeting when language changes
  const originalApplyLang = window.applyLang;
  if (typeof window.applyLang === 'function') {
    window.applyLang = function(lang) {
      originalApplyLang(lang);
      document.documentElement.lang = lang;
      updateGreeting(); // Refresh greeting on language change
    };
  }
})();/* =========================================================
   3D HEADER INTERACTIONS & SCROLL EFFECT
   ========================================================= */
(function initPremiumHeader() {
  const header = document.getElementById('siteHeader');
  
  // Add floating/scrolled effect to header
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile dropdown toggle fix (already in main script, but ensuring it works smoothly)
  document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const parentLi = link.parentElement;
        
        // Close other open dropdowns
        document.querySelectorAll('.dropdown.open').forEach(openLi => {
          if (openLi !== parentLi) openLi.classList.remove('open');
        });
        
        parentLi.classList.toggle('open');
      }
    });
  });

  // 3D Tilt Effect on Navbar Links (Desktop Only)
  if (window.innerWidth > 900) {
    const navLinks = document.querySelectorAll('.nav-links > li > a');
    navLinks.forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        link.style.transform = `perspective(500px) rotateY(${x / 10}deg) rotateX(${-y / 10}deg) translateY(-2px)`;
      });
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'perspective(500px) rotateY(0deg) rotateX(0deg) translateY(0)';
      });
    });
  }

})();/* =========================================================
   3D HERO TILT EFFECT & PARALLAX
   ========================================================= */
(function initHero3DTilt() {
  const heroTilt = document.getElementById('heroTilt');
  const tiltElements = document.querySelectorAll('[data-tilt]');
  
  // 1. Hero Section Parallax Tilt (Follows Mouse)
  if (heroTilt && window.innerWidth > 900) {
    heroTilt.addEventListener('mousemove', (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      heroTilt.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    heroTilt.addEventListener('mouseleave', () => {
      heroTilt.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // 2. Individual Card 3D Tilt Effect
  if (window.innerWidth > 768) {
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        
        // Move glow effect
        const glow = el.querySelector('.hero-panel-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.3) 0%, transparent 60%)`;
        }
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }
})();/* =========================================================
   COMPLIANCE DOCUMENT UPLOAD & PREVIEW LOGIC
   ========================================================= */
(function initComplianceDocs() {
  const inputs = document.querySelectorAll('.doc-image-input');
  const viewBtns = document.querySelectorAll('.view-doc-btn');
  
  // Load saved images from localStorage on page load
  inputs.forEach(input => {
    const docId = input.dataset.doc;
    const savedImg = localStorage.getItem('agl_doc_' + docId);
    if (savedImg) {
      updateDocUI(docId, savedImg);
    }
  });

  // Handle Image Upload
  inputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const docId = input.dataset.doc;
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const imgData = event.target.result;
        localStorage.setItem('agl_doc_' + docId, imgData); // Save to LocalStorage
        updateDocUI(docId, imgData);
      };
      reader.readAsDataURL(file);
    });
  });

  // Update UI after upload/load
  function updateDocUI(docId, imgSrc) {
    const wrapper = document.querySelector(`.doc-image-wrap[data-doc-id="${docId}"]`);
    if (!wrapper) return;
    
    const placeholder = wrapper.querySelector('.doc-image-placeholder');
    const img = wrapper.querySelector('.doc-image');
    const viewBtn = document.querySelector(`.view-doc-btn[data-doc="${docId}"]`);
    
    if (img) {
      img.src = imgSrc;
      img.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
    if (viewBtn) viewBtn.disabled = false;
  }

  // Handle View Button Click (Uses existing Lightbox)
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.dataset.doc;
      const savedImg = localStorage.getItem('agl_doc_' + docId);
      
      if (savedImg && typeof window.openLightbox === 'function') {
        // Use existing lightbox function, wrapping img in figure
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = savedImg;
        figure.appendChild(img);
        
        // Call the global openLightbox function created earlier
        window.openLightbox(figure, document.querySelector(`.compliance-card .doc-image-wrap[data-doc-id="${docId}"]`).previousElementSibling.textContent);
      }
    });
  });

})();/* =========================================================
   3D BOARD CARDS TILT EFFECT & IMAGE UPLOAD
   ========================================================= */
(function initBoardCards3D() {
  const cards = document.querySelectorAll('.person-card-3d');
  
  // 1. 3D Tilt Effect (Desktop Only)
  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        
        // Move the glow effect to follow the mouse
        const glow = card.querySelector('.person-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.25) 0%, transparent 60%)`;
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        const glow = card.querySelector('.person-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)`;
        }
      });
    });
  }

  // 2. Handle Local Image Uploads for each person card
  const uploadInputs = document.querySelectorAll('.person-upload-input');
  
  // Load saved images from localStorage on page load
  uploadInputs.forEach(input => {
    const personId = input.dataset.person;
    const savedImg = localStorage.getItem('agl_person_' + personId);
    
    if (savedImg) {
      updatePersonPhoto(personId, savedImg);
    }
    
    // Handle new upload
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgData = event.target.result;
        localStorage.setItem('agl_person_' + personId, imgData); // Save
        updatePersonPhoto(personId, imgData);
      };
      reader.readAsDataURL(file);
    });
  });

  // Function to update the UI after photo upload
  function updatePersonPhoto(personId, imgSrc) {
    const card = document.querySelector(`.person-card-3d[data-person="${personId}"]`);
    if (!card) return;
    
    const frame = card.querySelector('.person-photo-frame');
    const statusText = card.querySelector('.photo-status');
    
    // Replace placeholder or existing image
    let img = frame.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = "Uploaded portrait";
      frame.appendChild(img);
    }
    img.src = imgSrc;
    img.style.display = 'block';
    
    // Remove placeholder if it exists
    const placeholder = frame.querySelector('.photo-placeholder');
    if (placeholder) placeholder.remove();
    
    // Update status text
    if (statusText) {
      statusText.textContent = 'Photo uploaded ✓';
      statusText.style.color = 'var(--green)';
      statusText.style.borderColor = 'var(--green)';
      statusText.style.background = 'rgba(34,139,34,0.1)';
    }
  }
})();/* =========================================================
   ADMINISTRATION & GOVERNANCE — 3D CARDS & IMAGE UPLOAD
   ========================================================= */
(function initBoardCards3D() {
  const cards = document.querySelectorAll('.person-card-3d');
  if (cards.length === 0) return;

  /* ---------------------------------------------------------
     1. 3D TILT EFFECT (Desktop Only)
     --------------------------------------------------------- */
  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;

        // Move glow to follow cursor
        const glow = card.querySelector('.person-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.25) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        const glow = card.querySelector('.person-glow');
        if (glow) {
          glow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 60%)';
        }
      });
    });
  }

  /* ---------------------------------------------------------
     2. IMAGE UPLOAD & STORAGE (localStorage)
     --------------------------------------------------------- */
  const uploadInputs = document.querySelectorAll('.person-upload-input');

  // Load saved images on page load
  uploadInputs.forEach(input => {
    const personId = input.dataset.person;
    const savedImg = localStorage.getItem('agl_person_' + personId);
    if (savedImg) {
      updatePersonPhoto(personId, savedImg);
    }
  });

  // Handle new image upload
  uploadInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type & size
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (JPG, PNG, WEBP).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be under 2 MB.');
        return;
      }

      const personId = input.dataset.person;
      const reader = new FileReader();

      reader.onload = (event) => {
        const imgData = event.target.result;
        try {
          localStorage.setItem('agl_person_' + personId, imgData);
          updatePersonPhoto(personId, imgData);
        } catch (err) {
          console.warn('Storage full. Photo not saved permanently.', err);
          updatePersonPhoto(personId, imgData); // Show at least for current session
        }
      };
      reader.readAsDataURL(file);
    });
  });

  // Update UI after upload or load
  function updatePersonPhoto(personId, imgSrc) {
    const card = document.querySelector(`.person-card-3d[data-person="${personId}"]`);
    if (!card) return;

    const frame = card.querySelector('.person-photo-frame');
    const statusText = card.querySelector('.photo-status');
    if (!frame) return;

    let img = frame.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = 'Portrait';
      img.loading = 'lazy';
      frame.appendChild(img);
    }
    img.src = imgSrc;
    img.style.display = 'block';
    img.style.objectFit = 'cover';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%';
    img.style.border = '3px solid var(--white)';
    img.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';

    // Remove placeholder if any
    const placeholder = frame.querySelector('.photo-placeholder');
    if (placeholder) placeholder.remove();

    // Update status text
    if (statusText) {
      statusText.innerHTML = '<i class="fas fa-check-circle"></i> Photo uploaded';
      statusText.style.color = 'var(--green)';
      statusText.style.borderColor = 'var(--green)';
      statusText.style.background = 'rgba(34, 139, 34, 0.1)';
    }

    // Ensure the rotating ring remains
    if (!frame.querySelector('.photo-ring')) {
      const ring = document.createElement('div');
      ring.className = 'photo-ring';
      frame.appendChild(ring);
    }
  }

  /* ---------------------------------------------------------
     3. KEYBOARD ACCESSIBILITY (Focus & Enter)
     --------------------------------------------------------- */
  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('focus', () => {
      card.style.borderColor = 'var(--gold)';
      card.style.boxShadow = '0 20px 50px rgba(128, 0, 0, 0.2), 0 0 25px rgba(212, 175, 55, 0.3)';
    });
    card.addEventListener('blur', () => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    });
  });

})();/* =========================================================
   TIMELINE 3D REVEAL ANIMATION (Scroll)
   ========================================================= */
(function initTimelineReveal() {
  const timelineItems = document.querySelectorAll('.timeline-item.reveal');
  if (timelineItems.length === 0) return;

  // Fallback: If IntersectionObserver not supported, show all
  if (!('IntersectionObserver' in window)) {
    timelineItems.forEach(item => item.classList.add('reveal'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  timelineItems.forEach(item => observer.observe(item));
})();/* =========================================================
   PREMIUM 3D STATS — COUNTER + REVEAL + TILT
   ========================================================= */
(function initStats3D() {
  const statCards = document.querySelectorAll('.stat-card-3d');
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statCards.length === 0) return;

  // 1. SCROLL REVEAL ANIMATION
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    statCards.forEach(card => revealObserver.observe(card));
  } else {
    // Fallback
    statCards.forEach(card => card.classList.add('reveal'));
  }

  // 2. COUNTER ANIMATION
  function animateNumber(el) {
    const target = +el.getAttribute('data-target');
    const duration = 2200; // ms
    const start = performance.now();
    
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing (easeOutQuart for smooth finish)
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(target * easeOut);
      
      el.textContent = current.toLocaleString('en-IN'); // e.g., 5,000
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('en-IN');
      }
    }
    requestAnimationFrame(update);
  }

  // Trigger counter when stats section is in view
  const statsSection = document.querySelector('.stats-section');
  let counted = false;
  
  function checkStats() {
    if (counted || !statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100 && rect.bottom >= 0) {
      counted = true;
      statNumbers.forEach(animateNumber);
    }
  }

  window.addEventListener('scroll', checkStats);
  // Also check immediately in case it's already visible
  setTimeout(checkStats, 300);

  // 3. 3D TILT EFFECT (Desktop only)
  if (window.innerWidth > 900) {
    statCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.03)`;
        
        const glow = card.querySelector('.stat-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.3) 0%, transparent 60%)`;
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        const glow = card.querySelector('.stat-glow');
        if (glow) {
          glow.style.background = 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 60%)';
        }
      });
    });
  }

  // 4. Resize handling (reset on orientation change)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 900) {
        statCards.forEach(card => {
          card.style.transform = '';
        });
      }
    }, 250);
  });

})();/* =========================================================
   WEB SOLUTION CARDS — 3D TILT EFFECT
   ========================================================= */
(function initWebSolutionCards() {
  const cards = document.querySelectorAll('.web-card-3d');
  if (cards.length === 0) return;

  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;

        const glow = card.querySelector('.web-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.25) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        const glow = card.querySelector('.web-glow');
        if (glow) {
          glow.style.background = 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)';
        }
      });
    });
  }
})();/* =========================================================
   ASA 3D FLIP CARDS — Touch Support & Keyboard
   ========================================================= */
(function initAsaFlipCards() {
  const flipCards = document.querySelectorAll('.asa-flip-card');
  if (flipCards.length === 0) return;

  // Touch devices: tap to flip (hover doesn't work)
  // Desktop: hover flips via CSS. Click won't break.
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't flip if user clicked on the "Enroll" button
      if (e.target.closest('.asa-back-btn')) return;

      if (window.innerWidth <= 900 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        card.classList.toggle('flipped');
      }
    });

    // Keyboard accessibility (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  // Reset flip on resize to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900) {
        flipCards.forEach(card => card.classList.remove('flipped'));
      }
    }, 250);
  });
})();/* =========================================================
   ONLINE SHOP CARDS — 3D TILT EFFECT
   ========================================================= */
(function initShopCards3D() {
  const cards = document.querySelectorAll('.shop-card-3d');
  if (cards.length === 0) return;

  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;

        const glow = card.querySelector('.shop-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.25) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        const glow = card.querySelector('.shop-glow');
        if (glow) {
          glow.style.background = 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)';
        }
      });
    });
  }
})();/* =========================================================
   GALLERY 3D TILT EFFECT & KEYBOARD ACCESSIBILITY
   ========================================================= */
(function initGallery3D() {
  const galleryCards = document.querySelectorAll('.gallery-card-3d');
  if (galleryCards.length === 0) return;

  // 1. 3D Tilt on desktop
  if (window.innerWidth > 900) {
    galleryCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      });
    });
  }

  // 2. Keyboard Accessibility (Enter / Space)
  galleryCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // 3. Reset tilt on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 900) {
        galleryCards.forEach(card => {
          card.style.transform = '';
        });
      }
    }, 250);
  });

})();/* =========================================================
   AEP CARDS — 3D TILT & FORM LOGIC
   ========================================================= */
(function initAEPCards3D() {
  const cards = document.querySelectorAll('.aep-card-3d');
  if (cards.length === 0) return;

  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.03)`;

        const glow = card.querySelector('.aep-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.3) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        const glow = card.querySelector('.aep-glow');
        if (glow) {
          glow.style.background = 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 60%)';
        }
      });
    });
  }
})();/* =========================================================
   FAQ 3D ACCORDION — SMOOTH ANIMATION
   ========================================================= */
(function initFaq3D() {
  const faqItems = document.querySelectorAll('.faq-item-3d');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-3d');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question-3d');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support (Enter/Space)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
})();/* =========================================================
   FOOTER: 360° DEV AVATAR TILT + YEAR + SCROLL INTERACTIONS
   ========================================================= */

(function initFooter3D() {

  /* ---------------------------------------------------------
     1. Auto Update Copyright Year
     --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     2. Developer Avatar 3D Tilt (Mouse Follow)
     --------------------------------------------------------- */
  const devAvatar = document.getElementById('devAvatar3D');
  if (devAvatar && window.innerWidth > 768) {
    devAvatar.addEventListener('mousemove', (e) => {
      const rect = devAvatar.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Rotate based on mouse position
      const rotateY = (x / rect.width) * 30;
      const rotateX = -(y / rect.height) * 30;

      devAvatar.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    devAvatar.addEventListener('mouseleave', () => {
      devAvatar.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  /* ---------------------------------------------------------
     3. Footer Reveal on Scroll (Fade-In Effect)
     --------------------------------------------------------- */
  const footerCols = document.querySelectorAll('.footer-col');
  if ('IntersectionObserver' in window && footerCols.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    footerCols.forEach((col, i) => {
      col.style.opacity = '0';
      col.style.transform = 'translateY(30px)';
      col.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      observer.observe(col);
    });
  } else {
    footerCols.forEach(col => {
      col.style.opacity = '1';
      col.style.transform = 'translateY(0)';
    });
  }

  /* ---------------------------------------------------------
     4. Top / Footer Nav Button Pulse (Optional UX Feedback)
     --------------------------------------------------------- */
  const tbnButtons = document.querySelectorAll('.tbn-btn');
  tbnButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Add ripple effect on click
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });

  /* ---------------------------------------------------------
     5. Section Stepper — Update Label on Scroll
     --------------------------------------------------------- */
  const stepperLabel = document.getElementById('stepLabel');
  const sections = document.querySelectorAll('.snap-section');

  if (stepperLabel && sections.length > 0) {
    const sectionNames = {
      'Home': 'Home',
      'Testimonials': 'Reviews',
      'Company': 'Company',
      'Journey': 'Evolution',
      'Impact': 'Impact',
      'Web Solution': 'Web Solution',
      'ASA Academy': 'ASA',
      'Online Shop': 'Shop',
      'Gallery': 'Gallery',
      'AEP Registration': 'AEP',
      'FAQ': 'FAQ',
      'Privacy': 'Privacy',
      'Contact': 'Contact',
      'Newsletter': 'Newsletter'
    };

    window.addEventListener('scroll', () => {
      let currentName = 'Home';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          const rawName = section.getAttribute('data-section-name') || 'Home';
          currentName = sectionNames[rawName] || rawName;
        }
      });
      stepperLabel.textContent = currentName;
    });
  }

  /* ---------------------------------------------------------
     6. Developer Avatar Touch Support (Mobile)
     --------------------------------------------------------- */
  if (devAvatar && window.innerWidth <= 768) {
    devAvatar.addEventListener('click', () => {
      devAvatar.style.transform = 'perspective(800px) rotateY(360deg) scale(1.05)';
      setTimeout(() => {
        devAvatar.style.transform = 'perspective(800px) rotateY(0deg) scale(1)';
      }, 800);
    });
  }

})();/* =========================================================
   THEME TOGGLE — DARK / LIGHT MODE
   ========================================================= */
(function initThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  const label = document.getElementById('ttLabel');
  if (!btn) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('agl_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (label) label.textContent = 'Light';
  } else {
    if (label) label.textContent = 'Dark';
  }

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('agl_theme', isDark ? 'dark' : 'light');
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
  });
})();