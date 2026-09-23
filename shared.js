/**
 * KORE — Shared cross-page utilities
 * Scroll progress bar, custom cursor, magnetic buttons, count-up numbers,
 * 3D tilt cards, generic accordion.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. SCROLL PROGRESS BAR
       -------------------------------------------------------------------------- */
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();


    /* --------------------------------------------------------------------------
       2. CUSTOM CURSOR (dot + trailing ring)
       -------------------------------------------------------------------------- */
    if (window.matchMedia('(hover: hover)').matches) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        let rx = cx, ry = cy;

        window.addEventListener('mousemove', (e) => {
            cx = e.clientX;
            cy = e.clientY;
            dot.style.left = cx + 'px';
            dot.style.top = cy + 'px';
        });

        function animateRing() {
            rx += (cx - rx) * 0.18;
            ry += (cy - ry) * 0.18;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverTargets = 'a, button, [data-tilt], input, .magnetic';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) ring.classList.add('cursor-hover');
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) ring.classList.remove('cursor-hover');
        });
    }


    /* --------------------------------------------------------------------------
       3. MAGNETIC BUTTONS
       -------------------------------------------------------------------------- */
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });


    /* --------------------------------------------------------------------------
       4. 3D TILT CARDS
       -------------------------------------------------------------------------- */
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${py * -8}deg) rotateY(${px * 8}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    /* --------------------------------------------------------------------------
       5. COUNT-UP NUMBERS ON REVEAL
       -------------------------------------------------------------------------- */
    const countEls = document.querySelectorAll('[data-countup]');
    if (countEls.length) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    const target = parseFloat(entry.target.getAttribute('data-countup'));
                    const decimals = parseInt(entry.target.getAttribute('data-decimals') || '0', 10);
                    const suffix = entry.target.getAttribute('data-suffix') || '';
                    const duration = 1800;
                    const start = performance.now();

                    function tick(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 4);
                        const value = target * eased;
                        entry.target.textContent = value.toFixed(decimals) + suffix;
                        if (progress < 1) requestAnimationFrame(tick);
                        else entry.target.textContent = target.toFixed(decimals) + suffix;
                    }
                    requestAnimationFrame(tick);
                }
            });
        }, { threshold: 0.4 });

        countEls.forEach(el => countObserver.observe(el));
    }


    /* --------------------------------------------------------------------------
       6. GENERIC ACCORDION
       -------------------------------------------------------------------------- */
    document.querySelectorAll('.accordion-item').forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const body = item.querySelector('.accordion-body');
        if (!trigger || !body) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            item.parentElement.querySelectorAll('.accordion-item.open').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.accordion-body').style.maxHeight = null;
                }
            });

            if (isOpen) {
                item.classList.remove('open');
                body.style.maxHeight = null;
            } else {
                item.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

});
