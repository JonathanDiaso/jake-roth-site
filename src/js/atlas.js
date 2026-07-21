/* ============================================================
   THE ATLAS  ·  drawn relief of the Pikes Peak region
   Every area sits at its true latitude and longitude, so distances on
   screen are real distances. A local can check it against what they
   already know; a PCS buyer can see how far an area sits from base.

   What is NOT here: stock photography. Captioning a downloaded image
   "Briargate" when it is not Briargate is misrepresentation, and
   neighbourhood imagery is Fair Housing territory (04_COMPLIANCE §3).
   Instead each area carries a glyph drawn from something factually
   true about it — a Victorian gable for Old Colorado City's 1890s
   stock, pines for Monument, a golf flag for Flying Horse.

   Canvas 2D. No library, no tiles, no network.
   ============================================================ */

import { PLACES, LANDMARKS } from './content.js';

const PINK = '#FF4FA8';
const PINK_DEEP = 'rgba(224,19,132,';
const ROCK = 'rgba(177,97,63,';
const DIM = 'rgba(255,255,255,0.2)';

/* ---- Glyphs · 1 unit ≈ 1px at scale 1, drawn around (0,0) ---- */
const GLYPHS = {
  /* Attached rooflines — Westside condos */
  row(c) {
    c.beginPath();
    for (let i = -1; i <= 1; i++) {
      c.moveTo(i * 5 - 2.2, 2); c.lineTo(i * 5, -1.4); c.lineTo(i * 5 + 2.2, 2);
    }
    c.stroke();
  },
  /* Street grid — Southeast Springs */
  grid(c) {
    c.beginPath();
    c.moveTo(-4, -2); c.lineTo(4, -2); c.moveTo(-4, 2); c.lineTo(4, 2);
    c.moveTo(-1.5, -4); c.lineTo(-1.5, 4); c.moveTo(1.5, -4); c.lineTo(1.5, 4);
    c.stroke();
  },
  /* Open water — Security-Widefield, Big Johnson Reservoir */
  water(c) {
    c.beginPath();
    for (let r = -2; r <= 2; r += 2) {
      c.moveTo(-5, r);
      c.bezierCurveTo(-2.5, r - 1.6, 2.5, r + 1.6, 5, r);
    }
    c.stroke();
  },
  /* Creek chevrons — Fountain, on Fountain Creek */
  creek(c) {
    c.beginPath();
    c.moveTo(-4, -3); c.lineTo(0, 0); c.lineTo(-4, 3);
    c.moveTo(1, -3); c.lineTo(5, 0); c.lineTo(1, 3);
    c.stroke();
  },
  /* Victorian gable with finial — Old Colorado City, 1890s–1930s */
  gable(c) {
    c.beginPath();
    c.moveTo(-4.5, 3.5); c.lineTo(-4.5, -0.5); c.lineTo(0, -4);
    c.lineTo(4.5, -0.5); c.lineTo(4.5, 3.5);
    c.moveTo(0, -4); c.lineTo(0, -6.2);
    c.stroke();
  },
  /* Large parcel — Falcon, many lots over 0.3 acre */
  parcel(c) {
    c.beginPath();
    c.rect(-4.5, -3.2, 9, 6.4);
    c.moveTo(-4.5, 0); c.lineTo(4.5, 0);
    c.stroke();
  },
  /* Foothill — Rockrimmon, sloped lots against the range */
  hill(c) {
    c.beginPath();
    c.moveTo(-5.5, 3.5); c.lineTo(-1.5, -2.5); c.lineTo(1, 1);
    c.lineTo(3, -1.5); c.lineTo(5.5, 3.5);
    c.stroke();
  },
  /* Rooftop cluster — Briargate, dense 1988–2004 build-out */
  cluster(c) {
    c.beginPath();
    c.moveTo(-5, 3); c.lineTo(-5, 0); c.lineTo(-2.5, -2); c.lineTo(0, 0); c.lineTo(0, 3);
    c.moveTo(0.6, 3); c.lineTo(0.6, -0.5); c.lineTo(3, -2.4); c.lineTo(5.4, -0.5); c.lineTo(5.4, 3);
    c.stroke();
  },
  /* Trail — Cordera, internal trail network on Cottonwood Creek */
  trail(c) {
    c.beginPath();
    c.moveTo(-5, 3.5);
    c.bezierCurveTo(-1, 2, -3, -2, 1, -3);
    c.bezierCurveTo(3.5, -3.6, 4.5, -1, 5, 1);
    c.stroke();
  },
  /* Pines — Monument, at the Pike National Forest edge */
  pines(c) {
    c.beginPath();
    [-3.4, 0.2, 3.6].forEach((x, i) => {
      const s = i === 1 ? 1.25 : 1;
      c.moveTo(x - 2.4 * s, 3); c.lineTo(x, -3.6 * s); c.lineTo(x + 2.4 * s, 3);
    });
    c.stroke();
  },
  /* Flag — Flying Horse, golf course community */
  flag(c) {
    c.beginPath();
    c.moveTo(-1.5, 4); c.lineTo(-1.5, -4.5);
    c.lineTo(3.8, -3); c.lineTo(-1.5, -1.4);
    c.stroke();
  },
  /* Peak-side crest — Broadmoor, against Cheyenne Mountain */
  crest(c) {
    c.beginPath();
    c.moveTo(-5.5, 3.5); c.lineTo(-0.5, -4); c.lineTo(5.5, 3.5);
    c.moveTo(-2.6, -0.2); c.lineTo(-0.5, -1.4); c.lineTo(1.6, -0.2);
    c.stroke();
  },
};

const GLYPH_FOR = {
  'Westside condos': 'row',
  'Southeast Springs': 'grid',
  'Security-Widefield': 'water',
  Fountain: 'creek',
  'Old Colorado City': 'gable',
  Falcon: 'parcel',
  Rockrimmon: 'hill',
  Briargate: 'cluster',
  Cordera: 'trail',
  Monument: 'pines',
  'Flying Horse': 'flag',
  Broadmoor: 'crest',
};

export function initAtlas(canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {}, setReach() {}, setHover() {} };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const all = [...PLACES, ...LANDMARKS];
  const b = {
    n: Math.max(...all.map((p) => p.lat)), s: Math.min(...all.map((p) => p.lat)),
    e: Math.max(...all.map((p) => p.lng)), w: Math.min(...all.map((p) => p.lng)),
  };

  let w = 0, h = 0, dpr = 1, raf = 0, phase = 0;
  let reach = Infinity;
  let hovered = null;

  /* Linear projection with a cosine correction on longitude. At half a
     degree of latitude, Mercator's distortion here is sub-pixel. */
  function project(lat, lng) {
    const k = Math.cos(((b.n + b.s) / 2 * Math.PI) / 180);
    const x0 = (b.w - 0.035) * k, x1 = (b.e + 0.02) * k;
    const y0 = b.n + 0.03, y1 = b.s - 0.03;
    return {
      x: (0.06 + ((lng * k - x0) / (x1 - x0)) * 0.88) * w,
      y: (0.07 + ((y0 - lat) / (y0 - y1)) * 0.86) * h,
    };
  }

  /* Self-healing size. This canvas is created inside a display:none
     subtree (the engine's progressive disclosure), so its first
     measurement is zero. Observers proved unreliable across that
     particular visibility change, so instead every draw path re-checks
     its own box and re-allocates the backing store when it has moved.
     Returns true when the store changed. Never calls draw() itself, so
     it can be used safely from inside draw paths. */
  function syncSize() {
    const r = canvas.getBoundingClientRect();
    const nw = Math.max(1, Math.round(r.width));
    const nh = Math.max(1, Math.round(r.height));
    if (nw === w && nh === h) return false;
    w = nw; h = nh;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  function resize() { syncSize(); draw(); }

  /* --- The Front Range, drawn as relief with Pikes Peak named --- */
  function drawRelief() {
    const peak = project(38.8405, -105.0442);
    const baseY = h * 0.94;

    /* Back ridge — the range continuing north and south of the summit. */
    ctx.beginPath();
    ctx.moveTo(-10, baseY);
    const ridge = [
      [-10, h * 0.30], [w * 0.045, h * 0.20], [w * 0.085, h * 0.34],
      [w * 0.12, h * 0.25], [w * 0.155, h * 0.40], [w * 0.185, h * 0.33],
      [w * 0.21, h * 0.48],
    ];
    ridge.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(w * 0.21, baseY);
    ctx.closePath();
    ctx.fillStyle = ROCK + '0.10)';
    ctx.fill();
    ctx.strokeStyle = ROCK + '0.34)';
    ctx.lineWidth = 1;
    ctx.stroke();

    /* Pikes Peak itself — a real summit, front-most, with a snow cap. */
    const pw = w * 0.085;
    const ph = h * 0.34;
    const apex = { x: peak.x, y: peak.y - ph * 0.42 };

    ctx.beginPath();
    ctx.moveTo(apex.x - pw, baseY);
    ctx.lineTo(apex.x - pw * 0.42, apex.y + ph * 0.42);
    ctx.lineTo(apex.x - pw * 0.16, apex.y + ph * 0.10);
    ctx.lineTo(apex.x, apex.y);
    ctx.lineTo(apex.x + pw * 0.22, apex.y + ph * 0.16);
    ctx.lineTo(apex.x + pw * 0.55, apex.y + ph * 0.38);
    ctx.lineTo(apex.x + pw, baseY);
    ctx.closePath();
    const g = ctx.createLinearGradient(apex.x, apex.y, apex.x, baseY);
    g.addColorStop(0, ROCK + '0.32)');
    g.addColorStop(1, ROCK + '0.05)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = ROCK + '0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    /* Snow cap. Clipped to the summit silhouette so it can never spill
       outside the mountain, with a ragged lower edge — a straight line
       across the top would read as a triangle with a hat on it. */
    ctx.save();
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(apex.x - pw * 0.5, apex.y + ph * 0.40);
    ctx.lineTo(apex.x - pw * 0.34, apex.y + ph * 0.22);
    ctx.lineTo(apex.x - pw * 0.20, apex.y + ph * 0.30);
    ctx.lineTo(apex.x - pw * 0.06, apex.y + ph * 0.09);
    ctx.lineTo(apex.x + pw * 0.06, apex.y + ph * 0.22);
    ctx.lineTo(apex.x + pw * 0.20, apex.y + ph * 0.14);
    ctx.lineTo(apex.x + pw * 0.34, apex.y + ph * 0.34);
    ctx.lineTo(apex.x + pw * 0.6, apex.y + ph * 0.46);
    ctx.lineTo(apex.x + pw, apex.y - 4);
    ctx.lineTo(apex.x - pw, apex.y - 4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fill();
    ctx.restore();

    ctx.font = '600 9px "Inter Tight", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('PIKES PEAK', apex.x, baseY - h * 0.03);
    ctx.font = '400 8px "Inter Tight", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillText('14,115 FT', apex.x, baseY - h * 0.03 + 11);
  }

  function drawLandmarks() {
    ctx.save();
    ctx.font = '500 9px "Inter Tight", system-ui, sans-serif';
    ctx.textAlign = 'center';
    LANDMARKS.filter((l) => l.kind !== 'peak').forEach((l) => {
      const p = project(l.lat, l.lng);
      ctx.beginPath();
      if (l.kind === 'city') {
        ctx.rect(p.x - 3.5, p.y - 3.5, 7, 7);
        ctx.fillStyle = 'rgba(255,255,255,0.34)';
        ctx.fill();
      } else {
        /* Installations: a warm chevron rather than a blue square. */
        ctx.moveTo(p.x, p.y - 4.5); ctx.lineTo(p.x + 4, p.y + 3);
        ctx.lineTo(p.x - 4, p.y + 3); ctx.closePath();
        ctx.strokeStyle = 'rgba(255,158,94,0.62)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
      ctx.shadowColor = 'rgba(5,4,6,0.95)'; ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgba(255,255,255,0.38)';
      ctx.fillText(l.name.toUpperCase(), p.x, p.y + 15);
      ctx.shadowBlur = 0;
    });
    ctx.restore();
  }

  function drawPlaces() {
    PLACES.forEach((pl, i) => {
      const p = project(pl.lat, pl.lng);
      const inReach = pl.median <= reach;
      const hot = hovered === i;
      const pulse = inReach ? 0.5 + 0.5 * Math.sin(phase + i * 0.8) : 0;

      if (inReach || hot) {
        const rad = (hot ? 34 : 22) + pulse * 7;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        g.addColorStop(0, PINK_DEEP + (hot ? 0.5 : 0.3 + pulse * 0.16) + ')');
        g.addColorStop(1, PINK_DEEP + '0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
      }

      /* The characteristic mark. Scaled up and brightened on hover so
         the row-to-map link is unmistakable. */
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(hot ? 1.5 : 1.1, hot ? 1.5 : 1.1);
      ctx.lineWidth = hot ? 1.5 : 1.2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = hot ? '#FFFFFF' : inReach ? PINK : DIM;
      (GLYPHS[GLYPH_FOR[pl.name]] || GLYPHS.cluster)(ctx);
      ctx.restore();

      if (inReach || hot) {
        ctx.save();
        ctx.font = `${hot ? 600 : 500} 10px "Inter Tight", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        const ty = p.y - 12 - (i % 2) * 10;
        ctx.shadowColor = 'rgba(5,4,6,0.98)'; ctx.shadowBlur = 8;
        ctx.fillStyle = 'rgba(5,4,6,0.95)';
        ctx.fillText(pl.name, p.x, ty);
        ctx.shadowBlur = 0;
        ctx.fillStyle = hot ? '#FFFFFF' : PINK;
        ctx.fillText(pl.name, p.x, ty);
        ctx.restore();
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    drawRelief();
    drawLandmarks();
    drawPlaces();
  }

  /* Visibility is checked INSIDE the loop rather than gating it from an
     IntersectionObserver. The observer fires "not intersecting" while the
     canvas is still inside the engine's display:none subtree and then
     does not reliably fire again on reveal, which left the loop dead and
     the backing store stuck at 1px. A rect test per frame is a rounding
     error next to the drawing itself and cannot get stuck. */
  function onScreen() {
    const r = canvas.getBoundingClientRect();
    return r.width > 1 && r.bottom > -200 && r.top < window.innerHeight + 200;
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    if (!onScreen()) return;
    syncSize();
    phase += 0.02;
    draw();
  }

  if (!reduced.matches) raf = requestAnimationFrame(loop);

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    let best = null, bd = 24;
    PLACES.forEach((pl, i) => {
      const p = project(pl.lat, pl.lng);
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < bd) { bd = d; best = i; }
    });
    if (best !== hovered) {
      hovered = best;
      canvas.style.cursor = best === null ? '' : 'pointer';
      opts.onHover?.(best);
      if (reduced.matches || !raf) draw();
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
    /* resize() is exposed because this canvas is built inside a hidden
       subtree and nothing about becoming visible is reliably observable
       from in here. The owner knows when it revealed the panel, so the
       owner tells us. Cheap, deterministic, no observer to get stuck. */
    resize,
    setReach(v) { reach = v; resize(); },
    setHover(i) { hovered = i; resize(); },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    },
  };
}
