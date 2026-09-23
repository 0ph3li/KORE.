/**
 * KORE — Philosophy Page Advanced Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. SMOOTH REVEAL ON SCROLL
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* --------------------------------------------------------------------------
       2. HOLOLENS LIGHT CONE (Hero & Mouse Tracking)
       -------------------------------------------------------------------------- */
    const lightCone = document.getElementById('light-cone');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let coneX = mouseX;
    let coneY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateLightCone() {
        coneX += (mouseX - coneX) * 0.05;
        coneY += (mouseY - coneY) * 0.05;

        if(lightCone) {
            lightCone.style.transform = `translate(calc(-50% + ${coneX - window.innerWidth/2}px), calc(-50% + ${coneY - window.innerHeight/2}px))`;
        }

        requestAnimationFrame(animateLightCone);
    }
    animateLightCone();


    /* --------------------------------------------------------------------------
       3. SPOTLIGHT EFFECT ON PILLARS CARDS
       -------------------------------------------------------------------------- */
    const spotlightCards = document.querySelectorAll('[data-spotlight]');
    
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* --------------------------------------------------------------------------
       4. INTERACTIVE ENTROPY LAB SANDBOX SIMULATOR
       -------------------------------------------------------------------------- */
    const injectChaosBtn = document.getElementById('inject-chaos-btn');
    const purgeChaosBtn = document.getElementById('purge-chaos-btn');
    const labScreenContent = document.getElementById('lab-screen-content');
    const labStatusText = document.getElementById('lab-status-text');
    const labLed = document.getElementById('lab-led');

    if(injectChaosBtn && purgeChaosBtn && labScreenContent) {
        injectChaosBtn.addEventListener('click', () => {
            injectChaosBtn.classList.add('active');
            purgeChaosBtn.classList.remove('active');
            
            labStatusText.textContent = "WARNING: HIGH ENTROPY SPIKE DETECTED";
            labLed.style.background = "#cc1122";
            labLed.style.boxShadow = "0 0 15px #cc1122";
            
            labScreenContent.innerHTML = `<pre style="color: #cc1122;"><code>[ALERT] Memory corruption at 0x9FF8!
[ALERT] Uncaught variance exception in cluster shard 04.
[ALERT] System entropy index: 8.9421 (UNSTABLE)
[CRITICAL] Waiting for determinism override...</code></pre>`;
        });

        purgeChaosBtn.addEventListener('click', () => {
            purgeChaosBtn.classList.add('active');
            injectChaosBtn.classList.remove('active');
            
            labStatusText.textContent = "SYSTEM STATUS: OPTIMAL EQUILIBRIUM";
            labLed.style.background = "#22cc44";
            labLed.style.boxShadow = "0 0 15px #22cc44";
            
            labScreenContent.innerHTML = `<pre style="color: #fff;"><code>[INFO] Purging entropy variance...
[INFO] Re-aligning silicon registers... [SUCCESS]
[INFO] Mathematical determinism enforced.
[INFO] System entropy index: 0.0000 (Stable)</code></pre>`;
        });
    }


    /* --------------------------------------------------------------------------
       5. INTERACTIVE COUNTER-ARGUMENT DEBATE TOGGLE
       -------------------------------------------------------------------------- */
    const debateBtns = document.querySelectorAll('.debate-btn');
    const debatePanes = document.querySelectorAll('.debate-pane');

    debateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            debateBtns.forEach(b => b.classList.remove('active'));
            debatePanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = 'debate-' + btn.getAttribute('data-debate');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

});