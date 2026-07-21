# 01 — DESIGN SYSTEM

**Status:** 🟢 **LOCKED — 2026-07-21.**
**Direction selected: B — "Night Glass."**

Chosen for three reasons, in order of weight:

1. **Asset reality.** Only three photographs exist today. On a light ground, empty space *demands* imagery and sparse photography reads as unfinished. On a near-black ground, empty space reads as depth. Dark is the direction that survives having few photos — and lets those three land as deliberate.
2. **Badge fit.** The RamseyTrusted navy badge sits natively in a dark field with zero special handling (`04_COMPLIANCE.md` §1). Alpine Editorial would have required an engineered inset.
3. **Photography gain.** A merely-good photo vignetted into black outperforms the same photo floating on white, where every flaw is visible at full contrast.

**The cold-dark risk is mitigated by token, not by hope:** `--color-accent-warm` (amber) sits under the pink bloom in every dark field. Warm dark, not blue dark. That token is load-bearing for the first-time-buyer audience.

**From this point: components inherit only.** A missing token is a stop-and-flag moment, never an invent-inline moment.

**Live implementation:** `src/styles/tokens.css` is the machine-readable copy of this file and the single runtime source of truth.

---

## The rule this file enforces

Once locked, **every component inherits from these tokens. No exceptions.**

- No ad-hoc hex values, spacing, or font sizes invented inside a component.
- If a needed token doesn't exist → **stop and propose an addition.** Never invent inline.
- No code written against an undefined token. That's a stop-and-flag moment.

This applies to every agent, every session, forever.

---

## Phase 1 — the three directions to explore

Three genuinely distinct visual territories. We will produce a real mockup of each — not a description — and you pick one. You may also pick elements across two, but only before the lock.

Selected motion level (from interview): **cinematic-refined, Apple/Foundry tier, with permission to be more fun.** All three directions are built to that ceiling.

### Direction A — "Alpine Editorial"

Colorado light. Warm off-white ground, enormous type-scale contrast, magazine-grade whitespace. Photography does all the color work. Pink appears maybe four times on the whole page — a rule, a underline, a live indicator — and lands like a struck match because it's so rare.

- **Closest reference:** Foundry UK
- **Feels like:** confident, timeless, expensive, editorial
- **Risk:** the least "fun" of the three; could read reserved
- **Ramsey badge fit:** ⚠️ hardest — navy badge on warm white needs a dedicated dark inset
- **Best if:** you want to look like the most established agent in the city

### Direction B — "Night Glass"

Deep near-black ground, layered translucency and depth, luminous pink used as *light* rather than paint — glow, gradient bloom, edge-lighting. Photography glows out of darkness. Scroll feels like moving through space.

- **Closest reference:** Apple Intelligence
- **Feels like:** premium, modern, cinematic, technological
- **Risk:** dark sites can feel cold for first-time buyers; needs warm photography to stay human
- **Ramsey badge fit:** ✅ **best** — navy sits natively in a dark field, no special handling
- **Best if:** you want the site people screenshot and send to friends

### Direction C — "Signal"

High-contrast, confident, playful geometry. Pink is a *structural* element — full-bleed pink panels, oversized type, bold sectional shifts. Rhythmic and energetic without being loud. Directly serves your "maybe a little more fun" note.

- **Closest reference:** b-egg.farm's confidence, disciplined into a conversion site
- **Feels like:** distinctive, warm, memorable, human
- **Risk:** highest chance of reading "cheerful" instead of "high-end" if executed even slightly loose — needs the most discipline
- **Ramsey badge fit:** ✅ good — sectional shifts give us a natural dark band
- **Best if:** you want to own "Pink Realty pink" as a genuine brand asset

---

## The pink problem — read before exploring

Pink Realty's pink is a real asset. A distinctive brand color is hard to come by and most agents have none. It is also **the single easiest way to make this site look cheap.**

**The failure mode:** pink used as *decoration* — pink buttons, pink headings, pink borders, pink icons. This reads consumer-grade instantly and cannot be recovered by good typography.

**The rules that make pink read expensive:**

1. **Pink is a verb, not a wall.** It marks the thing that matters — the action, the live data point, the answer — never the whole surface.
2. **Sophisticated neutral base.** Deep charcoal / warm off-white does 95% of the work. Pink is the remaining 5%.
3. **Precision beats saturation.** One exactly-right pink, used four times, beats five pinks used forty times.
4. **Never pink-on-pink.** Pink needs a neutral to push against or it collapses.
5. **Earn it.** If a section has no single most-important element, it gets no pink.

Direction C deliberately breaks rule 1 in a controlled way — that's the experiment.

---

## Token values — LOCKED

Authoritative runtime copy: `src/styles/tokens.css`. This table is the human reference; if the two ever disagree, the CSS file is a bug.

### Color

| Token | Value | Contrast on base | Permitted use |
|---|---|---|---|
| `--color-surface-base` | `#0A090C` | — | The ground. Never pure `#000` — pure black kills depth on OLED. |
| `--color-surface-sunken` | `#050406` | — | Footer, engine trough |
| `--color-surface-raised` | `#131117` | — | Switches, inert panels |
| `--color-ink-900` | `#FFFFFF` | 19.6:1 | Headlines |
| `--color-ink-700` | `#E8E6EC` | 16.1:1 | Body |
| `--color-ink-500` | `#A5A1AE` | 7.9:1 | Secondary body |
| `--color-ink-300` | `#8B8794` | 5.5:1 | Labels, meta. **Contrast floor — nothing dimmer.** |
| `--color-brand-pink` | `#E01384` | 4.3:1 | **LARGE TEXT AND UI ONLY.** Fails AA for small text. |
| `--color-brand-pink-deep` | `#D9017A` | — | Hover/pressed states |
| `--color-brand-pink-glow` | `#FF4FA8` | 6.6:1 | **The only pink permitted for small text.** |
| `--color-ramsey-navy` | `#0E2A47` | — | Credentials band field. **Provisional** — re-sample from the official badge. |
| `--color-accent-warm` | `#FF9E5E` | — | The anti-cold token. Bloom, comparison callout. |
| `--color-rock` | `#B1613F` | — | **Sampled from Jake's Garden of the Gods photo.** |
| `--color-rock-lit` | `#D28F69` | — | Sunlit face of the same rock. |
| `--color-ember` | `#C4526B` | — | The bridge tone between rock and brand pink. |
| `--color-focus` | `#7FD4FF` | — | Focus ring. **Deliberately not pink** — a focus ring must never be confusable with a brand accent. |

> **Pink provenance:** `#E01384` and `#D9017A` were **sampled from pinkrealty.com's production CSS on 2026-07-21**, not invented.

### The rock bridge — why the pink belongs here

Measured from Jake's own photographs, not chosen:

| Source | Sampled | Hue |
|---|---|---|
| Garden of the Gods rock (2,020 px averaged) | `#B1613F` | H 18 |
| Sunlit rock face | `#D28F69` | H 22 |
| **Jake's tie in the headshot** | `#942257` | **H 332** |
| Pink Realty logo core | `#E7337B` | **H 336** |

His tie and the brokerage logo are **4° apart** — he is already wearing the brand. The rock sits 42° away across the warm side of the wheel, close enough to bridge through a single ember tone.

**The consequence:** the brand pink is reached by walking out of the actual Colorado Springs landscape rather than being applied on top of it. Nobody consciously notices. Everybody feels that it belongs.

### Where pink is allowed — binding

✅ The bloom behind the hero name · the live affordability figure · neighborhoods newly in reach · the single primary CTA · the press bloom · his tie.

❌ Section backgrounds · body text · icons as decoration · borders "to add interest".

**Rule:** if a section has no single most-important element, it gets no pink.

> **The 4.3:1 rule is the one most likely to be broken by a future edit.** `--color-brand-pink` on the dark ground fails AA for body text. Small pink text uses `--color-brand-pink-glow`, always. This is why there are two pinks.

### Type — LOCKED

**`--font-display`: Instrument Serif (400 + italic).** High-contrast editorial serif. Chosen over Playfair Display specifically *because* Playfair is the default luxury pick and reads as a template on sight. Instrument Serif has the same expensive high-contrast quality without the association.

**`--font-body`: Inter Tight (400 / 500 / 600).** Inter's negative-tracking cut. At label and UI sizes the tighter set width reads deliberately drawn rather than defaulted, while keeping Inter's screen legibility.

**Two families, four weights total** — inside the `02_MOTION.md` budget. There is no `--font-mono`: Inter Tight's `tabular-nums` feature handles the Affordability Engine's figures, which saves a whole font family for no visual loss.

Display-to-body scale ratio at desktop ≈ **7:1**. Timid scale contrast is the single biggest reason a page reads generic.

```
(historical schema, retained for reference)
--font-display     headlines. carries the entire personality.
--font-body        long-form legibility at 16px on a phone in sunlight

--text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl,6xl,7xl}
--leading-{tight,snug,normal,relaxed}
--tracking-{tight,normal,wide}
--weight-{regular,medium,semibold,bold}
```

**Requirement:** dramatic scale contrast between display and body. Both Foundry and Apple do this. Timid scale contrast is the #1 reason a site reads generic.

### Space

One scale. Every margin, padding, and gap comes from it.

```
--space-{1,2,3,4,6,8,12,16,24,32,48,64,96,128}
--section-gap-{sm,md,lg,xl}
--container-{narrow,default,wide,full}
--gutter-{mobile,tablet,desktop}
```

### Radius, elevation, motion

```
--radius-{none,sm,md,lg,xl,full}
--shadow-{sm,md,lg,glow}
--ease-*, --duration-*    → DEFINED IN 02_MOTION.md, not here. Single source of truth.
```

---

## Non-negotiable floors

These are locked **now** and are not subject to the direction choice. They are also legal risk controls — see `04_COMPLIANCE.md` §3.

- ✅ **WCAG 2.1 AA contrast** — 4.5:1 body text, 3:1 large text and UI components. Verified, not eyeballed. Pink-on-white almost always fails; check every pairing.
- ✅ **Touch targets ≥ 44×44px**, with adequate spacing between adjacent targets.
- ✅ **Mobile-first** — write `block md:flex`, never desktop-first overrides. ~65% of real estate traffic is mobile.
- ✅ **Visible keyboard focus** on every interactive element. Never `outline: none` without a designed replacement.
- ✅ **Full keyboard operability** — including the Affordability Engine and Neighborhood Atlas.
- ✅ **Readable at 200% zoom** without horizontal scroll.
- ✅ **No text baked into images** — screen readers can't read it and it can't be translated.

---

## Ramsey badge — design constraint

Per `04_COMPLIANCE.md` §1, the badge **cannot be resized, recolored, cropped, or rearranged.**

The design system must therefore provide a **Credentials Band**: a component with a dark, navy-compatible field sized around the badge's native dimensions, so an unmodifiable navy graphic sits as a deliberate design decision rather than a foreign object.

Every direction above must demonstrate this band in its Phase 1 mockup. **A direction that can't host the badge gracefully is disqualified** — this is a hard requirement, not a detail to solve later.

---

## Phase 2 — lock procedure

1. Three directions built as real mockups (hero + credentials band + one content section).
2. You choose one.
3. Every token value in this file is filled in.
4. Status changes to 🟢 **LOCKED**, dated.
5. From that moment: components inherit only. Missing token → stop and propose.
6. **Do not reopen a locked decision mid-build.** A better idea gets flagged, not silently implemented.


---

## Interaction — LOCKED

### Press bloom

Pink is light on this page, so a press emits light. A Material-style ripple is opaque ink spreading across a surface — the wrong physics here. Instead a soft radial glow blooms from the exact contact point and decays over 620ms.

- Bound once, delegated from `document`, so elements rendered later inherit it.
- Fires on `pointerdown`, not `click` — waiting for mouseup is precisely what makes an interface feel unresponsive.
- Bloom diameter scales to the element, so a wide CTA and a small icon button read as the same gesture.
- Solid pink buttons get a white bloom; everything else gets pink.
- Removed from the DOM on `animationend`. Disabled entirely under `prefers-reduced-motion`.

Applied to: both hero doors, fork tabs, term options, all three contact doors, the engine CTA, and the mobile rail.

### Photography treatment

- **Hero:** uniform `rgba(10,9,12,0.42)` cinematic base plus targeted gradient pockets. A flat darkening preserves the photograph's tonal relationships; a `brightness()` filter flattens the snow and muddies the shadows.
- **Rejected:** a soft-light pink pass over the hero as a "restrained duotone". Tested side by side it buried the summit entirely. The colour bridge is delivered by a pink radial *in the sky* instead — light, not a filter.
- **Portrait:** black point lifted from `#000004` to `#0A090C` in the asset pipeline so the headshot dissolves into the page with no visible edge.
- **LQIP:** a 24px inline base64 placeholder (~0.9 KB) paints in the first frame and the real photo cross-fades over it. The hero is never an empty rectangle.

### Verified on the built page — 2026-07-21

Contrast measured from **rendered pixels**, 95th-percentile brightness (worst case for white text):

| Hero band | Background | vs `#FFF` | vs `--color-ink-700` |
|---|---|---|---|
| Eyebrow | `#3D4D67` | 8.55:1 | 6.91:1 |
| Name | `#525878` | 6.94:1 | 5.61:1 |
| Sub-line | `#354253` | 10.22:1 | 8.25:1 |
| Doors | `#262628` | 15.10:1 | 12.20:1 |

Payload: **37 KB** code gzipped · **188 KB** hero · ~264 KB initial total, against a 2 MB budget. Terrain holds 60fps.
