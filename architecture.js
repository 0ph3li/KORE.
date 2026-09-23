/**
 * KORE — Architecture Page Advanced Scripts & Canvas Topology
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
       3. INTERACTIVE LAYER EXPLORER
       -------------------------------------------------------------------------- */
    const layerBtns = document.querySelectorAll('.layer-btn');
    const layerPanes = document.querySelectorAll('.layer-pane');

    layerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            layerBtns.forEach(b => b.classList.remove('active'));
            layerPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-layer');
            const targetPane = document.getElementById(targetId);
            if(targetPane) targetPane.classList.add('active');
        });
    });


    /* --------------------------------------------------------------------------
       4. INTERACTIVE TOPOLOGY MESH CANVAS & PACKET SIMULATOR
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('topology-canvas');
    const packetCounter = document.getElementById('packet-counter');

    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });

        // Genera nodi di rete fissi
        const nodes = [];
        for(let i=0; i<18; i++) {
            nodes.push({
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * (height - 100) + 50,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6
            });
        }

        let packetsRouted = 0;
        const activePackets = [];

        // Trascinamento nodi: consente di riorganizzare manualmente la mesh
        let draggedNode = null;
        let dragMoved = false;
        const wrapper = canvas.closest('.topology-wrapper');

        function nodeAt(x, y) {
            let closest = null;
            let minDist = 14;
            nodes.forEach(n => {
                const dist = Math.hypot(n.x - x, n.y - y);
                if (dist < minDist) {
                    minDist = dist;
                    closest = n;
                }
            });
            return closest;
        }

        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const hit = nodeAt(x, y);
            if (hit) {
                draggedNode = hit;
                dragMoved = false;
                draggedNode.vx = 0;
                draggedNode.vy = 0;
                if (wrapper) wrapper.classList.add('dragging-node');
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!draggedNode) return;
            const rect = canvas.getBoundingClientRect();
            draggedNode.x = Math.min(Math.max(e.clientX - rect.left, 10), width - 10);
            draggedNode.y = Math.min(Math.max(e.clientY - rect.top, 10), height - 10);
            dragMoved = true;
        });

        window.addEventListener('mouseup', () => {
            if (draggedNode) {
                draggedNode.vx = (Math.random() - 0.5) * 0.6;
                draggedNode.vy = (Math.random() - 0.5) * 0.6;
            }
            draggedNode = null;
            if (wrapper) wrapper.classList.remove('dragging-node');
        });

        // Genera pacchetti al click sul canvas topologia (solo se non è stato un trascinamento)
        canvas.addEventListener('click', (e) => {
            if (dragMoved) { dragMoved = false; return; }
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Trova il nodo più vicino e invia un pacchetto
            let closest = nodes[0];
            let minDist = Infinity;
            nodes.forEach(n => {
                const dist = Math.hypot(n.x - clickX, n.y - clickY);
                if(dist < minDist) {
                    minDist = dist;
                    closest = n;
                }
            });

            // Crea pacchetti verso altri nodi casuali
            for(let i=0; i<3; i++) {
                const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
                if(targetNode !== closest) {
                    activePackets.push({
                        x: closest.x,
                        y: closest.y,
                        targetX: targetNode.x,
                        targetY: targetNode.y,
                        progress: 0,
                        speed: Math.random() * 0.03 + 0.02
                    });
                }
            }

            packetsRouted += 3;
            if(packetCounter) packetCounter.textContent = `PACKETS ROUTED: ${packetsRouted}`;
        });

        function drawTopology() {
            ctx.clearRect(0, 0, width, height);

            // Muovi e disegna nodi
            nodes.forEach(node => {
                if (node !== draggedNode) {
                    node.x += node.vx;
                    node.y += node.vy;

                    if(node.x < 20 || node.x > width - 20) node.vx *= -1;
                    if(node.y < 20 || node.y > height - 20) node.vy *= -1;
                }

                const isDragged = node === draggedNode;
                ctx.fillStyle = isDragged ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
                if (isDragged) {
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 14;
                }
                ctx.beginPath();
                ctx.arc(node.x, node.y, isDragged ? 6 : 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Disegna linee di connessione tra nodi vicini
            for(let i=0; i<nodes.length; i++) {
                for(let j=i+1; j<nodes.length; j++) {
                    const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                    if(dist < 150) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist/150)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Anima pacchetti di dati in transito
            for(let i = activePackets.length - 1; i >= 0; i--) {
                const p = activePackets[i];
                p.progress += p.speed;

                const currX = p.x + (p.targetX - p.x) * p.progress;
                const currY = p.y + (p.targetY - p.y) * p.progress;

                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(currX, currY, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // reset shadow

                if(p.progress >= 1) {
                    activePackets.splice(i, 1);
                }
            }

            requestAnimationFrame(drawTopology);
        }
        drawTopology();
    }


    /* --------------------------------------------------------------------------
       5. LIVE TELEMETRY FLUCUATION
       -------------------------------------------------------------------------- */
    const telemetryShards = document.getElementById('telemetry-shards');
    if(telemetryShards) {
        setInterval(() => {
            const variance = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            let current = 1024 + variance;
            telemetryShards.textContent = `${current} / 1,024`;
        }, 2000);
    }


    /* --------------------------------------------------------------------------
       6. LIVE SYSTEM LOG TERMINAL (Streaming Kernel Trace Simulator)
       -------------------------------------------------------------------------- */
    const terminalLog = document.getElementById('terminal-log');
    const terminalBody = document.getElementById('terminal-body');
    const termPauseBtn = document.getElementById('term-pause-btn');
    const termClearBtn = document.getElementById('term-clear-btn');

    if(terminalLog) {
        const logTemplates = [
            () => `[${ts()}] Shard ${rndHex(4)} allocated in 0.0${rnd(1,9)}ms`,
            () => `[${ts()}] Mesh sync completed across ${rnd(8,64)} nodes`,
            () => `[${ts()}] Register lock acquired on core ${rnd(0,15)}`,
            () => `[${ts()}] Entropy index stable at 0.000${rnd(0,9)}`,
            () => `[${ts()}] Edge gateway dispatched ${rnd(100,999)} req/s`,
            () => `[${ts()}] Cognitive kernel checkpoint saved`,
            () => `[${ts()}] WGSL compute pass finished in ${rnd(1,4)}.${rnd(0,9)}ms`,
            () => `[${ts()}] Zero GC event detected — heap untouched`,
            () => `[${ts()}] Cluster consensus vector verified [OK]`,
        ];

        function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
        function rndHex(len) {
            let s = '';
            for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 16).toString(16).toUpperCase();
            return '0x' + s;
        }
        function ts() {
            const d = new Date();
            return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
        }

        let paused = false;
        let logInterval = null;

        function appendLine() {
            if (paused) return;
            const line = logTemplates[Math.floor(Math.random() * logTemplates.length)]();
            terminalLog.textContent += line + '\n';
            const lines = terminalLog.textContent.split('\n');
            if (lines.length > 120) terminalLog.textContent = lines.slice(-120).join('\n');
            if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        for (let i = 0; i < 6; i++) appendLine();
        logInterval = setInterval(appendLine, 550);

        if (termPauseBtn) {
            termPauseBtn.addEventListener('click', () => {
                paused = !paused;
                termPauseBtn.textContent = paused ? 'RESUME' : 'PAUSE';
                termPauseBtn.classList.toggle('active', paused);
            });
        }

        if (termClearBtn) {
            termClearBtn.addEventListener('click', () => {
                terminalLog.textContent = '';
            });
        }
    }

});