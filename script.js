'use strict';

// ── 1. LOADER ─────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = 'visible';
  }, 2200);
});
document.body.style.overflow = 'hidden';

// ── 2. CUSTOM CURSOR ──────────────────────────────────────
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});
(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();
document.querySelectorAll('a, button, .gallery-item, .project-card, .achievement-card, .stack-pill, .bs-badge').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width = ring.style.width = '10px';
    dot.style.height = ring.style.height = '52px';
    ring.style.width = '52px'; ring.style.height = '52px';
    ring.style.borderColor = 'rgba(79,158,248,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width = '6px'; dot.style.height = '6px';
    ring.style.width = '36px'; ring.style.height = '36px';
    ring.style.borderColor = 'rgba(79,158,248,0.3)';
  });
});
if ('ontouchstart' in window) {
  dot.style.display = ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}

// ── 3. NAVBAR ─────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
  });
});

// ── 4. TYPED TEXT — real phrases from GitHub profile ──────
const phrases = [
  'Hi 👋, I\'m MOHAMMED ABDUL KHAISER',
  'FOUNDER & CEO — HITL PVT LTD',
  'EdTech Entrepreneur',
  'IT & Embedded Trainer | Tech Mentor',
  'Empowering Student Success with Technology',
  'Support with Internships & Projects',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const current = phrases[phraseIdx];
  if (deleting) {
    el.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(typeEffect, 400); return; }
    setTimeout(typeEffect, 35);
  } else {
    el.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) { deleting = true; setTimeout(typeEffect, 2000); return; }
    setTimeout(typeEffect, 70);
  }
}
setTimeout(typeEffect, 2600);

// ── 5. SCROLL REVEAL ──────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const delay = siblings.indexOf(entry.target) * 0.1;
      entry.target.style.transitionDelay = `${delay}s`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── 6. PARTICLES ──────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');
  container.appendChild(canvas);

  function resize() { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['rgba(79,158,248,','rgba(139,92,246,','rgba(249,115,22,','rgba(20,184,166,'];
  const COUNT  = 55;
  const pts    = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r:  Math.random() * 1.6 + 0.4,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    c:  COLORS[Math.floor(Math.random() * COLORS.length)],
    a:  Math.random() * 0.45 + 0.1,
  }));

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')'; ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(79,158,248,${0.04*(1-d/110)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
})();

// ── 7. COUNTERS ───────────────────────────────────────────
function animateCounter(el, target, dur = 1400) {
  const suffix = el.textContent.replace(/[0-9]/g,'');
  let start;
  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num,.card-n,.exp-num').forEach(el => {
        const m = el.textContent.match(/\d+/);
        if (m) animateCounter(el, parseInt(m[0]));
      });
    }
  });
}, { threshold: 0.5 }).observe(document.querySelector('.hero-stats'));

// ── 8. GALLERY LIGHTBOX ───────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── 9. CONTACT FORM ───────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn     = e.target.querySelector('.btn-submit');
  const success = document.getElementById('formSuccess');
  btn.innerHTML = '<span>Sending…</span>';
  btn.disabled  = true;
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
    btn.disabled  = false;
    success.classList.remove('hidden');
    e.target.reset();
    setTimeout(() => success.classList.add('hidden'), 5000);
  }, 1500);
});

// ── 10. 3D TILT on cards ──────────────────────────────────
document.querySelectorAll('.achievement-card, .project-card, .stack-category').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform  = `translateY(-6px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
    card.style.transition = 'transform 0.08s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

// ── 11. ACTIVE NAV HIGHLIGHT ──────────────────────────────
window.addEventListener('scroll', () => {
  const mid = window.scrollY + window.innerHeight / 2;
  document.querySelectorAll('section[id]').forEach(sec => {
    if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(a => a.style.color = '');
      const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (match) match.style.color = 'var(--blue)';
    }
  });
}, { passive: true });

// ── 12. NAV BRAND click → scroll top ─────────────────────
document.querySelector('.nav-brand').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 13. EXPERTISE ITEM stagger ────────────────────────────
document.querySelectorAll('.expertise-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.06}s`;
});

// ── 14. STACK PILL hover color ────────────────────────────
document.querySelectorAll('.stack-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    const icon = pill.querySelector('i');
    if (icon) { const color = getComputedStyle(icon).color; pill.style.borderColor = color + '44'; }
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.borderColor = '';
  });
});

console.log('%c Mohammed Abdul Khaiser — HITL PVT LTD', 'color:#4f9ef8;font-size:15px;font-weight:900;');
console.log('%c EdTech Entrepreneur | IT & Embedded Trainer | Tech Mentor', 'color:#8b5cf6;font-size:12px;');
console.log('%c mohammadabdulkhaiser@gmail.com', 'color:#f97316;font-size:11px;');
