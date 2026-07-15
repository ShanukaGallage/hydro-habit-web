/* ===================================================
   HYDRO-HABIT — ANIMATIONS & INTERACTIVITY
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===================================================
    // GENERATE HEATMAP CELLS IMMEDIATELY (always needed)
    // ===================================================
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
            cell.className = 'heatmap-cell';
            cell.style.setProperty('--fill-opacity', intensity || 0.1);
            grid.appendChild(cell);
        });
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
            constructor() { this.reset(); }
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
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
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
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    initHeroCanvas();

    // ===================================================
    // ANIMATED COUNTERS (number count-up on scroll)
    // ===================================================
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();
        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    // ===================================================
    // CSS CLASS-BASED SCROLL REVEAL SYSTEM
    // Elements animate in via CSS when .revealed is added.
    // This is RELIABLE - elements are always visible by default.
    // ===================================================
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.revealDelay || 0;
                setTimeout(() => {
                    el.classList.add('revealed');
                    // Trigger counters
                    el.querySelectorAll('.proof-number[data-target], .counter[data-target]').forEach(animateCounter);
                    if (el.classList.contains('proof-number') && el.dataset.target) {
                        animateCounter(el);
                    }
                }, delay * 1000);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===================================================
    // PROOF NUMBERS: counter animation on scroll
    // ===================================================
    const proofObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.proof-number[data-target], .counter[data-target]').forEach(animateCounter);
                proofObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.social-proof-bar, .streak-stats, .goal-total').forEach(el => {
        proofObserver.observe(el);
    });

    // Individual elements not in containers
    document.querySelectorAll('.proof-number[data-target], .counter[data-target]').forEach(el => {
        if (!el.closest('.social-proof-bar') && !el.closest('.streak-stats') && !el.closest('.goal-total')) {
            proofObserver.observe(el);
        }
    });

    // ===================================================
    // HEATMAP: animate cells on scroll
    // ===================================================
    const heatmapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && grid) {
                const cells = grid.querySelectorAll('.heatmap-cell');
                cells.forEach((cell, i) => {
                    setTimeout(() => cell.classList.add('filled'), i * 50);
                });
                heatmapObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const heatmapSection = document.getElementById('dashboard');
    if (heatmapSection) heatmapObserver.observe(heatmapSection);

    // ===================================================
    // SVG RING ANIMATION: fill ring on scroll
    // ===================================================
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target.querySelector('.ring-progress');
                if (ring) {
                    ring.style.transition = 'stroke-dashoffset 2.5s ease-in-out';
                    ring.style.strokeDashoffset = '0';
                }
                ringObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const dailySection = document.getElementById('daily');
    if (dailySection) ringObserver.observe(dailySection);

    // ===================================================
    // NAVBAR SCROLL EFFECT (auto-hide on scroll down)
    // ===================================================
    let lastScrollY = 0;
    const navbar = document.getElementById('navbar');
    if (navbar) {
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
    }

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
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ===================================================
    // HERO ENTRANCE: staggered fade-in with CSS classes
    // ===================================================
    const heroItems = [
        { selector: '.hero-badge',          delay: 100  },
        { selector: '.hero-headline .line', delay: 300  },
        { selector: '.hero-sub',            delay: 500  },
        { selector: '.hero-cta-row',        delay: 650  },
        { selector: '.hero-product-wrapper',delay: 800  },
        { selector: '.hero-scroll-hint',    delay: 1100 },
        { selector: '#navbar',              delay: 50   },
    ];

    heroItems.forEach(({ selector, delay }) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            setTimeout(() => el.classList.add('revealed'), delay + i * 100);
        });
    });

}); // END DOMContentLoaded
