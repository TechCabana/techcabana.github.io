/* ═══════════════════════════════════════════════
   ANKHIT SHARMA PORTFOLIO — MAIN.JS
   ═══════════════════════════════════════════════ */

'use strict';

// ── Navbar scroll effect ──────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ── Active nav link on scroll ─────────────────
const sections     = document.querySelectorAll('section[id]');
const navLinkEls   = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });
    navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ── Smooth scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        document.querySelector('.nav-links')?.classList.remove('open');
    });
});

// ── Mobile menu ───────────────────────────────
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinksMenu  = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinksMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinksMenu.classList.toggle('open');
    });
}

// ── Fade-up intersection observer ─────────────
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ── Skills filter bar ─────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const skillTags  = document.querySelectorAll('.skill-tag');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        skillTags.forEach(tag => {
            if (filter === 'all' || tag.getAttribute('data-level') === filter) {
                tag.classList.remove('hidden');
            } else {
                tag.classList.add('hidden');
            }
        });
    });
});

// ── Toast notification (replaces native alert) ─
function showToast(message, type = 'success') {
    const existing = document.querySelector('.portfolio-toast');
    if (existing) existing.remove();

    // Appearance comes from .portfolio-toast in style.css; this only decides which
    // variant to show and when it enters and leaves.
    const toast = document.createElement('div');
    toast.className = type === 'error' ? 'portfolio-toast error' : 'portfolio-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
}

// ── Contact form ──────────────────────────────
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const sendBtn    = this.querySelector('.btn-send');
        const nameVal    = this.querySelector('[name="from_name"]')?.value || '';
        const origHTML   = sendBtn.innerHTML;

        sendBtn.innerHTML  = 'Sending…';
        sendBtn.disabled   = true;

        emailjs.sendForm(
            'service_kmjfln4',
            'template_crstyii',
            this
        )
        .then(() => {
            showToast(`Message sent! I'll be in touch soon, ${nameVal}.`);
            contactForm.reset();
        })
        .catch(err => {
            console.error('EmailJS error:', err);
            showToast('Something went wrong. Please try again.', 'error');
        })
        .finally(() => {
            sendBtn.innerHTML = origHTML;
            sendBtn.disabled  = false;
        });
    });
}

// ── Demo Modal ────────────────────────────────
const demoModal     = document.getElementById('demoModal');
const demoIframe    = document.getElementById('demoIframe');
const modalCloseBtn = document.querySelector('.modal-close-btn');

document.querySelectorAll('.view-demo-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const src = this.getAttribute('data-demo-src');
        if (src && demoIframe && demoModal) {
            demoIframe.src = src;
            demoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

function closeModal() {
    if (!demoModal) return;
    demoModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { demoIframe.src = ''; }, 300);
}

modalCloseBtn?.addEventListener('click', closeModal);

demoModal?.addEventListener('click', function(e) {
    if (e.target === demoModal) closeModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// ── Tab visibility optimisation ───────────────
document.addEventListener('visibilitychange', () => {
    document.body.style.willChange = document.hidden ? 'auto' : '';
});

// ── Init ──────────────────────────────────────
window.addEventListener('load', () => {
    // Trigger active nav on load
    updateActiveNav();

    // If page loaded at a hash, mark that link active
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(`.nav-links a[href="${hash}"]`);
        if (target) {
            navLinkEls.forEach(l => l.classList.remove('active'));
            target.classList.add('active');
        }
    }

    console.log('Portfolio ready.');
});