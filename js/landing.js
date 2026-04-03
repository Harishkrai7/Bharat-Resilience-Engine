/* ============================================
   LANDING PAGE — JavaScript
   Bharat Resilience Engine
   ============================================ */

(function () {
  'use strict';

  // ── Page Transition ──
  const overlay = document.getElementById('pageTransition');
  if (overlay) {
    window.addEventListener('load', () => {
      setTimeout(() => overlay.classList.add('hidden'), 600);
      setTimeout(() => overlay.style.display = 'none', 1200);
    });
  }

  // ── Navbar Scroll ──
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 50);
    lastScroll = y;
  });

  // ── Mobile Menu ──
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── Counter Animation ──
  function animateCounters() {
    const stats = document.querySelectorAll('.hero-stat-value[data-count]');
    stats.forEach(el => {
      if (el.dataset.animated) return;
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      el.dataset.animated = 'true';

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // ── Intersection Observer for Sections ──
  function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.feature-card, .step-card, .why-card').forEach((el, i) => {
      el.style.transitionDelay = `${i % 4 * 120}ms`;
      observer.observe(el);
    });
  }

  // ── Hero Stats Observer ──
  const statsEl = document.getElementById('heroStats');
  if (statsEl) {
    const statsObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObs.disconnect();
      }
    }, { threshold: 0.5 });
    statsObs.observe(statsEl);
  }

  // ── Hero Canvas — Network Map ──
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, nodes, mouseX = -1000, mouseY = -1000;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    // India-shaped distribution of nodes (approximate polygon bounds)
    function isInsideIndia(x, y, w, h) {
      // Normalise coords to 0-1 range
      const nx = x / w;
      const ny = y / h;
      // Approximate India shape polygon
      // Top-center (Kashmir), expands right, narrows to southern tip
      const points = [
        [0.42, 0.08], [0.55, 0.08], [0.62, 0.15], [0.68, 0.22],
        [0.72, 0.30], [0.70, 0.38], [0.74, 0.42], [0.78, 0.48],
        [0.75, 0.55], [0.70, 0.58], [0.68, 0.65], [0.62, 0.72],
        [0.58, 0.78], [0.52, 0.88], [0.50, 0.95], [0.48, 0.88],
        [0.42, 0.78], [0.38, 0.72], [0.34, 0.65], [0.30, 0.58],
        [0.28, 0.52], [0.22, 0.48], [0.20, 0.42], [0.24, 0.35],
        [0.28, 0.28], [0.32, 0.22], [0.36, 0.15], [0.42, 0.08]
      ];
      // Ray-casting algorithm
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i][0], yi = points[i][1];
        const xj = points[j][0], yj = points[j][1];
        const intersect = ((yi > ny) !== (yj > ny)) &&
          (nx < (xj - xi) * (ny - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }

    function initNodes() {
      nodes = [];
      const count = Math.min(Math.floor(width * height / 4000), 120);

      // Center the India shape
      const mapW = width * 0.6;
      const mapH = height * 0.85;
      const offsetX = (width - mapW) / 2;
      const offsetY = (height - mapH) / 2;

      let attempts = 0;
      while (nodes.length < count && attempts < count * 20) {
        attempts++;
        const rx = Math.random() * mapW;
        const ry = Math.random() * mapH;
        if (isInsideIndia(rx, ry, mapW, mapH)) {
          nodes.push({
            x: rx + offsetX,
            y: ry + offsetY,
            baseX: rx + offsetX,
            baseY: ry + offsetY,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            radius: 1.2 + Math.random() * 1.5,
            opacity: 0.3 + Math.random() * 0.5,
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }

      // Add a few outside-India scattered nodes for atmosphere
      for (let i = 0; i < 15; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          radius: 0.8 + Math.random(),
          opacity: 0.1 + Math.random() * 0.2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      // Update nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;

        // Soft return to base
        n.x += (n.baseX - n.x) * 0.002;
        n.y += (n.baseY - n.y) * 0.002;

        // Mouse repulsion
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.8;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }

        n.pulse += 0.02;
      });

      // Draw edges
      const maxDist = 130;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 153, 51, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const glow = 0.5 + Math.sin(n.pulse) * 0.3;
        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 153, 51, ${0.02 * glow})`;
        ctx.fill();
        // Inner dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 153, 51, ${n.opacity * glow})`;
        ctx.fill();
      });

      // Draw faint India outline
      drawIndiaOutline(ctx, width, height, time);

      requestAnimationFrame(draw);
    }

    function drawIndiaOutline(ctx, w, h, time) {
      const mapW = w * 0.6;
      const mapH = h * 0.85;
      const offsetX = (w - mapW) / 2;
      const offsetY = (h - mapH) / 2;
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

      const pulse = 0.015 + Math.sin(time * 0.001) * 0.008;
      ctx.strokeStyle = `rgba(255, 153, 51, ${pulse})`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    window.addEventListener('resize', () => {
      resize();
      initNodes();
    });

    resize();
    initNodes();
    requestAnimationFrame(draw);
  }

  // ── Feature Bar Width Animation ──
  // Bars start at width 0, set to actual width only when visible
  document.querySelectorAll('.feature-card').forEach(card => {
    const bar = card.querySelector('.feature-bar-fill');
    if (bar) {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      const observer = new MutationObserver(() => {
        if (card.classList.contains('visible')) {
          setTimeout(() => { bar.style.width = targetWidth; }, 300);
          observer.disconnect();
        }
      });
      observer.observe(card, { attributes: true, attributeFilter: ['class'] });
    }
  });

  // ── Smooth Link Navigation ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Page Navigation with transition ──
  function navigateWithTransition(url) {
    const overlay = document.getElementById('pageTransition');
    if (overlay) {
      overlay.querySelector('.transition-text').textContent = 'Redirecting…';
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      setTimeout(() => { window.location.href = url; }, 700);
    } else {
      window.location.href = url;
    }
  }

  // Attach to external links
  document.querySelectorAll('a[href="login.html"], a[href="dashboard.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateWithTransition(link.getAttribute('href'));
    });
  });

  // ── Init ──
  setupScrollAnimations();

})();
