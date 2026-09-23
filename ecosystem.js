/**
 * KORE — Ecosystem Page Interactive Assembler & Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. SMOOTH REVEAL ON SCROLL
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));


    /* --------------------------------------------------------------------------
       2. HOLOLENS LIGHT CONE
       -------------------------------------------------------------------------- */
    const lightCone = document.getElementById('light-cone');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let coneX = mouseX, coneY = mouseY;

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
       3. SPOTLIGHT HOVER EFFECT ON PACKAGE CARDS
       -------------------------------------------------------------------------- */
    const spotlightCards = document.querySelectorAll('[data-spotlight]');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });


    /* --------------------------------------------------------------------------
       4. INTERACTIVE MODULE ASSEMBLER (Manifest Generator)
       -------------------------------------------------------------------------- */
    const modCards = document.querySelectorAll('.mod-toggle-card');
    const manifestCode = document.getElementById('manifest-code');
    const copyManifestBtn = document.getElementById('copy-manifest-btn');

    let activeModules = ['@kore/core', '@kore/mesh'];

    modCards.forEach(card => {
        card.addEventListener('click', () => {
            const modName = card.getAttribute('data-mod');
            const pkgString = `@kore/${modName}`;
            
            card.classList.toggle('active');
            const checkLabel = card.querySelector('.mod-check');

            if(card.classList.contains('active')) {
                checkLabel.textContent = "ACTIVE";
                if(!activeModules.includes(pkgString)) activeModules.push(pkgString);
            } else {
                checkLabel.textContent = "OFF";
                activeModules = activeModules.filter(m => m !== pkgString);
            }

            // Generazione pulita del codice indentato
            const formattedModules = activeModules.map(m => `    "${m}"`).join(',\n');
            manifestCode.textContent = `{
  "version": "2.6.0",
  "engine": "kore-silicon",
  "modules": [
${formattedModules}
  ],
  "optimization": "maximum-determinism"
}`;
        });
    });

    // Copia config negli appunti
    if(copyManifestBtn && manifestCode) {
        copyManifestBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(manifestCode.textContent);
            copyManifestBtn.textContent = "COPIED!";
            setTimeout(() => {
                copyManifestBtn.textContent = "COPY CONFIG";
            }, 2000);
        });
    }


    /* --------------------------------------------------------------------------
       5. LIVE PACKAGE SEARCH / FILTER
       -------------------------------------------------------------------------- */
    const pkgSearchInput = document.getElementById('pkg-search-input');
    const pkgCards = document.querySelectorAll('#packages-grid .pkg-card');
    const pkgSearchCount = document.getElementById('pkg-search-count');
    const pkgEmptyState = document.getElementById('pkg-empty-state');

    if(pkgSearchInput) {
        pkgSearchInput.addEventListener('input', () => {
            const query = pkgSearchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            pkgCards.forEach(card => {
                const haystack = `${card.getAttribute('data-name')} ${card.getAttribute('data-desc')}`.toLowerCase();
                const matches = haystack.includes(query);
                card.classList.toggle('pkg-hidden', !matches);
                if(matches) visibleCount++;
            });

            if(pkgSearchCount) pkgSearchCount.textContent = `${visibleCount} PACKAGE${visibleCount === 1 ? '' : 'S'}`;
            if(pkgEmptyState) pkgEmptyState.classList.toggle('visible', visibleCount === 0);
        });
    }


    /* --------------------------------------------------------------------------
       6. PER-PACKAGE INSTALL COMMAND COPY
       -------------------------------------------------------------------------- */
    document.querySelectorAll('.pkg-copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const command = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(command);
            const original = btn.textContent;
            btn.textContent = 'COPIED';
            setTimeout(() => { btn.textContent = original; }, 1600);
        });
    });

});