/* ===================================================
   HYDRO-HABIT — ANIMATIONS & INTERACTIVITY
   =================================================== */

document.addEventListener('DOMContentLoaded', function() {

if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded — showing content without animations');
    // Show heatmap cells without animation
    document.body.classList.add('no-gsap');
    // Generate heatmap cells even without GSAP
    const grid = document.getElementById('heatmap-grid');
    if (grid) {
        const intensities = [
            0.8, 0.6, 1.0, 0.4, 0.9, 0.7, 0.3,
            1.0, 0.8, 0.5, 1.0, 0.6, 0.9, 0.8,
            0.4, 1.0, 0.7, 0.9, 0.3, 1.0, 0.6,
            0.9, 0.8, 1.0, 0.5, 0.7, 0.2, 0.0
        ];
        intensities.forEach((intensity) => {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell filled';
            cell.style.setProperty('--fill-opacity', intensity || 0.1);
            grid.appendChild(cell);
        });
    }
    return;
}

document.body.classList.add('gsap-ready');
gsap.registerPlugin(ScrollTrigger);

// ===================================================
// HELPER: Create a safe scroll-triggered animation
// Uses toggleActions to ensure elements become visible
// even if user scrolls fast or past the trigger
// ===================================================
function revealOnScroll(targets, fromVars, triggerEl, extraConfig) {
    const config = Object.assign({
        scrollTrigger: {
            trigger: triggerEl || targets,
            start: 'top 85%',
            toggleActions: 'play none none none', // play on enter, never reverse
        },
    }, fromVars, extraConfig);
    
    return gsap.from(targets, config);
}

// ===================================================
// HERO CANVAS — Floating Water Particles
// ===================================================
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w, h;
    const particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.3 + 0.05;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    resize();
    window.addEventListener('resize', resize);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

initHeroCanvas();

// ===================================================
// HERO ENTRANCE ANIMATION
// ===================================================
const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });

heroTL
    .from('#navbar', { y: -30, opacity: 0, duration: 0.8 })
    .from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-headline .line', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15
    }, '-=0.3')
    .from('.hero-sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-cta-row', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.hero-product-wrapper', {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-scroll-hint', { opacity: 0, duration: 0.5 }, '-=0.3');

// ===================================================
// HERO PARALLAX — product floats on scroll
// ===================================================
gsap.to('.hero-product-wrapper', {
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: 150,
    scale: 0.9,
    opacity: 0.3
});

gsap.to('.product-glow', {
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    scale: 2,
    opacity: 0
});

// ===================================================
// ANIMATED COUNTERS
// ===================================================
document.querySelectorAll('.proof-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    gsap.fromTo(el, 
        { innerText: 0 },
        {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power2.out'
        }
    );
});

document.querySelectorAll('.counter[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    gsap.fromTo(el,
        { innerText: 0 },
        {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power2.out'
        }
    );
});

// ===================================================
// SOCIAL PROOF BAR
// ===================================================
revealOnScroll('.proof-item', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
}, '.social-proof-bar');

// ===================================================
// FEATURES SECTION
// ===================================================
revealOnScroll('.features-hero-text', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
}, '#features');

revealOnScroll('.f-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
}, '.features-grid');

// Vessel items stagger
revealOnScroll('.vessel-item', {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.5)'
}, '.vessel-grid');

// ===================================================
// FAMILY CARE SECTION
// ===================================================
revealOnScroll('.fc-text-col > *', {
    x: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
}, '#family-care');

// Scenario lines cascade
revealOnScroll('.scenario-line', {
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out'
}, '.fc-scenario');

// Phone frame slides in
revealOnScroll('.fc-phone-frame', {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
}, '.fc-visual-col');

// Notifications slide in one by one
revealOnScroll('.notif', {
    x: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power3.out'
}, '.phone-screen');

// Elderly image
revealOnScroll('.fc-elderly-img', {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.5)',
    delay: 0.5
}, '.fc-visual-col');

// ===================================================
// DAILY DESK SECTION
// ===================================================
revealOnScroll('.daily-header', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
}, '#daily');

revealOnScroll('.d-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
}, '.daily-cards');

// Goal factors cascade
revealOnScroll('.goal-factor', {
    x: -30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.12,
    ease: 'power3.out'
}, '.goal-calculator');

revealOnScroll('.goal-total', {
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    delay: 0.5,
    ease: 'back.out(1.5)'
}, '.goal-calculator');

// Reminder ring animation
gsap.to('.ring-progress', {
    scrollTrigger: {
        trigger: '.reminder-ring',
        start: 'top 85%',
        toggleActions: 'play none none none',
    },
    strokeDashoffset: 0,
    duration: 2.5,
    ease: 'power2.inOut'
});

// ===================================================
// DASHBOARD / HEATMAP
// ===================================================
function generateHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;
    
    const intensities = [
        0.8, 0.6, 1.0, 0.4, 0.9, 0.7, 0.3,
        1.0, 0.8, 0.5, 1.0, 0.6, 0.9, 0.8,
        0.4, 1.0, 0.7, 0.9, 0.3, 1.0, 0.6,
        0.9, 0.8, 1.0, 0.5, 0.7, 0.2, 0.0
    ];
    
    intensities.forEach((intensity) => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.style.setProperty('--fill-opacity', intensity || 0.1);
        grid.appendChild(cell);
    });

    ScrollTrigger.create({
        trigger: '.heatmap-grid',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            const cells = grid.querySelectorAll('.heatmap-cell');
            cells.forEach((cell, i) => {
                setTimeout(() => {
                    cell.classList.add('filled');
                }, i * 60);
            });
        }
    });
}

generateHeatmap();

revealOnScroll('.dash-text > *', {
    x: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
}, '#dashboard');

revealOnScroll('.dash-img', {
    y: 80,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: 'power3.out'
}, '.dash-visual');

// ===================================================
// VALUE SECTION
// ===================================================
revealOnScroll('.value-header', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
}, '#value');

revealOnScroll('.price-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
}, '.price-compare');

revealOnScroll('.spec-item', {
    y: 30,
    scale: 0.9,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.5)'
}, '.specs-grid');

// ===================================================
// FINAL CTA
// ===================================================
revealOnScroll('#cta-final h2, #cta-final p, #cta-final .btn-primary, #cta-final .cta-note', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
}, '#cta-final');

// ===================================================
// NAVBAR SCROLL EFFECT (auto-hide)
// ===================================================
let lastScrollY = 0;
const navbar = document.getElementById('navbar');
navbar.style.transition = 'transform 0.3s ease';

window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > 300 && currentY > lastScrollY) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = currentY;
}, { passive: true });

// ===================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

}); // END DOMContentLoaded
