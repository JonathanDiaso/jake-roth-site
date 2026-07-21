/* ============================================================
   MAIN  ·  wiring only. No design decisions live here.
   ============================================================ */

import { AGENT, PROOF, TRACKS, STORY, VOICES, ASSUMPTIONS, RAMSEY, BROKERAGE, MARKET, RAIL } from './content.js';
import { initTerrain } from './terrain.js';
import { initEngine } from './engine.js';
import { initAtlas } from './atlas.js';
import {
  initReveal, initCounters, initParallax,
  initMagnetic, initCardLight, initNameReveal, initRail, initPressBloom, initHeroScrub,
} from './motion.js';

/* Marks the document as JS-capable. Reveal styles are scoped to this
   class, so a JS failure can never leave content hidden. */
document.documentElement.classList.add('js-on');

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* --- Contact links ------------------------------------------- */
function wireContact() {
  $$('[data-tel]').forEach((a) => { a.href = `tel:${AGENT.phone}`; });
  $$('[data-sms]').forEach((a) => { a.href = `sms:${AGENT.phone}`; });
  $$('[data-mailto]').forEach((a) => { a.href = `mailto:${AGENT.email}`; });
  $$('[data-book]').forEach((a) => { a.href = AGENT.bookingUrl; });
  $$('[data-phone-display]').forEach((n) => { n.textContent = AGENT.phoneDisplay; });
  $$('[data-agent-name]').forEach((n) => { n.textContent = AGENT.fullName; });
  $$('[data-license]').forEach((n) => { n.textContent = AGENT.licenseNumber; });
  $$('[data-brokerage-address]').forEach((n) => { n.textContent = BROKERAGE.address; });
  $$('[data-ramsey-claim]').forEach((n) => { n.textContent = RAMSEY.claimLine; });
  $$('[data-year]').forEach((n) => { n.textContent = String(new Date().getFullYear()); });
  $$('[data-assumptions-date]').forEach((n) => { n.textContent = ASSUMPTIONS.updated; });

  /* The engine's CTA carries the visitor's own numbers into the message
     so the first contact already has context. */
  const askLink = $('[data-out="ask-link"]');
  if (askLink) {
    askLink.addEventListener('click', (e) => {
      const body = askLink.dataset.prefill || '';
      e.preventDefault();
      window.location.href = `sms:${AGENT.phone}&body=${encodeURIComponent(body)}`;
    });
  }
}

/* --- Proof stats --------------------------------------------- */
function renderProof() {
  const grid = $('[data-proof]');
  if (!grid) return;
  /* A stat with no real number is worse than no stat. */
  const real = PROOF.filter((s) => s.value > 0);
  if (!real.length) { grid.closest('section')?.setAttribute('hidden', ''); return; }

  grid.innerHTML = '';
  real.forEach((stat, i) => {
    const item = document.createElement('div');
    item.className = 'stat';
    item.setAttribute('data-reveal', '');
    item.setAttribute('data-reveal-stagger', String(i * 70));
    const shown = (stat.prefix || '') + stat.value.toLocaleString('en-US', {
      minimumFractionDigits: stat.decimals || 0,
      maximumFractionDigits: stat.decimals || 0,
    }) + stat.suffix;
    item.innerHTML = `
      <p class="stat__value numeric"
         data-count="${stat.value}"
         data-count-prefix="${stat.prefix || ''}"
         data-count-suffix="${stat.suffix}"
         data-count-decimals="${stat.decimals || 0}">${shown}</p>
      <p class="stat__label"></p>`;
    item.querySelector('.stat__label').textContent = stat.label;
    grid.appendChild(item);
  });
}

const ICONS = {
  shield: 'M12 3l7 3v6c0 4.5-3 8.3-7 9-4-0.7-7-4.5-7-9V6l7-3z',
  key: 'M14 7a4 4 0 1 0-3.9 4.9L4 18v3h3l1-1v-2h2v-2h2l1.1-1.1A4 4 0 0 0 14 7z',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm3.5 5.5l-2 5-5 2 2-5 5-2z',
  chart: 'M4 20V10m5 10V4m5 16v-7m5 7V8',
  camera: 'M3 8h3l2-3h8l2 3h3v11H3V8zm9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  calc: 'M6 3h12v18H6V3zm2 3v3h8V6H8zm0 6h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM8 16h2v2H8v-2zm4 0h6v2h-6v-2z',
};

function renderTracks() {
  Object.entries(TRACKS).forEach(([key, list]) => {
    const wrap = $(`[data-tracks="${key}"]`);
    if (!wrap) return;
    wrap.innerHTML = '';
    list.forEach((track, i) => {
      const card = document.createElement('article');
      card.className = 'rcard';
      card.setAttribute('data-reveal', '');
      card.setAttribute('data-reveal-stagger', String(i * 80));
      card.innerHTML = `
        <div class="rcard__head">
          <span class="idx" aria-hidden="true">0${i + 1}</span>
          <h3 class="rcard__title"></h3>
        </div>
        <p class="rcard__body"></p>
        <ul class="rcard__list"></ul>`;
      card.querySelector('.rcard__title').textContent = track.title;
      card.querySelector('.rcard__body').textContent = track.body;
      const ul = card.querySelector('.rcard__list');
      track.points.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = p;
        ul.appendChild(li);
      });
      wrap.appendChild(card);
    });
  });
}

/* --- Fork tabs · full keyboard support per WAI-ARIA ----------- */
function initFork() {
  const tabs = $$('.fork__tab');
  if (!tabs.length) return;

  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });
  select(tabs[0]);
}

function renderStory() {
  const body = $('[data-story-body]');
  if (body) {
    body.innerHTML = '';
    STORY.body.forEach((p) => {
      const el = document.createElement('p');
      el.className = 'body-text';
      el.textContent = p;
      body.appendChild(el);
    });
  }
  const frame = $('[data-portrait]');
  if (frame && STORY.photo) {
    const pic = document.createElement('picture');
    if (STORY.photoWebp) {
      const src = document.createElement('source');
      src.type = 'image/webp';
      src.srcset = STORY.photoWebp;
      pic.appendChild(src);
    }
    const img = document.createElement('img');
    img.src = STORY.photo;
    img.alt = `${AGENT.fullName}, ${BROKERAGE.name}, Colorado Springs`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 600; img.height = 750;
    pic.appendChild(img);
    frame.innerHTML = '';
    frame.appendChild(pic);
  }
}

/* Real quotes only. With none supplied, the section removes itself
   rather than shipping invented endorsements. */
function renderVoices() {
  const section = $('[data-voices-section]');
  const track = $('[data-voices]');
  if (!section || !track) return;
  if (!VOICES.length) { section.remove(); return; }

  track.innerHTML = '';
  /* Duplicated once so the marquee loop is seamless at -50%. */
  [...VOICES, ...VOICES].forEach((v, i) => {
    const fig = document.createElement('figure');
    fig.className = 'qcard';
    if (i >= VOICES.length) fig.setAttribute('aria-hidden', 'true');
    fig.innerHTML =
      '<p class="stars" aria-label="Five out of five stars">' +
      '<svg viewBox="0 0 60 12" aria-hidden="true">' +
      [0,12,24,36,48].map((x) =>
        `<path transform="translate(${x},0)" d="M6 0l1.8 3.7 4.1.6-3 2.9.7 4.1L6 9.4 2.4 11.3l.7-4.1-3-2.9 4.1-.6z"/>`
      ).join('') + '</svg></p>' +
      '<blockquote class="qcard__text"></blockquote><figcaption class="qcard__who"></figcaption>';
    fig.querySelector('.qcard__text').textContent = `\u201C${v.text}\u201D`;
    fig.querySelector('.qcard__who').textContent = v.who;
    track.appendChild(fig);
  });
}

/* Fade the hero photograph in over its placeholder. Marked loaded
   immediately if it is already cached, so a repeat visit never fades. */
function initHeroImage() {
  const img = $('.hero__media img');
  if (!img) return;
  if (img.complete) { img.classList.add('is-loaded'); return; }
  img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
  img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
}

/* Owner-maintained, not a live feed — and the page says so rather than
   implying a data connection that does not exist. Cells with no real
   number yet are hidden instead of showing TODO to a visitor. */
function renderMarket() {
  const grid = $('[data-market]');
  if (!grid) return;
  const real = MARKET.rows.filter((r) => r.value && !String(r.value).startsWith('TODO'));
  if (!real.length) { grid.closest('section')?.setAttribute('hidden', ''); return; }

  grid.innerHTML = '';
  real.forEach((row, i) => {
    const cell = document.createElement('div');
    cell.className = 'market__cell';
    cell.setAttribute('data-reveal', '');
    cell.setAttribute('data-reveal-stagger', String(i * 70));
    cell.innerHTML = '<p class="market__value"></p><p class="market__label"></p><p class="market__note"></p>';
    cell.querySelector('.market__value').textContent = row.value;
    cell.querySelector('.market__label').textContent = row.label;
    cell.querySelector('.market__note').textContent = row.note;
    grid.appendChild(cell);
  });
  const pl = $('[data-market-punchline]');
  if (pl && MARKET.punchline) pl.textContent = MARKET.punchline;
  $$('[data-market-source]').forEach((n) => { n.textContent = MARKET.source; });
  $$('[data-market-date]').forEach((n) => { n.textContent = MARKET.asOf; });
}

function renderRail() {
  $$('[data-rail-eyebrow]').forEach((n) => { n.textContent = RAIL.eyebrow; });
  $$('[data-rail-tab-eyebrow]').forEach((n) => { n.textContent = RAIL.tabEyebrow; });
  const title = $('[data-rail-title]'); if (title) title.textContent = RAIL.title;
  const body = $('[data-rail-body]'); if (body) body.textContent = RAIL.body;
  const cta = $('[data-rail-cta]'); if (cta) cta.textContent = RAIL.cta;
  const pts = $('[data-rail-points]');
  if (pts) {
    pts.innerHTML = '';
    RAIL.points.forEach((p) => {
      const li = document.createElement('li');
      li.textContent = p;
      pts.appendChild(li);
    });
  }

  const rail = $('[data-siderail]');
  const open = $('[data-siderail-open]');
  const close = $('[data-siderail-close]');
  if (!rail || !open || !close) return;

  const setOpen = (on) => {
    rail.classList.toggle('is-open', on);
    open.setAttribute('aria-expanded', String(on));
    if (on) close.focus(); else open.focus();
  };
  open.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  /* Escape closes it, and a click anywhere outside dismisses it — a panel
     that can only be closed by one small button is a trap. */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rail.classList.contains('is-open')) setOpen(false);
  });
  document.addEventListener('pointerdown', (e) => {
    if (rail.classList.contains('is-open') && !rail.contains(e.target)) setOpen(false);
  });
}

function boot() {
  initHeroImage();
  wireContact();
  renderMarket();
  renderRail();
  renderProof();
  renderTracks();
  renderStory();
  renderVoices();
  initFork();

  const canvas = $('[data-terrain]');
  if (canvas) initTerrain(canvas);

  /* The map and the price ladder read from one source of truth: the
     engine pushes its result out, the map re-lights. */
  const mapCanvas = $('[data-atlas-map]');
  const rows = () => $$('[data-atlas] .prow');
  const atlas = mapCanvas ? initAtlas(mapCanvas, {
    onHover: (i) => rows().forEach((r, n) => r.classList.toggle('is-hot', n === i)),
  }) : null;
  initEngine($('[data-engine]'), { onReach: (price) => atlas?.setReach(price) });

  /* The Atlas is created inside the engine's collapsed panel, so it has no
     box to measure until the panel opens. Tell it the moment that happens
     — after the grid transition has actually laid out. */
  $('[data-engine-reveal]')?.addEventListener('click', () => {
    requestAnimationFrame(() => atlas?.resize());
    setTimeout(() => atlas?.resize(), 900);
  });

  /* Hovering a row lights its point on the map, and vice versa. The two
     views are one thing, so they have to move together. */
  $('[data-atlas]')?.addEventListener('pointerover', (e) => {
    const row = e.target.closest('.prow');
    if (!row) return;
    const i = rows().indexOf(row);
    rows().forEach((r, n) => r.classList.toggle('is-hot', n === i));
    atlas?.setHover(i);
  });
  $('[data-atlas]')?.addEventListener('pointerleave', () => {
    rows().forEach((r) => r.classList.remove('is-hot'));
    atlas?.setHover(null);
  });

  initHeroScrub($('[data-hero-scrub]'), $('.hero__copy'), $('.hero__portrait'));
  initNameReveal($('[data-name-reveal]'));
  initPressBloom();
  initReveal();
  initCounters();
  initParallax();
  initMagnetic();
  initCardLight();
  initRail($('[data-rail]'), $('[data-rail-sentinel]'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
