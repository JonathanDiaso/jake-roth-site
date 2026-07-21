/* ============================================================
   MAIN  ·  wiring only. No design decisions live here.
   ============================================================ */

import { AGENT, PROOF, TRACKS, STORY, VOICES, ASSUMPTIONS, RAMSEY, BROKERAGE } from './content.js';
import { initTerrain } from './terrain.js';
import { initEngine } from './engine.js';
import {
  initReveal, initCounters, initParallax,
  initMagnetic, initCardLight, initNameReveal, initRail, initPressBloom,
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
      card.className = 'track glass glass--lit';
      card.setAttribute('data-reveal', '');
      card.setAttribute('data-reveal-stagger', String(i * 80));
      card.innerHTML = `
        <svg class="track__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="${ICONS[track.icon] || ICONS.shield}"/>
        </svg>
        <h3 class="track__title"></h3>
        <p class="track__body"></p>
        <ul class="track__list"></ul>`;
      card.querySelector('.track__title').textContent = track.title;
      card.querySelector('.track__body').textContent = track.body;
      const ul = card.querySelector('.track__list');
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
    fig.className = 'quote glass';
    if (i >= VOICES.length) fig.setAttribute('aria-hidden', 'true');
    fig.innerHTML =
      '<p class="stars" aria-label="Five out of five stars">' +
      '<svg viewBox="0 0 60 12" aria-hidden="true">' +
      [0,12,24,36,48].map((x) =>
        `<path transform="translate(${x},0)" d="M6 0l1.8 3.7 4.1.6-3 2.9.7 4.1L6 9.4 2.4 11.3l.7-4.1-3-2.9 4.1-.6z"/>`
      ).join('') + '</svg></p>' +
      '<blockquote class="quote__text"></blockquote><figcaption class="quote__who"></figcaption>';
    fig.querySelector('.quote__text').textContent = `“${v.text}”`;
    fig.querySelector('.quote__who').textContent = v.who;
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

function boot() {
  initHeroImage();
  wireContact();
  renderProof();
  renderTracks();
  renderStory();
  renderVoices();
  initFork();

  const canvas = $('[data-terrain]');
  if (canvas) initTerrain(canvas);

  initEngine($('[data-engine]'));
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
