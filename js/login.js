/* ============================================
   LOGIN PAGE — JavaScript
   Bharat Resilience Engine
   ============================================ */

(function () {
  'use strict';

  // ── Page Transition ──
  const overlay = document.getElementById('pageTransition');
  if (overlay) {
    window.addEventListener('load', () => {
      setTimeout(() => overlay.classList.add('hidden'), 500);
      setTimeout(() => { overlay.style.display = 'none'; }, 1100);
    });
  }

  // ── Password Toggle ──
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  }

  // ── Login Form Submit ──
  const form = document.getElementById('loginForm');
  const authorizeBtn = document.getElementById('authorizeBtn');

  if (form && authorizeBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Loading state
      authorizeBtn.classList.add('loading');
      authorizeBtn.disabled = true;

      // Simulate authentication
      setTimeout(() => {
        showAuthSuccess();
      }, 2200);
    });
  }

  // ── Demo Mode ──
  const demoBtn = document.getElementById('demoBtn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      localStorage.setItem('bharatReAuth', 'true');
      navigateWithTransition('dashboard.html');
    });
  }

  // ── Auth Success Overlay ──
  function showAuthSuccess() {
    localStorage.setItem('bharatReAuth', 'true');
    
    // Create success overlay
    const successOverlay = document.createElement('div');
    successOverlay.className = 'auth-success-overlay';
    successOverlay.innerHTML = `
      <div class="auth-success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <span class="auth-success-text">Access Granted</span>
      <span class="auth-success-sub">Redirecting to Command Center…</span>
    `;
    document.body.appendChild(successOverlay);

    // Show immediately
    requestAnimationFrame(() => {
      successOverlay.classList.add('visible');
    });

    // Navigate to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 2000);
  }

  // ── Page Transition Navigation ──
  function navigateWithTransition(url) {
    const overlay = document.getElementById('pageTransition');
    if (overlay) {
      overlay.querySelector('.transition-text').textContent = 'Redirecting…';
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      setTimeout(() => { window.location.href = url; }, 600);
    } else {
      window.location.href = url;
    }
  }

  // ── Map Canvas — India Network Visualization ──
  const canvas = document.getElementById('mapCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, nodes = [];

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    // India shape check (same as landing)
    function isInsideIndia(x, y, w, h) {
      const nx = x / w;
      const ny = y / h;
      const points = [
        [0.42, 0.08], [0.55, 0.08], [0.62, 0.15], [0.68, 0.22],
        [0.72, 0.30], [0.70, 0.38], [0.74, 0.42], [0.78, 0.48],
        [0.75, 0.55], [0.70, 0.58], [0.68, 0.65], [0.62, 0.72],
        [0.58, 0.78], [0.52, 0.88], [0.50, 0.95], [0.48, 0.88],
        [0.42, 0.78], [0.38, 0.72], [0.34, 0.65], [0.30, 0.58],
        [0.28, 0.52], [0.22, 0.48], [0.20, 0.42], [0.24, 0.35],
        [0.28, 0.28], [0.32, 0.22], [0.36, 0.15], [0.42, 0.08]
      ];
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i][0], yi = points[i][1];
        const xj = points[j][0], yj = points[j][1];
        if (((yi > ny) !== (yj > ny)) && (nx < (xj - xi) * (ny - yi) / (yj - yi) + xi)) {
          inside = !inside;
        }
      }
      return inside;
    }

    // City-like major nodes
    const cityPositions = [
      { name: 'Delhi', nx: 0.48, ny: 0.24 },
      { name: 'Mumbai', nx: 0.32, ny: 0.55 },
      { name: 'Bangalore', nx: 0.42, ny: 0.72 },
      { name: 'Chennai', nx: 0.55, ny: 0.70 },
      { name: 'Kolkata', nx: 0.65, ny: 0.40 },
      { name: 'Hyderabad', nx: 0.46, ny: 0.60 },
      { name: 'Ahmedabad', nx: 0.30, ny: 0.40 },
      { name: 'Pune', nx: 0.35, ny: 0.58 },
      { name: 'Jaipur', nx: 0.40, ny: 0.30 },
      { name: 'Lucknow', nx: 0.54, ny: 0.28 },
      { name: 'Bhopal', nx: 0.48, ny: 0.40 },
      { name: 'Kochi', nx: 0.38, ny: 0.80 },
    ];

    function initNodes() {
      nodes = [];
      const mapW = width * 0.85;
      const mapH = height * 0.75;
      const offsetX = (width - mapW) / 2;
      const offsetY = (height - mapH) / 2 + height * 0.05;

      // City nodes (larger, labeled)
      cityPositions.forEach(city => {
        nodes.push({
          x: city.nx * mapW + offsetX,
          y: city.ny * mapH + offsetY,
          baseX: city.nx * mapW + offsetX,
          baseY: city.ny * mapH + offsetY,
          radius: 2.5,
          opacity: 0.8,
          pulse: Math.random() * Math.PI * 2,
          isCity: true,
          name: city.name,
        });
      });

      // Scattered network nodes
      let attempts = 0;
      const count = Math.min(Math.floor(width * height / 6000), 60);
      while (nodes.length < count + cityPositions.length && attempts < count * 25) {
        attempts++;
        const rx = Math.random() * mapW;
        const ry = Math.random() * mapH;
        if (isInsideIndia(rx, ry, mapW, mapH)) {
          nodes.push({
            x: rx + offsetX,
            y: ry + offsetY,
            baseX: rx + offsetX,
            baseY: ry + offsetY,
            radius: 0.8 + Math.random() * 1.2,
            opacity: 0.2 + Math.random() * 0.4,
            pulse: Math.random() * Math.PI * 2,
            isCity: false,
          });
        }
      }
    }

    // Animated data packets flowing along edges
    let packets = [];
    function spawnPacket() {
      if (nodes.length < 2) return;
      const from = nodes[Math.floor(Math.random() * nodes.length)];
      const to = nodes[Math.floor(Math.random() * nodes.length)];
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160 && dist > 30) {
        packets.push({
          fromX: from.x, fromY: from.y,
          toX: to.x, toY: to.y,
          progress: 0,
          speed: 0.008 + Math.random() * 0.012,
        });
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      // Update pulses
      nodes.forEach(n => { n.pulse += 0.015; });

      // Draw edges
      const maxDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 153, 51, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw packets
      packets.forEach(p => {
        p.progress += p.speed;
        const x = p.fromX + (p.toX - p.fromX) * p.progress;
        const y = p.fromY + (p.toY - p.fromY) * p.progress;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29, 185, 84, ${0.8 * (1 - p.progress)})`;
        ctx.fill();
        // Trail
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29, 185, 84, ${0.15 * (1 - p.progress)})`;
        ctx.fill();
      });
      packets = packets.filter(p => p.progress < 1);

      // Spawn new packets
      if (Math.random() < 0.05) spawnPacket();

      // Draw nodes
      nodes.forEach(n => {
        const glow = 0.5 + Math.sin(n.pulse) * 0.3;

        if (n.isCity) {
          // Outer ring
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 153, 51, ${0.15 * glow})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Glow
          ctx.beginPath();
          ctx.arc(n.x, n.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 153, 51, ${0.03 * glow})`;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.isCity
          ? `rgba(255, 153, 51, ${n.opacity * glow})`
          : `rgba(255, 153, 51, ${n.opacity * glow * 0.6})`;
        ctx.fill();
      });

      // Faint India outline
      drawOutline(ctx, width, height, time);

      requestAnimationFrame(draw);
    }

    function drawOutline(ctx, w, h, time) {
      const mapW = w * 0.85;
      const mapH = h * 0.75;
      const offsetX = (w - mapW) / 2;
      const offsetY = (h - mapH) / 2 + h * 0.05;
      const points = [
        [0.42, 0.08], [0.48, 0.06], [0.55, 0.08], [0.60, 0.12],
        [0.62, 0.15], [0.65, 0.18], [0.68, 0.22], [0.70, 0.26],
        [0.72, 0.30], [0.71, 0.34], [0.70, 0.38], [0.72, 0.40],
        [0.74, 0.42], [0.77, 0.45], [0.78, 0.48], [0.76, 0.52],
        [0.75, 0.55], [0.72, 0.57], [0.70, 0.58], [0.69, 0.61],
        [0.68, 0.65], [0.65, 0.68], [0.62, 0.72], [0.60, 0.75],
        [0.58, 0.78], [0.55, 0.83], [0.52, 0.88], [0.51, 0.92],
        [0.50, 0.95], [0.49, 0.92], [0.48, 0.88], [0.45, 0.83],
        [0.42, 0.78], [0.40, 0.75], [0.38, 0.72], [0.36, 0.68],
        [0.34, 0.65], [0.32, 0.61], [0.30, 0.58], [0.29, 0.55],
        [0.28, 0.52], [0.25, 0.50], [0.22, 0.48], [0.21, 0.45],
        [0.20, 0.42], [0.22, 0.38], [0.24, 0.35], [0.26, 0.31],
        [0.28, 0.28], [0.30, 0.25], [0.32, 0.22], [0.34, 0.18],
        [0.36, 0.15], [0.38, 0.12], [0.40, 0.10], [0.42, 0.08]
      ];

      ctx.beginPath();
      points.forEach((p, i) => {
        const x = p[0] * mapW + offsetX;
        const y = p[1] * mapH + offsetY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      const pulse = 0.03 + Math.sin(time * 0.001) * 0.015;
      ctx.strokeStyle = `rgba(255, 153, 51, ${pulse})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    window.addEventListener('resize', () => { resize(); initNodes(); });
    resize();
    initNodes();
    requestAnimationFrame(draw);
  }

  // ── Coordinate Flicker Effect ──
  const latEl = document.getElementById('latCoord');
  const longEl = document.getElementById('longCoord');
  if (latEl && longEl) {
    setInterval(() => {
      const latBase = 20.5937;
      const longBase = 78.9629;
      const jitter = () => (Math.random() - 0.5) * 0.002;
      latEl.textContent = (latBase + jitter()).toFixed(4) + '° N';
      longEl.textContent = (longBase + jitter()).toFixed(4) + '° E';
    }, 3000);
  }

})();
