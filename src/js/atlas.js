/* ============================================================
   THE ATLAS  ·  a real map, not a decoration
   Every area, the peak, downtown and the four installations are drawn
   at their TRUE latitude and longitude. Distances on screen are real
   distances. That honesty is the whole point — a Colorado Springs
   buyer can check it against what they already know, and a PCS buyer
   can see how far a neighbourhood actually sits from their base.

   Deliberately NOT stock photography: captioning a downloaded image
   "Briargate" when it is not Briargate is misrepresentation, and
   neighbourhood imagery is Fair Housing territory (04_COMPLIANCE §3).

   Canvas 2D, no library, no tiles, no network.
   ============================================================ */

import { PLACES, LANDMARKS } from './content.js';

const PAD = 0.055;   // fraction of the frame kept clear at the edges

export function initAtlas(canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {}, setReach() {} };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pts = [...PLACES, ...LANDMARKS];
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const bounds = {
    n: Math.max(...lats), s: Math.min(...lats),
    e: Math.max(...lngs), w: Math.min(...lngs),
  };

  let w = 0, h = 0, dpr = 1, raf = 0;
  let reach = Infinity;          // current max affordable price
  let phase = 0;                 // ambient pulse
  let hovered = null;

  /* Mercator is overkill at this scale — at ~0.5° of latitude the
     distortion is under a pixel. A linear projection with a cosine
     correction on longitude is accurate here and far cheaper. */
  function project(lat, lng) {
    const midLat = (bounds.n + bounds.s) / 2;
    const kx = Math.cos((midLat * Math.PI) / 180);
    const x0 = (bounds.w - 0.02) * kx, x1 = (bounds.e + 0.02) * kx;
    const y0 = bounds.n + 0.02, y1 = bounds.s - 0.02;
    const fx = ((lng * kx) - x0) / (x1 - x0);
    const fy = (y0 - lat) / (y0 - y1);
    return {
      x: (PAD + fx * (1 - PAD * 2)) * w,
      y: (PAD + fy * (1 - PAD * 2)) * h,
    };
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function drawGraticule() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.045)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 7; i++) {
      const x = (i / 7) * w, y = (i / 7) * h;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.restore();
  }

  /* The Front Range runs north-south down the west edge of the city.
     Drawn from the real ridge longitude so the map reads as this place
     and not as a generic scatter plot. */
  function drawRange() {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const lat = bounds.n + 0.04 - (i / 40) * (bounds.n - bounds.s + 0.08);
      const wobble = Math.sin(i * 0.55) * 0.012 + Math.sin(i * 1.7) * 0.005;
      const p = project(lat, -104.98 + wobble);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = 'rgba(177,97,63,0.5)';   // --color-rock
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineTo(0, h); ctx.lineTo(0, 0); ctx.closePath();
    ctx.fillStyle = 'rgba(177,97,63,0.07)';
    ctx.fill();
    ctx.restore();
  }

  function drawLandmarks() {
    ctx.save();
    LANDMARKS.forEach((l) => {
      const p = project(l.lat, l.lng);
      ctx.beginPath();
      if (l.kind === 'peak') {
        ctx.moveTo(p.x, p.y - 7); ctx.lineTo(p.x + 6, p.y + 4);
        ctx.lineTo(p.x - 6, p.y + 4); ctx.closePath();
        ctx.fillStyle = 'rgba(255,158,94,0.85)';
        ctx.fill();
      } else {
        ctx.rect(p.x - 3, p.y - 3, 6, 6);
        ctx.strokeStyle = l.kind === 'base' ? 'rgba(127,212,255,0.7)' : 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.font = '500 10px "Inter Tight", system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.42)';
      ctx.textAlign = 'center';
      /* Landmarks are the background layer, so they carry a ground shadow
         and place labels are drawn over them with their own. Without this
         the two label sets collide into an unreadable smear. */
      ctx.shadowColor = 'rgba(5,4,6,0.95)';
      ctx.shadowBlur = 6;
      ctx.fillText(l.name.toUpperCase(), p.x, p.y + 18);
      ctx.shadowBlur = 0;
    });
    ctx.restore();
  }

  function drawPlaces() {
    PLACES.forEach((pl, i) => {
      const p = project(pl.lat, pl.lng);
      const inReach = pl.median <= reach;
      const isHot = hovered === i;

      /* In-reach markers carry a slow pink pulse. Out-of-reach ones stay
         visible and labelled — the tool never hides what you cannot
         afford, it just stops lighting it. */
      const pulse = inReach ? 0.5 + 0.5 * Math.sin(phase + i * 0.7) : 0;
      const r = isHot ? 9 : inReach ? 6 : 3.5;

      if (inReach) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 26 + pulse * 8);
        g.addColorStop(0, `rgba(224,19,132,${0.34 + pulse * 0.2})`);
        g.addColorStop(1, 'rgba(224,19,132,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, 26 + pulse * 8, 0, Math.PI * 2); ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = inReach ? '#FF4FA8' : 'rgba(255,255,255,0.22)';
      ctx.fill();

      if (inReach || isHot) {
        ctx.save();
        ctx.font = `${isHot ? 600 : 500} 11px "Inter Tight", system-ui, sans-serif`;
        ctx.textAlign = 'left';
        /* Sit the label above the marker rather than beside it: landmark
           captions already occupy the space below, and alternating the
           vertical offset keeps neighbouring areas from stacking. */
        const ty = p.y - r - 7 - (i % 2) * 11;
        ctx.shadowColor = 'rgba(5,4,6,0.98)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = 'rgba(5,4,6,0.9)';
        ctx.fillText(pl.name, p.x - r - 1, ty);   // shadow pass
        ctx.shadowBlur = 0;
        ctx.fillStyle = isHot ? '#FFFFFF' : '#FF4FA8';
        ctx.fillText(pl.name, p.x - r - 1, ty);
        ctx.restore();
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    drawGraticule();
    drawRange();
    drawLandmarks();
    drawPlaces();
  }

  function loop() {
    phase += 0.02;
    draw();
    raf = requestAnimationFrame(loop);
  }

  let visible = false;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !reduced.matches && !raf) raf = requestAnimationFrame(loop);
    if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
  }, { threshold: 0 });
  io.observe(canvas);

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    let best = null, bestD = 22;
    PLACES.forEach((pl, i) => {
      const p = project(pl.lat, pl.lng);
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best !== hovered) {
      hovered = best;
      canvas.style.cursor = best === null ? '' : 'pointer';
      if (reduced.matches || !raf) draw();
      opts.onHover?.(best === null ? null : PLACES[best]);
    }
  });
  canvas.addEventListener('pointerleave', () => {
    hovered = null; opts.onHover?.(null);
    if (reduced.matches || !raf) draw();
  });

  let t = 0;
  const onResize = () => { clearTimeout(t); t = setTimeout(resize, 120); };
  window.addEventListener('resize', onResize);

  resize();

  return {
    setReach(v) { reach = v; if (reduced.matches || !raf) draw(); },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    },
  };
}
