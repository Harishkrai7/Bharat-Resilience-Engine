/* ============================================
   DASHBOARD PAGE — Bharat Resilience Engine
   ============================================ */

(function () {
  'use strict';

  // ── Backend API Configuration ──
  // Default to a placeholder, but check localStorage so the user can update it via console
  // Example: localStorage.setItem('backend_url', 'https://your-backend.pythonanywhere.com')
  const DEFAULT_URL = "http://10.3.52.187:5001"; 
  const BASE_URL = localStorage.getItem('backend_url') || DEFAULT_URL;

  // ── Call Flask backend ──
  async function callBackend(scenario, severity) {
      try {
          const res = await fetch(`${BASE_URL}/api/${scenario}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  severity: parseInt(severity),
                  total_nodes: 200
              })
          });
          const data = await res.json();
          console.log("Backend response:", data);
          return data;
      } catch (err) {
          console.error("Backend error:", err);
          return null;
      }
  }

  // ── Update Dashboard Elements ──
  window.updateDashboard = function(data) {
      if (!data) return;

      // Update recommendation text in our advanced UI card
      const recTitle = document.querySelector('.rec-title');
      const recDesc = document.querySelector('.rec-desc');
      if (recTitle && recDesc && data.recommendation) {
          recTitle.innerText = "System Recommendation";
          recDesc.innerText = data.recommendation;
      }

      // Update nodes on our Map Canvas based on affected_states
      if (data.affected_states && window.nodes) {
          window.nodes.forEach(n => {
              // Fuzzy map the backend states to our map nodes
              let isHit = data.affected_states.some(st => 
                 n.label.toLowerCase().includes(st.toLowerCase()) || 
                 n.id.toLowerCase().includes(st.toLowerCase()) ||
                 (st.includes("Maharashtra") && n.id === "mumbai") ||
                 (st.includes("Karnataka") && n.id === "bengaluru") ||
                 (st.includes("Bengal") && n.id === "kolkata") ||
                 (st.includes("Tamil") && n.id === "chennai") ||
                 (st.includes("Telangana") && n.id === "hyderabad") ||
                 (st.includes("Pradesh") && n.id === "delhi")
              );
              if (isHit) {
                  n.state = data.severity > 50 ? 'critical' : 'warning';
                  n.status = data.scenario === 'cyber_attack' ? 'COMPROMISED' : 'DEFICIT ALERT';
              } else {
                  n.state = 'stable';
                  n.status = 'OPERATIONAL';
              }
          });
      }
  };

  // ── Main trigger ──
  window.onUserInput = async function() {
      // Find the currently active module
      const activeMod = document.querySelector('.module-card.active');
      if (!activeMod) return;

      // Map module ID to API scenario name
      const modMap = {
          'modPower': 'power',
          'modWater': 'water',
          'modFuel': 'fuel',
          'modCyber': 'cyber'
      };
      const scenario = modMap[activeMod.id] || 'power';

      // Get severity from the active module's slider
      const slider = activeMod.querySelector('input[type="range"]');
      const severity = slider ? slider.value : 0;

      // Show loading
      const recDesc = document.querySelector('.rec-desc');
      if (recDesc) recDesc.innerText = "Calculating best allocation via Flask...";

      const data = await callBackend(scenario, severity);
      window.updateDashboard(data);
  };

  // ── Auth Route Protection ──
  if (localStorage.getItem('bharatReAuth') !== 'true') {
    window.location.replace('index.html');
    return;
  }

  // ── Page Transition ──
  const overlay = document.getElementById('pageTransition');
  if (overlay) {
    window.addEventListener('load', () => {
      setTimeout(() => overlay.classList.add('hidden'), 500);
      setTimeout(() => { overlay.style.display = 'none'; }, 1100);
    });
  }

  // ── Crisis Module Interactions ──
  window.toggleModule = function(modId) {
    const card = document.getElementById(modId);
    if (!card) return;
    const isExpanded = card.classList.contains('expanded');
    card.classList.toggle('expanded', !isExpanded);
    card.classList.toggle('active', !isExpanded);
    const statusEl = card.querySelector('.module-status');
    if (!card.classList.contains('active')) {
      statusEl.textContent = 'STANDBY';
      statusEl.className = 'module-status status-standby';
    } else {
      statusEl.textContent = 'ACTIVE SIMULATION';
      statusEl.className = 'module-status status-active';
      // Trigger API call when switching to a new module
      if (window.onUserInput) window.onUserInput();
    }
  };

  // Slider value updates
  document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const valEl = e.target.parentElement.querySelector('.control-val');
      if (valEl) valEl.textContent = e.target.value + '%';
    });
    // Trigger API call on slider change
    slider.addEventListener('change', () => {
       if (window.onUserInput) window.onUserInput();
    });
  });

  // Duration buttons
  document.querySelectorAll('.duration-selector .dur-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.parentElement.querySelectorAll('.dur-btn').forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Mode buttons
  document.querySelectorAll('.mode-toggle .mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.parentElement.querySelectorAll('.mode-btn').forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // ── Run Simulation Button ──
  const runBtn = document.getElementById('runSimBtn');
  const simLoading = document.getElementById('simLoading');
  if (runBtn && simLoading) {
    runBtn.addEventListener('click', () => {
      simLoading.classList.remove('hidden');
      setTimeout(() => simLoading.classList.add('hidden'), 2200);
      if (window.onUserInput) window.onUserInput();
    });
  }

  // ── AI Execute Button ──
  const execBtn = document.getElementById('execActionBtn');
  if (execBtn) {
    execBtn.addEventListener('click', () => {
      execBtn.textContent = 'EXECUTING…';
      execBtn.style.opacity = '0.7';
      setTimeout(() => {
        execBtn.textContent = '✓  ACTION SUCCESSFUL';
        execBtn.style.background = 'var(--green-bright)';
        execBtn.style.color = '#fff';
        execBtn.style.boxShadow = '0 0 18px rgba(29,185,84,0.5)';
        execBtn.style.opacity = '1';
        setTimeout(() => {
          execBtn.textContent = 'EXECUTE REROUTE';
          execBtn.removeAttribute('style');
        }, 3000);
      }, 1500);
    });
  }

  // ══════════════════════════
  //  DASHBOARD MAP CANVAS
  // ══════════════════════════
  const canvas = document.getElementById('dashboardMap');
  const tooltip = document.getElementById('mapTooltip');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  // City nodes (made globally available for the API updater)
  window.nodes = [
    { id: 'delhi',     label: 'NCR (DELHI)',  x: 0.48, y: 0.26, state: 'critical', status: 'VOLTAGE CRIT', demand: '48.2 GW', supply: '41.0 GW' },
    { id: 'mumbai',    label: 'MUMBAI HUB',   x: 0.35, y: 0.55, state: 'stable',   status: 'OPERATIONAL',  demand: '32.4 GW', supply: '33.1 GW' },
    { id: 'bengaluru', label: 'BENGALURU',    x: 0.45, y: 0.75, state: 'warning',  status: 'PEAK LOAD',    demand: '22.8 GW', supply: '20.5 GW' },
    { id: 'kolkata',   label: 'KOLKATA LINK', x: 0.70, y: 0.44, state: 'stable',   status: 'OPERATIONAL',  demand: '21.3 GW', supply: '22.1 GW' },
    { id: 'chennai',   label: 'CHENNAI GRID', x: 0.54, y: 0.78, state: 'stable',   status: 'OPERATIONAL',  demand: '18.6 GW', supply: '19.2 GW' },
    { id: 'hyderabad', label: 'HYDERABAD',    x: 0.52, y: 0.60, state: 'stable',   status: 'OPERATIONAL',  demand: '19.2 GW', supply: '19.8 GW' },
  ];
  const nodes = window.nodes;

  // Edges
  const edges = [
    ['delhi', 'mumbai'],
    ['delhi', 'kolkata'],
    ['mumbai', 'hyderabad'],
    ['hyderabad', 'bengaluru'],
    ['hyderabad', 'chennai'],
    ['bengaluru', 'chennai'],
    ['kolkata', 'hyderabad'],
  ];

  function getColor(state) {
    if (state === 'critical') return '#FF9933';
    if (state === 'warning')  return '#f59e0b';
    return '#1db954';
  }

  function nodePos(n) {
    return [n.x * W, n.y * H];
  }

  function findNode(id) {
    return nodes.find(n => n.id === id);
  }

  // Moving packets along edges
  const packets = [];
  function maybeSpawn() {
    if (Math.random() > 0.025) return;
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const src = findNode(edge[0]);
    const dst = findNode(edge[1]);
    packets.push({ src, dst, t: 0, speed: 0.004 + Math.random() * 0.004, color: getColor(src.state) });
  }

  // Pulse phases
  nodes.forEach(n => { n.phase = Math.random() * Math.PI * 2; n.hover = false; });

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    // --- Subtle grid intentionally removed to let background image shine ---

    // --- Draw edges (dashed) ---
    edges.forEach(([aId, bId]) => {
      const a = findNode(aId);
      const b = findNode(bId);
      const [ax, ay] = nodePos(a);
      const [bx, by] = nodePos(b);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.setLineDash([5, 8]);
      ctx.strokeStyle = getColor(a.state);
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });

    // --- Draw packets ---
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.speed;
      if (p.t >= 1) { packets.splice(i, 1); continue; }
      const [sx, sy] = nodePos(p.src);
      const [dx, dy] = nodePos(p.dst);
      const px = sx + (dx - sx) * p.t;
      const py = sy + (dy - sy) * p.t;
      const alpha = Math.sin(p.t * Math.PI);
      ctx.save();
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = alpha * 0.12; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.globalAlpha = alpha * 0.9;
      ctx.shadowBlur = 8; ctx.shadowColor = p.color;
      ctx.fillStyle = p.color; ctx.fill();
      ctx.restore();
    }

    // --- Draw nodes ---
    nodes.forEach(n => {
      n.phase += 0.03;
      const glow = 0.5 + Math.sin(n.phase) * 0.5;
      const c = getColor(n.state);
      const [x, y] = nodePos(n);
      const r = n.hover ? 8 : 6;

      // Outer pulse ring
      if (n.state === 'critical' || n.hover) {
        ctx.beginPath();
        ctx.arc(x, y, r + 6 + glow * 5, 0, Math.PI * 2);
        ctx.strokeStyle = c;
        ctx.lineWidth = 1;
        ctx.globalAlpha = glow * 0.38;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Glow halo
      ctx.beginPath();
      ctx.arc(x, y, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.07 + glow * 0.05;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Square node body
      ctx.fillStyle = c;
      ctx.shadowBlur = n.state === 'critical' ? 14 + glow * 6 : 8;
      ctx.shadowColor = c;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.shadowBlur = 0;

      // White border
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - r, y - r, r * 2, r * 2);

      // Label box
      const lx = x + r + 8;
      const ly = y - 12;
      const bW = 86, bH = 24;
      ctx.fillStyle = 'rgba(6,10,18,0.82)';
      ctx.fillRect(lx, ly, bW, bH);
      ctx.strokeStyle = c;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.45;
      ctx.strokeRect(lx, ly, bW, bH);
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#e0e6f0';
      ctx.font = '700 7.5px Orbitron, monospace';
      ctx.fillText(n.label, lx + 5, ly + 10);
      ctx.fillStyle = c;
      ctx.font = '400 6.5px Orbitron, monospace';
      ctx.fillText(n.status, lx + 5, ly + 19);
    });

    maybeSpawn();
    requestAnimationFrame(draw);
  }

  function resize() {
    W = canvas.width  = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  // Tooltip
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let hit = false;
    nodes.forEach(n => {
      const [nx, ny] = nodePos(n);
      n.hover = Math.hypot(nx - mx, ny - my) < 20;
      if (n.hover) {
        hit = true;
        const c = getColor(n.state);
        tooltip.innerHTML = `
          <h4 style="color:#fff;font-family:Orbitron,sans-serif;font-size:0.78rem;margin-bottom:6px;">${n.label}</h4>
          <p style="color:${c};font-family:Orbitron,sans-serif;font-size:0.58rem;letter-spacing:1px;margin-bottom:5px;">● ${n.status}</p>
          <p style="color:#8892a8;font-family:Orbitron,sans-serif;font-size:0.56rem;margin-bottom:2px;">DEMAND: ${n.demand}</p>
          <p style="color:#8892a8;font-family:Orbitron,sans-serif;font-size:0.56rem;">SUPPLY: ${n.supply}</p>
        `;
        tooltip.style.left = (mx + 18) + 'px';
        tooltip.style.top  = (my - 10) + 'px';
        tooltip.classList.remove('hidden');
      }
    });
    if (!hit) tooltip.classList.add('hidden');
    canvas.style.cursor = hit ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', () => {
    tooltip.classList.add('hidden');
    nodes.forEach(n => n.hover = false);
  });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);

  // Initial trigger after short delay
  setTimeout(() => { if (window.onUserInput) window.onUserInput(); }, 500);

})();

// ═════════════════════════════════
//  GALAXY BACKGROUND (WebGL)
// ═════════════════════════════════
(function() {
  const galaxyCanvas = document.getElementById('galaxyCanvas');
  if (!galaxyCanvas) return;
  try {
    const gl = galaxyCanvas.getContext('webgl', { alpha: true });
    if (!gl) return;

    const vsSrc = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSrc);
    gl.compileShader(vs);

    const fsSrc = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
float tris(float x) { float t = fract(x); return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0)); }
float trisn(float x) { float t = fract(x); return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0; }

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
    `;
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSrc);
    gl.compileShader(fs);

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const verts = new Float32Array([
      -1,-1, 0,0,
       1,-1, 1,0,
      -1, 1, 0,1,
      -1, 1, 0,1,
       1,-1, 1,0,
       1, 1, 1,1
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'position');
    const uvLoc = gl.getAttribLocation(prog, 'uv');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

    const locs = {
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uResolution: gl.getUniformLocation(prog, 'uResolution'),
      uFocal: gl.getUniformLocation(prog, 'uFocal'),
      uRotation: gl.getUniformLocation(prog, 'uRotation'),
      uStarSpeed: gl.getUniformLocation(prog, 'uStarSpeed'),
      uDensity: gl.getUniformLocation(prog, 'uDensity'),
      uHueShift: gl.getUniformLocation(prog, 'uHueShift'),
      uSpeed: gl.getUniformLocation(prog, 'uSpeed'),
      uMouse: gl.getUniformLocation(prog, 'uMouse'),
      uGlowIntensity: gl.getUniformLocation(prog, 'uGlowIntensity'),
      uSaturation: gl.getUniformLocation(prog, 'uSaturation'),
      uMouseRepulsion: gl.getUniformLocation(prog, 'uMouseRepulsion'),
      uTwinkleIntensity: gl.getUniformLocation(prog, 'uTwinkleIntensity'),
      uRotationSpeed: gl.getUniformLocation(prog, 'uRotationSpeed'),
      uRepulsionStrength: gl.getUniformLocation(prog, 'uRepulsionStrength'),
      uMouseActiveFactor: gl.getUniformLocation(prog, 'uMouseActiveFactor'),
      uAutoCenterRepulsion: gl.getUniformLocation(prog, 'uAutoCenterRepulsion'),
      uTransparent: gl.getUniformLocation(prog, 'uTransparent'),
    };

    // Prop settings mapped from the original React example
    gl.uniform2f(locs.uFocal, 0.5, 0.5);
    gl.uniform2f(locs.uRotation, 1.0, 0.0);
    gl.uniform1f(locs.uDensity, 2.2);
    gl.uniform1f(locs.uHueShift, 150.0);
    gl.uniform1f(locs.uSpeed, 1.5);
    gl.uniform1f(locs.uGlowIntensity, 0.9);
    gl.uniform1f(locs.uSaturation, 0.8); 
    gl.uniform1i(locs.uMouseRepulsion, 1);
    gl.uniform1f(locs.uTwinkleIntensity, 0.65);
    gl.uniform1f(locs.uRotationSpeed, 0.15);
    gl.uniform1f(locs.uRepulsionStrength, 2.0);
    gl.uniform1f(locs.uAutoCenterRepulsion, 0.0);
    gl.uniform1i(locs.uTransparent, 1);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let gW, gH;
    let tX = 0.5, tY = 0.5, cX = 0.5, cY = 0.5;
    let tAct = 0, cAct = 0;

    function rs() {
      const p = galaxyCanvas.parentElement;
      gW = galaxyCanvas.width = p.offsetWidth;
      gH = galaxyCanvas.height = p.offsetHeight;
      gl.viewport(0, 0, gW, gH);
      gl.uniform3f(locs.uResolution, gW, gH, gW/gH);
    }
    window.addEventListener('resize', rs);
    rs();

    galaxyCanvas.parentElement.addEventListener('mousemove', e => {
      const r = galaxyCanvas.parentElement.getBoundingClientRect();
      tX = (e.clientX - r.left) / r.width;
      tY = 1.0 - (e.clientY - r.top) / r.height;
      tAct = 1.0;
    });
    galaxyCanvas.parentElement.addEventListener('mouseleave', () => tAct = 0.0);

    function render(time) {
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const t = time * 0.001;
      gl.uniform1f(locs.uTime, t);
      gl.uniform1f(locs.uStarSpeed, (t * 0.5) / 10.0);

      cX += (tX - cX) * 0.05;
      cY += (tY - cY) * 0.05;
      cAct += (tAct - cAct) * 0.05;

      gl.uniform2f(locs.uMouse, cX, cY);
      gl.uniform1f(locs.uMouseActiveFactor, cAct);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

  } catch(e) { console.error('WebGL init error', e); }
})();
