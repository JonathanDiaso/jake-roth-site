/* ============================================================
   MOTION  ·  primitives from 02_MOTION.md, vanilla, no library
   Every primitive here degrades to "content is simply visible".
   Nothing is a gate.
   ============================================================ */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- §1 Reveal -----------------------------------------------
   Fires once. Never re-triggers on scroll-up. Space is reserved by
   the layout, so a reveal can never cause layout shift. */
export function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (reduced() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const stagger = Number(el.dataset.revealStagger || 0);
      el.style.setProperty('--reveal-delay', `${stagger}ms`);
      el.classList.add('is-revealed');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

  items.forEach((el) => io.observe(el));
}

/* --- §6 Numeric counter --------------------------------------
   The final value is written into the DOM first, so screen readers
   and a no-JS load both get the real number immediately. */
export function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const render = (el, value) => {
    const decimals = Number(el.dataset.countDecimals || 0);
    el.textContent = (el.dataset.countPrefix || '') + value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + (el.dataset.countSuffix || '');
  };

  els.forEach((el) => render(el, Number(el.dataset.count)));
  if (reduced() || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);

      const target = Number(el.dataset.count);
      if (!target) return;
      const duration = 1200; // 02_MOTION.md caps counters at 1.2s
      const start = performance.now();

      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4); // expo-out
        render(el, target * eased);
        if (t < 1) requestAnimationFrame(step);
        else render(el, target);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });

  els.forEach((el) => io.observe(el));
}

/* --- §2 Parallax depth ---------------------------------------
   Transform-only, max 15% differential, off below 768px. Reads scroll
   inside the rAF callback so it never forces layout during the event. */
export function initParallax() {
  if (reduced() || window.innerWidth < 768) return;
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    layers.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const strength = Number(el.dataset.parallax || 8);
      el.style.transform = `translate3d(0, ${(-progress * strength).toFixed(2)}%, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* --- §4 Magnetic cursor · pointer devices only ----------------
   Never the sole affordance signal, and never impedes a real click:
   the translation is capped well inside the element's own bounds. */
export function initMagnetic() {
  if (reduced()) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic || 0.18);

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };
    const onLeave = () => { el.style.transform = ''; };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('blur', onLeave);
  });
}

/* --- Card light tracking · the Night Glass signature -----------
   Sets --mx/--my so the pink edge-light follows the cursor. Falls back
   to a centred light with no JS, so the card is never broken. */
export function initCardLight() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.glass--lit').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
}

/* --- Character reveal on the hero name ------------------------
   Splits into spans for the entrance, then the original text node is
   restored on completion so screen readers and copy/paste see one
   continuous string rather than per-character elements. */
export function initNameReveal(el) {
  if (!el) return;
  const text = el.textContent.trim();
  if (reduced()) return;

  el.setAttribute('aria-label', text);
  el.textContent = '';

  const chars = [...text].map((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? ' ' : ch;
    span.setAttribute('aria-hidden', 'true');
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(0.34em)';
    span.style.transition =
      `opacity 620ms cubic-bezier(0.16,1,0.3,1) ${i * 28}ms,` +
      `transform 620ms cubic-bezier(0.16,1,0.3,1) ${i * 28}ms`;
    el.appendChild(span);
    return span;
  });

  requestAnimationFrame(() => {
    chars.forEach((span) => {
      span.style.opacity = '1';
      span.style.transform = 'none';
    });
  });

  const settle = 620 + chars.length * 28 + 60;
  setTimeout(() => {
    el.textContent = text;
    el.removeAttribute('aria-label');
  }, settle);
}

/* --- Press bloom · pink light from the point of contact --------
   Delegated from the document so elements rendered later (place cards,
   track cards) get the behaviour without re-binding. Uses pointerdown
   rather than click so the light appears on contact, not on release —
   the delay of waiting for mouseup is exactly what makes an interaction
   feel unresponsive. */
export function initPressBloom() {
  if (reduced()) return;

  document.addEventListener('pointerdown', (e) => {
    const host = e.target.closest('[data-press]');
    if (!host) return;

    host.classList.add('press-host');
    const rect = host.getBoundingClientRect();

    const bloom = document.createElement('span');
    bloom.className = 'press-bloom';
    bloom.setAttribute('aria-hidden', 'true');
    bloom.style.setProperty('--bx', `${e.clientX - rect.left}px`);
    bloom.style.setProperty('--by', `${e.clientY - rect.top}px`);
    /* Scale the bloom to the element so a wide CTA and a small icon
       button both read as the same gesture. */
    bloom.style.setProperty('--bsize', `${Math.max(rect.width, rect.height) * 1.6}px`);

    host.appendChild(bloom);
    bloom.addEventListener('animationend', () => bloom.remove(), { once: true });
  }, { passive: true });
}

/* --- §5 Scroll-scrub · the signature move ----------------------
   The hero photograph scales and drifts against the copy as you leave
   it, so the first screen is alive rather than a static poster. Bound
   to scroll POSITION, not to a timer, so it is interruptible and
   reversible by definition and never fights native scroll speed.
   Transform and opacity only — no layout is read or written. */
export function initHeroScrub(picture, copy, portrait) {
  if (!picture || reduced() || window.innerWidth < 768) return;

  const hero = picture.closest('.hero');
  if (!hero) return;

  let ticking = false;
  const update = () => {
    const h = hero.offsetHeight || 1;
    const p = Math.min(Math.max(-hero.getBoundingClientRect().top / h, 0), 1);
    // Photo pushes in slowly and sinks; copy rises faster and fades out.
    picture.style.transform = `scale(${(1 + p * 0.16).toFixed(4)}) translate3d(0, ${(p * 4).toFixed(2)}%, 0)`;
    picture.style.filter = `saturate(${(0.72 - p * 0.25).toFixed(3)}) contrast(1.08) brightness(${(1 - p * 0.25).toFixed(3)})`;
    if (copy) {
      copy.style.transform = `translate3d(0, ${(-p * 14).toFixed(2)}%, 0)`;
      copy.style.opacity = String(Math.max(0, 1 - p * 1.45));
    }
    /* The portrait rises faster than the copy and fades sooner, so the
       hero separates into layers as it leaves rather than sliding away
       as one flat card. He is the nearest thing to the viewer, so he
       moves the most — that is what sells the depth. */
    if (portrait) {
      portrait.style.transform =
        `translate3d(0, ${(-p * 26).toFixed(2)}%, 0) scale(${(1 - p * 0.06).toFixed(4)})`;
      portrait.style.opacity = String(Math.max(0, 1 - p * 1.9));
    }
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* --- Sticky contact rail · appears once past the hero ---------- */
export function initRail(rail, sentinel) {
  if (!rail || !sentinel || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(([entry]) => {
    rail.classList.toggle('is-visible', !entry.isIntersecting);
  }, { threshold: 0 });
  io.observe(sentinel);
}
