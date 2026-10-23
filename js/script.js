/* ================= HEARTCALM - script.js ================= */

const navbar = document.getElementById('mainNavbar');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarCollapseEl = document.getElementById('navbarNav');

/* ---------- Tinggi navbar dinamis ---------- */
function getNavbarHeight() {
  return navbar.offsetHeight;
}

function updateScrollOffset() {
  document.documentElement.style.setProperty('--navbar-height', getNavbarHeight() + 'px');
  document.documentElement.style.scrollPaddingTop = getNavbarHeight() + 'px';
}

/* ---------- Smooth scrolling + tutup menu mobile ---------- */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - getNavbarHeight();
      window.scrollTo({ top: top, behavior: 'smooth' });

      // Tutup hamburger menu otomatis (mobile)
      if (navbarCollapseEl.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl).hide();
      }
    });
  });
}

/* ---------- Navbar berubah saat scroll ---------- */
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateScrollOffset();
}

/* ---------- Scrollspy: tandai menu aktif ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');

  function setActiveLink() {
    const scrollPos = window.scrollY + getNavbarHeight() + 40;
    let currentId = '';

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();
}

/* ---------- Animasi counter statistik ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const statsRow = document.getElementById('statsRow');
  if (!statsRow) return;

  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        counters.forEach(animateCounter);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsRow);
}

/* ---------- Fade-in saat scroll ---------- */
function initFadeIn() {
  const items = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (item) { observer.observe(item); });
}

/* ---------- Validasi newsletter ---------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  const modalEl = document.getElementById('successModal');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateEmail() {
    const value = emailInput.value.trim();
    const isValid = emailRegex.test(value);
    emailInput.classList.toggle('is-valid', isValid);
    emailInput.classList.toggle('is-invalid', !isValid);
    return isValid;
  }

  emailInput.addEventListener('input', function () {
    if (emailInput.classList.contains('is-valid') || emailInput.classList.contains('is-invalid')) {
      validateEmail();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateEmail()) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
      form.reset();
      emailInput.classList.remove('is-valid', 'is-invalid');
    }
  });
}

/* ---------- Inisialisasi ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateScrollOffset();
  initSmoothScroll();
  initScrollSpy();
  initCounters();
  initFadeIn();
  initNewsletterForm();
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);
  window.addEventListener('resize', updateScrollOffset);
});
