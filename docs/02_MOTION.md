# 02 — MOTION LANGUAGE & PERFORMANCE BUDGET

**Status:** DRAFT — doctrine and budget are binding. Specific curve values fill in at design lock.
**Level selected:** Cinematic-refined (Apple / Foundry tier), with permission to push playful.

This is the file that determines whether this site is a triumph or an expensive mistake. Motion is the headline requirement **and** the primary risk.

---

## The doctrine

> **Motion is a reward, never a gate.**

Every piece of content is present, readable, and actionable at frame one. Motion layers *on top* of a page that already works. If JavaScript fails, the network is slow, or the user is on a five-year-old Android on cellular in a Fort Carson parking lot — **they still see a complete, beautiful, usable site.**

This is how Apple actually does it. It looks effortless because the fallback is invisible, not because it's absent.

### Why this is non-negotiable

You cited b-egg.farm. It is a genuinely brilliant site. It is also the wrong model for this project, and here is the specific reason:

- ~65% of real estate traffic is **mobile**, much of it on cellular
- Google's local ranking uses **Core Web Vitals**, weighted to mobile
- Your competitors are ranking in Colorado Springs local search *right now*
- A site that loses to a mediocre competitor because the hero shipped 4MB of WebGL is not a great site — it is a portfolio piece that costs you business

**We take b-egg's ambition and spend it where it converts.** One unforgettable moment, engineered — not a whole site of expensive motion.

---

## Performance budget — HARD LIMITS

Measured on **mobile**, throttled to Slow 4G, mid-tier Android. Not on your laptop.

| Metric | Budget | Why |
|--------|--------|-----|
| **LCP** (Largest Contentful Paint) | **< 2.0s** | Google's "good" is 2.5s. We beat it. |
| **CLS** (Cumulative Layout Shift) | **< 0.05** | Reveal animations are the #1 cause. Reserve space always. |
| **INP** (Interaction to Next Paint) | **< 200ms** | Scroll handlers are the usual killer. |
| **Initial JS** | **< 150KB gzipped** | Motion libraries are heavy. Budget them deliberately. |
| **Hero payload** | **< 1.2MB** total | Includes image/video poster. |
| **Total page weight** (home, initial) | **< 2MB** | |
| **Fonts** | **≤ 2 families, ≤ 4 weights**, `woff2`, preloaded, `font-display: swap` | |
| **Lighthouse Performance (mobile)** | **≥ 90** | |

**Enforcement:** this is a build gate in `05_BUILD_PLAN.md`. **Over budget = does not ship.** Not "we'll optimize later." Later never comes and by then the motion is load-bearing.

**The showpiece exception:** the single showpiece (see below) may exceed these limits **only** if it is lazy-loaded below the fold, behind an intersection observer, and never blocks LCP or initial JS.

---

## Motion primitives

The complete vocabulary. **Anything not on this list requires an addition to this file** — no inventing motion inline, same rule as design tokens.

### 1. Reveal
Content enters on scroll. Fade + short translate (16–24px). Staggered for groups (60–80ms).
- **Allowed:** everywhere
- **Rules:** never >400ms. Space reserved before animation — zero layout shift. Fires once, never re-triggers on scroll-up. Element is fully readable if JS never runs.

### 2. Parallax depth
Layers move at differing scroll rates for dimensionality.
- **Allowed:** hero, neighborhood sections, section transitions
- **Rules:** subtle — max 15% differential. Transform-only, never `top`/`margin`. Disabled below 768px.

### 3. Page transition
Navigation feels continuous rather than a hard cut.
- **Allowed:** all internal navigation
- **Rules:** ≤ 500ms total. Must never delay content beyond that. Back/forward must work correctly. URL updates immediately.

### 4. Magnetic cursor
Interactive elements attract the cursor; a custom cursor state signals affordance.
- **Allowed:** desktop only, primary CTAs and Atlas nodes
- **Rules:** pointer-device only (`@media (hover: hover) and (pointer: fine)`). Never the sole affordance signal. Never impedes an actual click.

### 5. Scroll-scrub
Animation timeline tied directly to scroll position. **The signature move.**
- **Allowed:** hero, and the showpiece
- **Rules:** must be interruptible and reversible. Must never trap or hijack scroll — native scroll speed is preserved, always. Sequences pre-decoded and capped. **Disabled below 768px** in favor of a static composition.

### 6. Numeric counter
Figures count up when scrolled into view. (Homes sold, families served, days on market.)
- **Allowed:** proof/stats sections
- **Rules:** ≤ 1.2s. Final value present in the DOM for screen readers and no-JS. Never for prices in listings — that reads as a gimmick.

### 7. Marquee
Continuous horizontal drift. Testimonials, neighborhood names, credentials.
- **Allowed:** sparingly — max one per page
- **Rules:** pauses on hover and on focus. Never contains the only instance of important information.

### 8. Ambient
Slow, non-repeating background life — gradient drift, grain, subtle light movement.
- **Allowed:** hero, dark sections
- **Rules:** CSS-only where possible. Zero scroll listeners. Must be genuinely subtle — if you notice it as an effect, it's too strong.

---

## Easing & duration

Values finalize at design lock. The **structure** is binding now.

```
--ease-out-expo      entrances — fast start, long graceful settle
--ease-in-out-quart  transitions, movement between states
--ease-spring        playful moments — the "more fun" allowance
--ease-linear        scroll-scrub and marquee ONLY

--duration-instant   100ms   state feedback (hover, press)
--duration-fast      200ms   small UI transitions
--duration-base      320ms   standard reveals
--duration-slow      500ms   page transitions, large elements
--duration-cinematic 800ms   hero moments only
```

**Character:** fast to start, slow to settle. Motion should feel *inevitable* — like the element was always going to land there. Linear easing is what makes motion feel cheap; it appears here only for scroll-scrub and marquee, where it's correct.

---

## The showpiece

Per the "cinematic base + one showpiece" pattern: refined motion sitewide, then **exactly one** moment built at full intensity.

**Candidates** (choose at design lock):

1. **The Neighborhood Atlas** — cinematic scroll-driven journey through the Colorado Springs neighborhoods you work. Strongest emotional payload; showcases local mastery; highly shareable.
2. **The Affordability Engine** — a number transforming in real time into actual homes and neighborhoods. Highest *conversion* payload; genuinely useful; captures a lead at peak motivation.

**Recommendation: the Affordability Engine.** The Atlas is more beautiful; the Engine is more valuable. The Engine is also the thing no competitor in Colorado Springs has, which makes it a moat rather than a flourish. Build the Atlas at cinematic-refined tier — it will still be excellent.

**Constraints on the showpiece:**
- Lazy-loaded, below the fold, behind an intersection observer
- Never blocks LCP or initial JS budget
- Has a complete, functional static fallback — the Engine must still calculate with zero motion
- Ships a real mobile experience — simplified, not removed

---

## Accessibility contract — binding

### `prefers-reduced-motion: reduce`

When set, **honor it completely.** Not partially.

- ❌ Disable: parallax, scroll-scrub, magnetic cursor, marquee, ambient, counters
- ✅ Keep: opacity-only transitions ≤ 200ms
- ✅ **All content and functionality remain fully available.** Reduced motion must never mean a reduced site.
- The showpiece must have a complete reduced-motion path — not a blank space.

### Also required

- Motion never conveys information that isn't also available statically
- No flashing >3× per second (seizure risk)
- Scroll-jacking is **prohibited.** Native scroll speed and position are always respected. This is a hard rule.
- Focus states are never animated away or hidden
- Animation never delays keyboard access to anything

---

## Mobile degradation ladder

| Primitive | Mobile behavior |
|-----------|-----------------|
| Reveal | ✅ Keep — shortened to 240ms |
| Parallax | ❌ Off below 768px |
| Page transition | ✅ Keep — simplified |
| Magnetic cursor | ❌ Off (no pointer) |
| Scroll-scrub | ❌ Off — static composition instead |
| Counter | ✅ Keep |
| Marquee | ✅ Keep — reduced speed |
| Ambient | ⚠️ CSS-only, no JS |

**The mobile site is not a lesser site.** It is the *primary* site for most of your visitors. It should feel fast, confident, and complete — which for a phone means less motion, better typography, and immediate content.

---

## Anti-patterns — explicitly banned

- ❌ Scroll-jacking or hijacked scroll speed
- ❌ Preloader/intro animation gating content ("luxury" sites do this; it costs conversions)
- ❌ Content invisible until JS loads (`opacity: 0` default with no `noscript` fallback)
- ❌ Motion triggering layout shift
- ❌ Autoplay video with sound
- ❌ Animation that must complete before interaction is possible
- ❌ Cursor effects that make clicking harder
- ❌ Infinite subtle motion in the reader's peripheral vision during long-form text
