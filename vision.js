/**
 * KORE — Vision Page Three.js 3D Engine & Animations
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
       3. SPOTLIGHT HOVER EFFECT ON CARDS
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
       4. THREE.JS 3D INTERACTIVE ENGINE
       -------------------------------------------------------------------------- */
    const container = document.getElementById('canvas-3d-wrapper');
    const canvas = document.getElementById('kore-3d-canvas');

    if(container && canvas) {
        // Scena, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Ridimensionamento finestra
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        // Materiale Wireframe di Lusso (Bianco cibernetico)
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });

        // Geometrie 3D
        const geometries = {
            torus: new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32),
            sphere: new THREE.SphereGeometry(1.5, 32, 32),
            icosahedron: new THREE.IcosahedronGeometry(1.6, 2)
        };

        let currentMesh = new THREE.Mesh(geometries.torus, material);
        scene.add(currentMesh);

        // Controllo interattivo pulsanti Morphing 3D
        const geoBtns = document.querySelectorAll('.v-btn');
        geoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                geoBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const geoKey = btn.getAttribute('data-geo');
                if(geometries[geoKey]) {
                    scene.remove(currentMesh);
                    currentMesh.geometry.dispose();
                    currentMesh = new THREE.Mesh(geometries[geoKey], material);
                    scene.add(currentMesh);
                }
            });
        });

        // Interazione mouse rotazione 3D fluida
        let targetRotationX = 0;
        let targetRotationY = 0;
        let mouseXNorm = 0, mouseYNorm = 0;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseXNorm = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
            mouseYNorm = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
        });

        // Controllo velocità di rotazione tramite slider
        let speedMultiplier = 1;
        const speedSlider = document.getElementById('rotation-speed-slider');
        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                speedMultiplier = parseFloat(speedSlider.value);
            });
        }

        // Controllo colore wireframe tramite swatch
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                colorSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                material.color.set(swatch.getAttribute('data-color'));
            });
        });

        // Loop di animazione 3D
        let clock = new THREE.Clock();
        function animate3D() {
            requestAnimationFrame(animate3D);

            const elapsedTime = clock.getElapsedTime();

            // Rotazione continua + inerzia del mouse, scalata dallo slider di velocità
            currentMesh.rotation.x += 0.003 * speedMultiplier + (mouseYNorm * 0.05 - currentMesh.rotation.x) * 0.05;
            currentMesh.rotation.y += 0.005 * speedMultiplier + (mouseXNorm * 0.05 - currentMesh.rotation.y) * 0.05;

            // Leggero effetto fluttuante verticale
            currentMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.1;

            renderer.render(scene, camera);
        }
        animate3D();
    }

});