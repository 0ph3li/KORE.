/**
 * KORE — Luxury Interaction Script (Expanded with Tabs, Metrics & Dynamic HUD)
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
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* --------------------------------------------------------------------------
       2. HOLOLENS LIGHT CONE (Hero Effect)
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

        lightCone.style.transform = `translate(calc(-50% + ${coneX - window.innerWidth/2}px), calc(-50% + ${coneY - window.innerHeight/2}px))`;

        requestAnimationFrame(animateLightCone);
    }
    animateLightCone();


    /* --------------------------------------------------------------------------
       3. INTERACTIVE EDITORIAL TABS HUB
       -------------------------------------------------------------------------- */
    const tabBtns = document.querySelectorAll('.t-btn');
    const tabPanels = document.querySelectorAll('.t-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });


    /* --------------------------------------------------------------------------
       4. INTERACTIVE ARCHITECTURE BLUEPRINT HUD NODES
       -------------------------------------------------------------------------- */
    const interactiveNodes = document.querySelectorAll('.interactive-node');
    const hudTitle = document.getElementById('hud-title');
    const hudDesc = document.getElementById('hud-desc');
    const hudStatusTag = document.getElementById('hud-status-tag');

    const nodeData = {
        'alpha': {
            title: "NODE_A // COGNITIVE KERNEL",
            desc: "Allocating isolated memory shards at 0x7FFA. Direct silicon instruction pipeline initialized without virtualization lag.",
            status: "STATUS: STREAM_STABLE"
        },
        'beta': {
            title: "NODE_B // DISTRIBUTED MESH",
            desc: "Peer-to-peer compute grid routing over 100k synchronous worker streams in parallel across edge clusters.",
            status: "STATUS: SYNC_OPTIMIZED"
        },
        'gamma': {
            title: "NODE_C // ZERO-LATENCY I/O",
            desc: "Hardware-enforced encryption layer operating directly within silicon registers. Zero dropouts detected.",
            status: "STATUS: ENCRYPTED_SECURE"
        }
    };

    interactiveNodes.forEach(node => {
        node.addEventListener('click', () => {
            interactiveNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const key = node.getAttribute('data-node');
            if(nodeData[key]) {
                hudTitle.textContent = nodeData[key].title;
                hudDesc.textContent = nodeData[key].desc;
                hudStatusTag.textContent = nodeData[key].status;
            }
        });
    });


    /* --------------------------------------------------------------------------
       5. HALFTONE DOT MATRIX CANVAS
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('halftone-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });

        const dots = [];
        const spacing = 35;
        const baseRadius = 1;

        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                dots.push({ x, y });
            }
        }

        function drawHalftone() {
            ctx.clearRect(0, 0, width, height);
            
            const rect = canvas.getBoundingClientRect();
            const canvasMouseX = mouseX - rect.left;
            const canvasMouseY = mouseY - rect.top;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';

            dots.forEach(dot => {
                const dx = canvasMouseX - dot.x;
                const dy = canvasMouseY - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                let radius = baseRadius;
                if (distance < 200) {
                    radius = baseRadius + ((200 - distance) / 200) * 2.5;
                }

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(drawHalftone);
        }
        drawHalftone();
    }


    /* --------------------------------------------------------------------------
       6. DYNAMIC LIVE COUNTER (Latency Fluctuation Animation)
       -------------------------------------------------------------------------- */
    const counterLatency = document.getElementById('counter-latency');
    if(counterLatency) {
        setInterval(() => {
            const randomDelta = (Math.random() * 0.02 - 0.01).toFixed(2);
            let val = (0.04 + parseFloat(randomDelta)).toFixed(2);
            counterLatency.textContent = val;
        }, 1500);
    }

});