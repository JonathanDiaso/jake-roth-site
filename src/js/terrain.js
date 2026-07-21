/* ============================================================
   TERRAIN  ·  the hero's motion background
   Contour ridges of a Front Range silhouette, drifting toward the
   viewer. Depth comes from painter's-algorithm occlusion: each ridge
   fills beneath itself in the base colour, hiding the ridges behind
   it. That single technique is what makes flat lines read as 3D.

   Canvas 2D, no library, ~2KB. Pauses off-screen and under
   prefers-reduced-motion (02_MOTION.md §8).
   ============================================================ */

const LINE_COUNT = 46;      // ridges drawn back-to-front
const POINTS_PER_LINE = 90; // horizontal samples per ridge
const DRIFT_SPEED = 0.018;  // depth units per second — deliberately slow

/* Deterministic value noise. Seeded so the ridge line is the same
   silhouette on every load — this is a place, not a random pattern. */
function makeNoise(seed) {
  const perm = new Float32Array(512);
  let s = seed;
  for (let i = 0; i < 512; i++) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    perm[i] = s / 4294967296;
  }
  const smooth = (t) => t * t * (3 - 2 * t);
  const at = (x, y) => perm[(((x & 255) * 71 + (y & 255) * 193) & 511)];

  return function noise2(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = smooth(x - xi), yf = smooth(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi);
    const c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return (a + (b - a) * xf) + ((c + (d - c) * xf) - (a + (b - a) * xf)) * yf;
  };
}

/* Fractal sum — three octaves is the sweet spot between "rolling hill"
   and "noise". More octaves cost frames and add nothing readable. */
function ridged(noise2, x, z) {
  return noise2(x, z) * 0.6 + noise2(x * 2.3, z * 2.3) * 0.28 + noise2(x * 5.1, z * 5.1) * 0.12;
}

export function initTerrain(canvas, options = {}) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { destroy() {} };

  const noise2 = makeNoise(options.seed ?? 20250721);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let w = 0, h = 0, dpr = 1;
  let depth = 0;
  let raf = 0;
  let last = 0;
  let visible = true;
  let running = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    /* Cap DPR at 2. Rendering 46 stroked paths at 3x on a high-density
       phone is the difference between 60fps and 24fps. */
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    /* The mountain envelope: the range peaks right-of-centre and falls
       away, so the silhouette reads as a range rather than a sine wave —
       and so the left third stays quiet for the hero copy to sit on. */
    const envelope = (t) => {
      const peak = Math.exp(-Math.pow((t - 0.68) * 2.4, 2));
      const shoulder = Math.exp(-Math.pow((t - 0.30) * 3.2, 2)) * 0.5;
      return Math.max(peak, shoulder);
    };

    /* span must keep the NEAREST ridge on-canvas: horizon + span ≤ h. */
    const horizon = h * 0.24;
    const span = h * 0.58;

    /* Painter's algorithm: FARTHEST FIRST. Each nearer ridge fills the
       area beneath itself and hides the ridges behind it. Reversing
       this loop erases the entire range except the top line. */
    for (let i = 0; i < LINE_COUNT; i++) {
      /* d: 0 = farthest ridge, 1 = nearest. Eased spacing puts more
         lines near the horizon, which is how real perspective behaves. */
      const d = i / (LINE_COUNT - 1);
      const baseY = horizon + Math.pow(d, 1.7) * span;
      const amplitude = h * 0.20 * (0.25 + d * 0.95);
      const z = depth + d * 1.9;

      ctx.beginPath();
      let firstY = 0;
      for (let p = 0; p <= POINTS_PER_LINE; p++) {
        const t = p / POINTS_PER_LINE;
        const n = ridged(noise2, t * 3.1 + 12, z) - 0.5;
        const y = baseY - n * amplitude * envelope(t) * 2.4;
        if (p === 0) { firstY = y; ctx.moveTo(0, y); }
        else ctx.lineTo(t * w, y);
      }

      /* Occlusion fill — this is the whole illusion. */
      ctx.save();
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = '#0A090C';
      ctx.globalAlpha = 0.92;
      ctx.fill();
      ctx.restore();

      /* Nearer ridges are brighter and warmer; distant ones dissolve
         into the ground so there is no hard top edge to the artwork.
         Alpha floor stays low — on near-black, a line only needs ~0.1
         to register, and restraint is what keeps this from looking
         like a screensaver. */
      const heat = Math.pow(d, 2.1);
      const alpha = 0.10 + d * 0.58;
      const r = Math.round(150 + heat * 105);
      const g = Math.round(112 - heat * 76);
      const b = Math.round(168 + heat * 6);

      ctx.beginPath();
      ctx.moveTo(0, firstY);
      for (let p = 1; p <= POINTS_PER_LINE; p++) {
        const t = p / POINTS_PER_LINE;
        const n = ridged(noise2, t * 3.1 + 12, z) - 0.5;
        ctx.lineTo(t * w, baseY - n * amplitude * envelope(t) * 2.4);
      }
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = 0.6 + d * 0.9;
      ctx.stroke();
    }
  }

  function frame(now) {
    if (!running) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    depth += dt * DRIFT_SPEED;
    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduced.matches || !visible) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  }, { threshold: 0 });
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  };
  window.addEventListener('resize', onResize);

  const onMotionChange = () => (reduced.matches ? (stop(), draw()) : start());
  reduced.addEventListener('change', onMotionChange);

  resize();
  start();

  return {
    destroy() {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onMotionChange);
    },
  };
}
