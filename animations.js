/* ==========================================
   MASTER ANIMATION ENGINE — TANISHA PORTFOLIO
   ========================================== */

/* ---- PAGE ENTRANCE ---- */
document.body.classList.add('page-entrance');
setTimeout(() => {
    document.body.classList.remove('page-entrance');
}, 1000);

/* ---- SCROLL PROGRESS BAR ---- */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
}, { passive: true });


/* ---- SCROLL REVEAL (INTERSECTION OBSERVER) ---- */
const allRevealEls = document.querySelectorAll(
    '.reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-zoom, .reveal-flip, ' +
    '.project-item-card, .fact-box, .timeline-row-flow, .skills-category-group, ' +
    '.channel-card-flow, .section-title, .skills-graphic-panel, .skill-meter-card, ' +
    '.service-card-xorba, .metric-box-xorba, .about-portrait-wrapper-xorba'
);

const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            const el = entry.target;
            // Stagger siblings
            const siblings = [...(el.parentElement?.children || [])];
            const siblingsWithClass = siblings.filter(s =>
                s.classList.contains('reveal-fade') ||
                s.classList.contains('reveal-slide-left') ||
                s.classList.contains('reveal-slide-right') ||
                s.classList.contains('reveal-zoom')
            );
            const siblIdx = siblingsWithClass.indexOf(el);
            const delay = siblIdx >= 0 ? siblIdx * 120 : 0;

            setTimeout(() => {
                el.classList.add('revealed');
                // Trigger skill meters when revealed
                el.querySelectorAll('.meter-fill').forEach(fill => {
                    const w = fill.style.width;
                    fill.style.setProperty('--target-width', w);
                    fill.style.width = '0%';
                    requestAnimationFrame(() => {
                        setTimeout(() => fill.classList.add('meter-animated'), 100);
                    });
                });
                // Trigger counter
                el.querySelectorAll('.metric-num, .exp-title').forEach(num => {
                    animateCounter(num);
                });
            }, delay);

            obs.unobserve(el);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

allRevealEls.forEach(el => {
    // Add base reveal class if missing
    if (!el.classList.contains('reveal-fade') &&
        !el.classList.contains('reveal-slide-left') &&
        !el.classList.contains('reveal-slide-right') &&
        !el.classList.contains('reveal-zoom') &&
        !el.classList.contains('reveal-flip')) {
        el.classList.add('reveal-fade');
    }
    revealObs.observe(el);
});

/* ---- ANIMATED NUMBER COUNTER ---- */
function animateCounter(el) {
    const text = el.textContent.trim();
    const numMatch = text.match(/\d+/);
    if (!numMatch) return;
    const target = parseInt(numMatch[0]);
    const prefix = text.split(numMatch[0])[0] || '';
    const suffix = text.split(numMatch[0])[1] || '';
    const duration = 1200;
    const start = performance.now();
    el.classList.add('counting');

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = prefix + Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

/* ---- SKILL METER FILL ON LOAD ---- */
// For meters already visible on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.meter-fill').forEach(fill => {
        const w = fill.getAttribute('style')?.match(/width:\s*([\d.]+%)/)?.[1];
        if (w) {
            fill.style.setProperty('--target-width', w);
            fill.style.width = '0%';
            setTimeout(() => fill.classList.add('meter-animated'), 400);
        }
    });
});

/* ---- TYPEWRITER EFFECT ---- */
function typewriterEffect(el, texts, speed = 80, pause = 2000) {
    let textIdx = 0, charIdx = 0, deleting = false;
    el.classList.add('typewriter-text');

    function tick() {
        const currentText = texts[textIdx];
        if (!deleting) {
            el.textContent = currentText.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === currentText.length) {
                deleting = true;
                setTimeout(tick, pause);
                return;
            }
        } else {
            el.textContent = currentText.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                textIdx = (textIdx + 1) % texts.length;
            }
        }
        setTimeout(tick, deleting ? speed / 2 : speed);
    }
    tick();
}

// Apply typewriter to hero subtitle if present
const typeTarget = document.querySelector('.typed-text-target');
if (typeTarget) {
    typewriterEffect(typeTarget, [
        'Web Developer',
        'UI/UX Designer',
        'Frontend Engineer',
        'Creative Coder'
    ]);
}

// Also apply to hero h1 span if it has class highlight-tanisha
const heroRole = document.querySelector('.hero-title-xorba');
if (heroRole) {
    // Add dynamic role word span
    const roleSpan = heroRole.querySelector('.role-type');
    if (roleSpan) {
        typewriterEffect(roleSpan, ['Web Developer', 'UI Designer', 'Frontend Engineer']);
    }
}

/* ---- MOUSE PARALLAX ON HERO IMAGE ---- */
const heroPortrait = document.querySelector('.hero-portrait-xorba');
if (heroPortrait) {
    document.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        heroPortrait.style.transform = `translate(${dx * 10}px, ${dy * 8}px) scale(1.02)`;
    }, { passive: true });
    document.addEventListener('mouseleave', () => {
        heroPortrait.style.transform = '';
    });
}

/* ---- ABOUT PHOTO FLOAT ---- */
const aboutPhoto = document.querySelector('.about-photo-xorba');
if (aboutPhoto) {
    aboutPhoto.classList.add('anim-float-slow');
}

/* ---- SKILLS IMAGE FLOAT ---- */
const skillsImg = document.querySelector('.skills-dashboard-image');
if (skillsImg) {
    skillsImg.classList.add('anim-float');
}

/* ---- HOVER TILT ON CARDS (3D) ---- */
document.querySelectorAll('.service-card-xorba, .project-item-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const tiltX = ((y - cy) / cy) * 8;
        const tiltY = ((x - cx) / cx) * -8;
        card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ---- CLICK RIPPLE EFFECT ---- */
document.querySelectorAll('.btn-xorba-primary, .btn-xorba-secondary, button').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('click-ripple');
        ripple.style.cssText = `
            position: absolute;
            left: ${e.clientX - rect.left}px;
            top: ${e.clientY - rect.top}px;
            width: 0; height: 0;
            background: rgba(255,255,255,0.4);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: rippleAnim 0.6s ease-out forwards;
            pointer-events: none;
        `;
        this.style.position = this.style.position || 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});

// Ripple keyframe via JS (in case not in CSS)
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
@keyframes rippleAnim {
    to { width: 200px; height: 200px; opacity: 0; }
}`;
document.head.appendChild(rippleStyle);

/* ---- STAGGER CHILDREN ANIMATION ---- */
function staggerChildren(parentSelector, childSelector, baseDelay = 100) {
    document.querySelectorAll(parentSelector).forEach(parent => {
        parent.querySelectorAll(childSelector).forEach((child, i) => {
            child.style.transitionDelay = `${i * baseDelay}ms`;
        });
    });
}
staggerChildren('.row', '.col-md-4', 120);
staggerChildren('.skills-metrics-panel', '.skills-category-group', 150);
staggerChildren('.about-metrics-row-xorba', '.metric-box-xorba', 120);

/* ---- NAVBAR SCROLL SHADOW ---- */
const navbar = document.querySelector('.custom-navbar-xorba');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }, { passive: true });
}
