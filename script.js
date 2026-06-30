/* ==========================================
   THEME TOGGLE SYSTEM
   ========================================== */
const themeSwitches = document.querySelectorAll('.theme-switch');
const body = document.body;

// Check existing preference
const storedTheme = localStorage.getItem('theme-mode');
if (storedTheme) {
    if (storedTheme === 'dark-mode') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
    updateSwitchIcon(storedTheme);
} else {
    body.classList.add('light-mode');
    updateSwitchIcon('light-mode');
}

themeSwitches.forEach(btn => {
    btn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme-mode', 'dark-mode');
            updateSwitchIcon('dark-mode');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme-mode', 'light-mode');
            updateSwitchIcon('light-mode');
        }
    });
});

function updateSwitchIcon(theme) {
    themeSwitches.forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            if (theme === 'dark-mode') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    });
}

/* ==========================================
   NAVIGATION ACTIVE HIGHLIGHT & MOBILE AUTO-CLOSE
   ========================================== */
const currentPath = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('.nav-link-custom-xorba');
const navbarCollapse = document.getElementById('navbarNav');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    // Highlight if URL matches, or if at root and link is index.html
    if (currentPath === linkHref || (currentPath === "" && linkHref === "index.html")) {
        link.classList.add('active');
    } else {
        if (linkHref !== "#") {
            link.classList.remove('active');
        }
    }

    // Auto-close mobile drawer when any navigation link is clicked
    link.addEventListener('click', () => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

/* ==========================================
   CONTACT FORM MOCK VALIDATION & API
   ========================================== */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const feedbackMsg = document.getElementById('form-feedback');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;
        
        btnText.textContent = 'Sending...';
        feedbackMsg.textContent = '';
        feedbackMsg.className = 'feedback-msg';

        setTimeout(() => {
            feedbackMsg.textContent = 'Message sent! I will get back to you shortly.';
            feedbackMsg.classList.add('success');
            
            contactForm.reset();
            submitBtn.disabled = false;
            btnText.textContent = originalText;
            
            setTimeout(() => {
                feedbackMsg.textContent = '';
                feedbackMsg.className = 'feedback-msg';
            }, 6000);
        }, 1500);
    });
}

/* ==========================================
   CUSTOM CURSOR EFFECT
   ========================================== */
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate dot tracking
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverableElements = document.querySelectorAll('a, button, .project-item-card, .pill, .fact-box, .timeline-row-flow, .form-field-flow input, .form-field-flow textarea');
hoverableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '52px';
        cursor.style.height = '52px';
        cursor.style.borderColor = 'var(--primary)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '32px';
        cursor.style.height = '32px';
        cursor.style.borderColor = 'var(--primary)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

/* ==========================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================== */
const revealElements = document.querySelectorAll('.project-item-card, .fact-box, .timeline-row-flow, .skills-category-group, .channel-card-flow, .minimalist-form-flow, .section-title, .skills-graphic-panel, .reveal-fade, .reveal-slide-left, .reveal-slide-right');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Trigger once
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    // If it doesn't already have one of the reveal classes, add scroll-reveal
    if (!el.classList.contains('reveal-fade') && !el.classList.contains('reveal-slide-left') && !el.classList.contains('reveal-slide-right')) {
        el.classList.add('scroll-reveal');
    }
    revealObserver.observe(el);
});

/* ==========================================
   BUTTON CLICK RIPPLE EFFECT
   ========================================== */
const buttons = document.querySelectorAll('button, .btn-download-cv, .submit-button-flow, .link-card-flow, .btn-xorba-primary, .btn-xorba-secondary');
buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('click-ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
    });
});
