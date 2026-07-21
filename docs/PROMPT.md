# MASTER BUILD PROMPT

**Status:** Ready to use — but **do not run it until GATE 0 and GATE 1 pass** (`05_BUILD_PLAN.md`).

This replaces the "one big prompt" idea. A single mega-prompt drifts and gets buried in context. This one is short on purpose: its job is to **point at the constitution**, because the spec files stay authoritative across every session and every agent.

---

## How to use

1. Answer the blocking Open Questions in `00_BRIEF.md`.
2. Get brokerage permission and Ramsey confirmation (`04_COMPLIANCE.md`).
3. Run **Phase 1 Prompt** below to explore the three design directions.
4. Pick one. Lock `01_DESIGN_SYSTEM.md`.
5. Run the **Build Prompt** for each subsequent phase.

---

## Phase 1 Prompt — design exploration

```
Read these files completely before doing anything:
  docs/00_BRIEF.md
  docs/01_DESIGN_SYSTEM.md
  docs/02_MOTION.md
  docs/04_COMPLIANCE.md

Build three distinct design directions as real, working mockups —
"Alpine Editorial", "Night Glass", and "Signal", as specified in
01_DESIGN_SYSTEM.md. Do not describe them. Build them.

Each mockup must contain:
  1. The hero, with its signature motion
  2. The credentials band, hosting the RamseyTrusted navy badge
     UNMODIFIED — not resized, recolored, cropped, or rearranged
     (04_COMPLIANCE.md §1). A direction that cannot host this badge
     gracefully is disqualified.
  3. One content section showing typography and spacing at work

Hard requirements for all three:
  - Mobile-first, responsive, no horizontal body scroll
  - WCAG 2.1 AA contrast; visible focus states; 44px touch targets
  - Content readable at frame one — motion never gates content
  - prefers-reduced-motion fully honored
  - Performance budget from 02_MOTION.md respected

These are explorations, so take real creative risk — three genuinely
different territories, not three shades of the same idea. This is the
only phase where that freedom exists.

Then stop. Present all three for selection. Do not proceed to build.
```

---

## Build Prompt — Phases 2+

```
Read these files completely before writing any code:
  docs/00_BRIEF.md          positioning, audience, goal ranking
  docs/01_DESIGN_SYSTEM.md  LOCKED tokens — the only permitted values
  docs/02_MOTION.md         motion vocabulary + performance budget
  docs/03_ARCHITECTURE.md   sitemap, sections, copy slots
  docs/04_COMPLIANCE.md     legal and brand constraints — overrides design
  docs/05_BUILD_PLAN.md     stack, phase, gates

Task: [SPECIFY THE PHASE OR COMPONENT]

BINDING RULES — these override your defaults:

1. INHERIT, NEVER INVENT.
   Every color, size, space, duration, and easing comes from
   01_DESIGN_SYSTEM.md or 02_MOTION.md. If a token you need does not
   exist, STOP and propose adding it. Never write a raw value inline.

2. MOTION IS A REWARD, NEVER A GATE.
   All content readable and actionable at frame one. If JS fails, the
   page still works and still looks good. Use only the motion primitives
   defined in 02_MOTION.md — a new one requires an addition to that file.

3. COMPLIANCE OVERRIDES DESIGN.
   The Ramsey badge is never resized, recolored, cropped, or rearranged.
   "Pink Realty" appears per Colorado Rule 6.10. No claim about the
   Ramsey relationship beyond the approved language in 04_COMPLIANCE.md.
   Neighborhood and marketing copy gets a Fair Housing pass: describe
   places, never the people who live there.

4. PERFORMANCE IS A GATE, NOT A CLEANUP TASK.
   The budget in 02_MOTION.md is a hard limit on throttled mobile.
   Over budget does not ship. Do not defer optimization.

5. ACCESSIBILITY IS NON-NEGOTIABLE.
   Mobile-first. WCAG 2.1 AA. 44px targets. Visible focus. Full keyboard
   operability including the Affordability Engine. prefers-reduced-motion
   honored completely — reduced motion never means a reduced site.

6. NO PLACEHOLDERS.
   Every block fully implemented. No "// rest of code here". No code
   written against an undefined token, config value, or schema field —
   that is a stop-and-flag moment, not an invent-inline moment.

7. FILE DISCIPLINE.
   Under 500 lines. Decompose components. Nothing in the project root.

8. WHEN IN DOUBT ABOUT VOICE:
   Would a debt-free Ramsey follower AND a VA first-time buyer both feel
   respected reading this? If a line only works for one, it belongs on a
   track page, not the homepage.

Before finishing, verify: contrast, touch targets, responsive behavior,
no console logs, no unused imports, no value used that isn't defined in
the design system.
```

---

## The one-paragraph version

For when you need to brief someone fast:

> A high-end, motion-rich personal website for a licensed Colorado Springs real estate agent at Pink Realty who holds a Dave Ramsey program credential and works with both buyers and sellers. The site's identity is the agent — Ramsey and Pink Realty are supporting credentials, not the brand. Two primary journeys (buying and selling); inside buying, the visitor self-selects between a Ramsey-aligned debt-free track, a first-time-buyer track, and a military/PCS track, so the two financing philosophies never contradict each other on screen. Visual reference points are Foundry UK, Apple Intelligence, and b-egg.farm — cinematic, restrained, expensive-feeling, with one engineered showpiece: an Affordability Engine built on Ramsey's 25%-of-take-home / 15-year-fixed rule that resolves a number into actual Colorado Springs neighborhoods in real time. Motion is a reward layered on a page that already works, never a gate — hard mobile performance budget, full reduced-motion support, WCAG AA throughout. Curated listings only, no IDX. Legally constrained by Ramsey's unmodifiable badge rules, Colorado Rule 6.10 brokerage attribution, and Fair Housing.
